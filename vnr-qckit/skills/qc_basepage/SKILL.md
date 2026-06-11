---
description: "[Internal] Called by /vnr-qckit:qc_pre. Create or update .specify/tests/pages/BasePage.ts from the VNR Playwright template."
user-invocable: false
---

# /qc_basepage

## Mục đích

Tạo hoặc cập nhật `.specify/tests/pages/BasePage.ts`, lớp cha chứa common methods cho toàn bộ Page Object trong project.

Không tích hợp command này vào pipeline tự động. Chỉ chạy khi setup project mới hoặc khi cần cập nhật BasePage có chủ đích.

## Bước 1 - Kiểm tra file hiện tại

```powershell
Test-Path .specify/tests/pages/BasePage.ts
```

| Kết quả | Hành động |
| --- | --- |
| `False` | Tạo mới từ template nội tuyến bên dưới. |
| `True` | Đọc file hiện tại, không ghi đè nếu không có yêu cầu sửa. |

## Bước 2 - Tạo mới BasePage.ts

Khi thiếu file:

1. Tạo thư mục `.specify/tests/pages`.
2. Ghi `.specify/tests/pages/BasePage.ts` với nội dung từ phần **Template** bên dưới.
3. Không đổi signature method trong template.

### Template

```typescript
import { Page, Locator, expect } from '@playwright/test'
import { test } from '@playwright/test'
import fs from 'fs'
import path from 'path'

// — Đọc APP_URL từ .env chain (.env → .env.{ENV}) --------------------------------
// Phải đọc trực tiếp trong worker vì Playwright fork worker độc lập,
// không kế thừa process.env được set trong playwright.config.ts.

function _resolveAppUrl(): string {
  try {
    const root = path.resolve(__dirname, '..')          // .specify/tests/
    const readEnv = (fp: string): Record<string, string> => {
      if (!fs.existsSync(fp)) return {}
      return Object.fromEntries(
        fs.readFileSync(fp, 'utf-8').split('\n')
          .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
          .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
      )
    }
    const { ENV } = readEnv(path.join(root, '.env'))
    const envVars = ENV ? readEnv(path.join(root, `.env.${ENV}`)) : {}
    // Strip trailing /# hoặc / hoặc # để giữ base URL sạch
    // navigate() sẽ luôn thêm /# khi ghép path
    return (process.env.APP_URL || envVars.APP_URL || '').replace(/[/\#]+$/, '')
  } catch { return '' }
}

const _APP_URL = _resolveAppUrl()

// — Kiểu dữ liệu cho bảng -----------------------------------------------------------

/** Hành vi của cell: nhập, verify, hoặc cả hai */
export type CellAction = 'input' | 'verify' | 'input+verify'

export interface TableCell {
  /** Tên cột – khớp key trong columnMap của Page Object */
  col: string
  /** Giá trị cần nhập hoặc verify */
  val: string
  /** Hành vi: 'input' | 'verify' | 'input+verify' */
  action: CellAction
}

/** Một dòng bảng = mảng phẳng các cell (không bọc trong {cells:[...]}) */
export type TableRow = TableCell[]

// — BasePage -----------------------------------------------------------------------

export class BasePage {
  constructor(protected readonly page: Page) {}

  // — Navigation & Dialog ----------------------------------------------------------

  /**
   * goto + waitUntil domcontentloaded.
   *
   * Navigation luôn dùng hash fragment — đảm bảo URL đúng cho SPA hash-routing.
   *
   * Logic resolve URL:
   *   - url đã là absolute ('https://...')    → giữ nguyên
   *   - url bắt đầu bằng '/#' (hash path)     → _APP_URL + url
   *                                              ví dụ: /#/Hrm_Main_Web/Cat → https://host:port/#/Hrm_Main_Web/Cat
   *   - url bắt đầu bằng '/' (relative path)  → _APP_URL + '/#' + url
   *                                              ví dụ: /Cat_LeaveDayType  → https://host:port/#/Cat_LeaveDayType
   *
   * _APP_URL được strip sẵn /# ở cuối trong _resolveAppUrl(),
   * nên phép nối luôn tạo ra đúng một dấu '#' trong URL.
   */
  async navigate(url: string) {
    let resolved: string
    if (url.startsWith('https://') || url.startsWith('http://')) {
      resolved = url
    } else if (url.startsWith('/#')) {
      // Đã có hash prefix — ghép thẳng
      resolved = `${_APP_URL}${url}`
    } else {
      // Path thông thường — chèn /# giữa base và path
      const path_ = url.startsWith('/') ? url : `/${url}`
      resolved = `${_APP_URL}/#${path_}`
    }
    await this.page.goto(resolved, { waitUntil: 'domcontentloaded' })
  }

  /**
   * Click nút confirm dialog nếu xuất hiện trong timeout.
   * No-op nếu dialog không hiện.
   */
  async handleConfirmDialog(btnText: string, timeout = 3000) {
    const btn = this.page.getByRole('button', { name: btnText })
    const visible = await btn.isVisible({ timeout }).catch(() => false)
    if (visible) await btn.click()
  }

  /** Chờ toast/notification chứa text */
  async waitForToast(text: string | RegExp, timeout = 10000) {
    await this.page
      .locator('[class*="toast"], [class*="notification"], [class*="message"]')
      .filter({ hasText: text })
      .waitFor({ timeout })
  }

  /** Assert URL hiện tại khớp pattern */
  async verifyUrl(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern)
  }

  // — Textbox ----------------------------------------------------------------------

  /**
   * Nhập text vào textbox.
   * Log: Nhập "{value}" vào "{label}"
   */
  async inputTextbox(locator: Locator, value: string, label = 'textbox') {
    await test.step(`Nhập "${value}" vào "${label}"`, async () => {
      await locator.click()
      await locator.fill(value)
    })
  }

  /**
   * Verify giá trị textbox.
   * Log: Kiểm tra "{label}" = "{expected}"
   */
  async verifyTextbox(locator: Locator, expected: string, label = 'textbox') {
    await test.step(`Kiểm tra "${label}" = "${expected}"`, async () => {
      await expect(locator).toHaveValue(expected)
    })
  }

  // — Combobox (jQuery UI autocomplete) --------------------------------------------

  /**
   * Nhập vào combobox kiểu jQuery UI autocomplete, chờ dropdown, chọn item khớp.
   * Log: Nhập "{value}" vào combobox "{label}"
   */
  async inputCombobox(locator: Locator, value: string, label = 'combobox') {
    await test.step(`Nhập "${value}" vào combobox "${label}"`, async () => {
      await test.step(`nhập text "${value}"`, async () => {
        await locator.fill(value)
        await this.page.waitForTimeout(800)
      })

      await test.step(`chọn dropdown item "${value}"`, async () => {
        const item = this.page
          .locator('.ui-autocomplete li.ui-menu-item')
          .filter({ hasText: value })
          .first()
        const hasItem = await item.isVisible({ timeout: 3000 }).catch(() => false)
        if (hasItem) {
          await item.click()
        } else {
          // Không có dropdown -> nhấn Tab để confirm
          await locator.press('Tab')
        }
        await this.page.waitForTimeout(500)
      })
    })
  }

  // — Checkbox ---------------------------------------------------------------------

  /**
   * Tích hoặc bỏ tích checkbox.
   * Log: Tích checkbox "{label}" = {checked}
   */
  async inputCheckbox(locator: Locator, checked: boolean, label = 'checkbox') {
    await test.step(`Tích checkbox "${label}" = ${checked}`, async () => {
      const current = await locator.isChecked()
      if (current !== checked) {
        await locator.click()
      }
    })
  }

  /**
   * Verify trạng thái checkbox.
   * Log: Kiểm tra checkbox "{label}" = {expected}
   */
  async verifyCheckbox(locator: Locator, expected: boolean, label = 'checkbox') {
    await test.step(`Kiểm tra checkbox "${label}" = ${expected}`, async () => {
      if (expected) {
        await expect(locator).toBeChecked()
      } else {
        await expect(locator).not.toBeChecked()
      }
    })
  }

  // — Table ------------------------------------------------------------------------

  /**
   * Nhập dữ liệu vào bảng theo danh sách rows.
   * @param tbodyLocator    Locator trỏ vào <tbody> của bảng
   * @param addRowLocator   Locator nút "Thêm dòng" – luôn click để thêm dòng mới
   * @param rows            Danh sách dòng cần nhập (TableRow[])
   * @param columnMap       Map tên cột -> hàm trả về Locator cell trong row
   *
   * Với mỗi row:
   * - Luôn click addRowLocator để thêm dòng mới, lấy tr cuối cùng
   * - Duyệt theo thứ tự key của columnMap (= thứ tự cột trên UI)
   * - action 'input' / 'input+verify' -> click cell, fill value
   * - action 'verify' / 'input+verify' -> expect cell có text/value
   */
  async inputTable(
    tbodyLocator: Locator,
    addRowLocator: Locator,
    rows: TableRow[],
    columnMap: Record<string, (row: Locator) => Locator>
  ) {
    for (let i = 0; i < rows.length; i++) {
      const rowData = rows[i]
      const summary = rowData
        .map(c => `${c.col}="${c.val}"`)
        .join(', ')

      await test.step(`Nhập dòng ${i + 1}: ${summary}`, async () => {
        await test.step('Thêm dòng mới', async () => {
          await addRowLocator.click()
          await this.page.waitForTimeout(500)
        })

        const count = await tbodyLocator.locator('tr').count()
        const rowLocator = tbodyLocator.locator('tr').nth(count - 1)

        for (const colName of Object.keys(columnMap)) {
          const cell = rowData.find(c => c.col === colName)
          if (!cell || cell.action === 'verify') continue
          const cellLocator = columnMap[colName]?.(rowLocator)
          if (!cellLocator) continue

          await test.step(`Nhập "${cell.val}" vào "${cell.col}"`, async () => {
            await cellLocator.click()
            await this.page.waitForTimeout(300)

            const inp = this.page.locator('input:focus, [contenteditable]:focus').first()
            const isInput = await inp.isVisible({ timeout: 1000 }).catch(() => false)
            if (isInput) {
              await inp.fill(cell.val)
            }
          })
        }

        const summaryVerify = rowData
          .filter(c => c.action === 'verify' || c.action === 'input+verify')
          .map(c => `${c.col}="${c.val}"`)
          .join(', ')

        if (!summaryVerify) return

        await test.step(`Kiểm tra dòng ${i + 1}: ${summaryVerify}`, async () => {
          for (const colName of Object.keys(columnMap)) {
            const cell = rowData.find(c => c.col === colName)
            if (!cell || cell.action === 'input') continue
            const cellLocator = columnMap[colName]?.(rowLocator)
            if (!cellLocator) continue

            await test.step(`Kiểm tra "${cell.col}" = "${cell.val}"`, async () => {
              await expect(cellLocator).toHaveText(cell.val)
            })
          }
        })
      })
    }
  }
}
```

## Bước 3 - Verify bằng Playwright

Mục tiêu:

- Xác nhận method hoạt động trên UI thực tế.
- Phát hiện selector hoặc logic không tương thích.

Đọc `ENV` và `APP_URL` giống `/qc_pre`.

Tạo test tạm:

```text
.specify/tests/tmp/_basepage_verify.spec.ts
```

Chạy:

```powershell
Set-Location .specify/tests
npx playwright test tmp/_basepage_verify.spec.ts --workers=1
```

## Method cần verify

| Method | Cách kiểm tra |
| --- | --- |
| `navigate(url)` | Điều hướng đến URL. |
| `verifyUrl(pattern)` | Kiểm tra URL hiện tại. |
| `inputTextbox(locator, value)` | Nhập text. |
| `verifyTextbox(locator, expected)` | Kiểm tra value. |
| `inputCombobox(locator, value)` | Chọn option từ dropdown/autocomplete. |
| `inputCheckbox(locator, checked)` | Tick hoặc bỏ tick checkbox. |
| `verifyCheckbox(locator, expected)` | Verify trạng thái checkbox. |
| `waitForToast(text)` | Verify toast/notification. |
| `handleConfirmDialog(btnText)` | Xử lý confirm dialog. |
| `inputTable(...)` | Nhập dữ liệu table. |
| `verifyTable(...)` | Verify dữ liệu table nếu method tồn tại. |

Nếu màn hình hiện tại không có element phù hợp, đánh dấu `SKIP`, không đánh dấu fail.

## Bước 4 - Sửa method fail

Chỉ được sửa:

- Selector.
- Timeout.
- Logic nội bộ.
- Class name.

Không được sửa:

- Tên method.
- Số lượng tham số.
- Kiểu trả về.
- Public signature.
- Xóa method.

Sau khi sửa, chạy lại Bước 3.

## Bước 5 - Dọn dẹp

Xóa test tạm:

```powershell
Remove-Item .specify/tests/tmp/_basepage_verify.spec.ts -Force
```

## Báo cáo cuối

```text
Kết quả kiểm thử BasePage

Pass    : {n}
Skip    : {n}
FailFix : {n}
Failed  : {n}

BasePage.ts sẵn sàng sử dụng.
```

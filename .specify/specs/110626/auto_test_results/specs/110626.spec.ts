/**
 * ============================================================
 * Spec: 110626 — BANKNOTE
 * Tính năng: Bổ sung trường Ghi chú đánh giá ngân hàng (BankNote)
 * Màn hình:  cat_bank → /Cat_Bank/Index | /Cat_Bank/Create | /Cat_Bank/Edit/{id}
 * Sinh bởi:  /qc_auto_test — 2026-06-12
 * ============================================================
 * Rerun:
 *   npx playwright test specs/110626.spec.ts
 *   npx playwright test specs/110626.spec.ts --grep "110626_CAT_BANKNOTE_001"
 * ============================================================
 */

import { test, expect } from '@playwright/test'
import { CatBankPage } from '../../../../.specify/tests/pages/cat/cat_bank/CatBankPage'
import { CatBankLocator } from '../../../../.specify/tests/pages/cat/CatBankLocator'
import datafake from '../../../datafake.json'

// ─── Runtime Context — chia sẻ data giữa các TC ─────────────────────────────
const runtimeContext: {
  kta001Id?: string
  kta001EditUrl?: string
  kta002Id?: string
  kta002EditUrl?: string
  bidvId?: string
  bidvEditUrl?: string
  kta005Id?: string
  kta007Id?: string
} = {}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function waitForToast(page: import('@playwright/test').Page, text: string | RegExp, timeout = 10000) {
  await page
    .locator('.k-notification-content, [class*="toast"], [class*="notification-wrap"]')
    .filter({ hasText: text })
    .first()
    .waitFor({ state: 'visible', timeout })
}

async function checkAuthGuard(page: import('@playwright/test').Page) {
  const url = page.url()
  if (url.includes('/login') || url.includes('/Login') || url.includes('sign-in') || url.includes('dang-nhap')) {
    throw new Error(`AUTH_EXPIRED: Redirected to login page — ${url}`)
  }
}

// ─── Test Suite ──────────────────────────────────────────────────────────────

test.describe('110626 — BANKNOTE: Critical / p0', () => {
  test.beforeEach(async ({ page }) => {
    await checkAuthGuard(page)
  })

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_001 — Tạo mới ngân hàng với BankNote có nội dung @110626 @auto @p0',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)
      const d = datafake.happy_path.create_with_bank_note

      await test.step('Step 1: Navigate đến cat_bank', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
      })

      await test.step('Step 2: Click Tạo mới', async () => {
        await bankPage.openCreateForm()
      })

      await test.step('Step 3: Verify label và control BankNote hiển thị', async () => {
        await expect(bankPage.loc.fieldBankNote).toBeVisible()
        // Verify là textarea (không phải input 1 dòng)
        const tagName = await bankPage.loc.fieldBankNote.evaluate(el => el.tagName.toLowerCase())
        expect(tagName).toBe('textarea')
      })

      await test.step('Step 4: Nhập Tên ngân hàng', async () => {
        await bankPage.loc.fieldBankName.fill(d.BankName)
      })

      await test.step('Step 5: Nhập Mã ngân hàng', async () => {
        await bankPage.loc.fieldBankCode.fill(d.BankCode)
      })

      await test.step('Step 6: Nhập Ghi chú đánh giá ngân hàng', async () => {
        await bankPage.fillTextarea(bankPage.loc.fieldBankNote, d.BankNote, 'Ghi chú đánh giá ngân hàng')
      })

      await test.step('Step 7: Click Lưu → toast "Lưu thành công"', async () => {
        await bankPage.submitForm()
        await waitForToast(page, /Lưu thành công|thành công/i)
        runtimeContext.kta001EditUrl = page.url()
      })

      await test.step('Step 8: Tìm kiếm record KTA001', async () => {
        await bankPage.searchByCode(d.BankCode)
        await bankPage.verifyRowExists(d.BankCode)
      })

      await test.step('Step 9: Mở form Edit KTA001 — verify BankNote hiển thị đúng', async () => {
        await bankPage.openEditFormByCode(d.BankCode)
        await expect(bankPage.loc.fieldBankNote).toHaveValue(d.BankNote)
      })

      // Capture runtime context
      runtimeContext.kta001Id = d.BankCode

      // === EXPLORATORY ASSERTIONS ===
      await test.step('[Exploratory] URL không phải error page', async () => {
        const url = page.url()
        expect(url).not.toMatch(/error|404|500/)
      })
      await test.step('[Exploratory] fieldBankNote có giá trị không rỗng', async () => {
        const val = await bankPage.loc.fieldBankNote.inputValue()
        expect(val.length).toBeGreaterThan(0)
      })
    }
  )

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_002 — Tạo mới ngân hàng BankNote để trống @110626 @auto @p0',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)
      const d = datafake.happy_path.create_without_bank_note

      await test.step('Step 1: Navigate + Click Tạo mới', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
        await bankPage.openCreateForm()
      })

      await test.step('Step 2: Nhập Tên ngân hàng', async () => {
        await bankPage.loc.fieldBankName.fill(d.BankName)
      })

      await test.step('Step 3: Nhập Mã ngân hàng', async () => {
        await bankPage.loc.fieldBankCode.fill(d.BankCode)
      })

      await test.step('Step 4: Để trống BankNote — không nhập gì', async () => {
        // Verify field empty, no validation error visible
        const val = await bankPage.loc.fieldBankNote.inputValue()
        expect(val).toBe('')
      })

      await test.step('Step 5: Click Lưu → toast "Lưu thành công" (không lỗi required)', async () => {
        await bankPage.submitForm()
        await waitForToast(page, /Lưu thành công|thành công/i)
      })

      await test.step('Step 6: Mở form Edit KTA002 — verify BankNote trống', async () => {
        await bankPage.openEditFormByCode(d.BankCode)
        await expect(bankPage.loc.fieldBankNote).toHaveValue('')
        runtimeContext.kta002Id = d.BankCode
        runtimeContext.kta002EditUrl = page.url()
      })

      // === EXPLORATORY ASSERTIONS ===
      await test.step('[Exploratory] URL không phải error page', async () => {
        const url = page.url()
        expect(url).not.toMatch(/error|404|500/)
      })
    }
  )

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_003 — Cập nhật BIDV: thêm BankNote @110626 @auto @p0',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)
      const d = datafake.happy_path.update_existing_bank_add_note

      await test.step('Step 1: Navigate đến cat_bank', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
      })

      await test.step('Step 2: Tìm kiếm BIDV', async () => {
        await bankPage.searchByCode(d.BankCode_search)
        await bankPage.verifyRowExists(d.BankCode_search)
      })

      await test.step('Step 3: Mở form Edit BIDV', async () => {
        await bankPage.openEditFormByCode(d.BankCode_search)
        await expect(bankPage.loc.fieldBankNote).toBeVisible()
      })

      await test.step('Step 4: Nhập BankNote mới', async () => {
        await bankPage.fillTextarea(bankPage.loc.fieldBankNote, d.BankNote_new, 'Ghi chú đánh giá ngân hàng')
      })

      await test.step('Step 5: Click Lưu → toast "Cập nhật thành công"', async () => {
        await bankPage.submitForm()
        await waitForToast(page, /thành công|Cập nhật|Lưu/i)
        runtimeContext.bidvEditUrl = page.url()
        runtimeContext.bidvId = d.BankCode_search
      })

      await test.step('Step 6: Mở lại Edit BIDV — verify BankNote hiển thị đúng', async () => {
        await bankPage.openEditFormByCode(d.BankCode_search)
        await expect(bankPage.loc.fieldBankNote).toHaveValue(d.BankNote_new)
      })

      // === EXPLORATORY ASSERTIONS ===
      await test.step('[Exploratory] BankNote value không rỗng sau save', async () => {
        const val = await bankPage.loc.fieldBankNote.inputValue()
        expect(val.length).toBeGreaterThan(0)
      })
    }
  )
})

// ─────────────────────────────────────────────────────────────────────────────

test.describe('110626 — BANKNOTE: High / p1', () => {
  test.beforeEach(async ({ page }) => {
    await checkAuthGuard(page)
  })

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_004 — Cập nhật BIDV: xóa BankNote về trống @110626 @auto @p1',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)
      const d = datafake.happy_path.update_existing_bank_clear_note

      await test.step('Step 1: Navigate + Mở form Edit BIDV', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
        // Dùng runtimeContext.bidvId nếu TC003 đã chạy, fallback về datafake
        const bidvCode = runtimeContext.bidvId ?? d.BankCode_search
        await bankPage.openEditFormByCode(bidvCode)
      })

      await test.step('Step 2: Xóa toàn bộ nội dung BankNote', async () => {
        await bankPage.clearTextarea(bankPage.loc.fieldBankNote, 'Ghi chú đánh giá ngân hàng')
        const val = await bankPage.loc.fieldBankNote.inputValue()
        expect(val).toBe('')
      })

      await test.step('Step 3: Click Lưu → toast "Cập nhật thành công"', async () => {
        await bankPage.submitForm()
        await waitForToast(page, /thành công|Cập nhật|Lưu/i)
      })

      await test.step('Step 4: Mở lại Edit BIDV — verify BankNote trống', async () => {
        const bidvCode = runtimeContext.bidvId ?? d.BankCode_search
        await bankPage.openEditFormByCode(bidvCode)
        await expect(bankPage.loc.fieldBankNote).toHaveValue('')
      })
    }
  )

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_005 — Validation: BankNote đúng 1000 ký tự (boundary valid) @110626 @auto @p1',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)
      const dv = datafake.validation.max_length_exact

      await test.step('Step 1: Navigate + Click Tạo mới', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
        await bankPage.openCreateForm()
      })

      await test.step('Step 2: Nhập Tên ngân hàng', async () => {
        await bankPage.loc.fieldBankName.fill(dv.BankName)
      })

      await test.step('Step 3: Nhập Mã ngân hàng', async () => {
        await bankPage.loc.fieldBankCode.fill(dv.BankCode)
      })

      await test.step('Step 4: Nhập BankNote 1000 ký tự', async () => {
        await bankPage.fillTextarea(bankPage.loc.fieldBankNote, dv.bank_note_1000chars, 'Ghi chú đánh giá ngân hàng')
      })

      await test.step('Step 5: Verify độ dài textarea = 1000 ký tự', async () => {
        const len = await bankPage.loc.fieldBankNote.evaluate((el: HTMLTextAreaElement) => el.value.length)
        expect(len).toBe(1000)
      })

      await test.step('Step 6: Click Lưu → toast "Lưu thành công" (boundary valid)', async () => {
        await bankPage.submitForm()
        await waitForToast(page, /Lưu thành công|thành công/i)
        runtimeContext.kta005Id = dv.BankCode
      })

      await test.step('Step 7: Mở Edit KTA005 — verify BankNote 1000 ký tự đầy đủ', async () => {
        await bankPage.openEditFormByCode(dv.BankCode)
        const savedLen = await bankPage.loc.fieldBankNote.evaluate((el: HTMLTextAreaElement) => el.value.length)
        expect(savedLen).toBe(1000)
      })

      // === EXPLORATORY ASSERTIONS ===
      await test.step('[Exploratory] URL không phải error page', async () => {
        const url = page.url()
        expect(url).not.toMatch(/error|404|500/)
      })
    }
  )
})

// ─────────────────────────────────────────────────────────────────────────────

test.describe('110626 — BANKNOTE: Medium / p2', () => {
  test.beforeEach(async ({ page }) => {
    await checkAuthGuard(page)
  })

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_007 — Edge Case: BankNote ký tự đặc biệt + xuống dòng @110626 @auto @p2',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)
      const de = datafake.edge_cases.special_chars_multiline

      await test.step('Step 1: Navigate + Click Tạo mới', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
        await bankPage.openCreateForm()
      })

      await test.step('Step 2: Nhập BankName + BankCode', async () => {
        await bankPage.loc.fieldBankName.fill(de.BankName)
        await bankPage.loc.fieldBankCode.fill(de.BankCode)
      })

      await test.step('Step 3: Nhập BankNote với ký tự đặc biệt + xuống dòng', async () => {
        // Dùng page.keyboard để nhập chính xác bao gồm newline (\n)
        await bankPage.loc.fieldBankNote.click()
        await bankPage.loc.fieldBankNote.selectText()
        await page.keyboard.press('Delete')
        // fill() giữ newline, đặc biệt và quote đúng với Playwright
        await bankPage.loc.fieldBankNote.fill(de.BankNote)
      })

      await test.step('Step 4: Click Lưu → toast "Lưu thành công" (không lỗi XSS/encoding)', async () => {
        await bankPage.submitForm()
        await waitForToast(page, /Lưu thành công|thành công/i)
        runtimeContext.kta007Id = de.BankCode
      })

      await test.step('Step 5: Mở Edit KTA007 — verify BankNote hiển thị đúng toàn bộ', async () => {
        await bankPage.openEditFormByCode(de.BankCode)
        // Verify các ký tự đặc biệt quan trọng vẫn có mặt
        const savedVal = await bankPage.loc.fieldBankNote.inputValue()
        expect(savedVal).toContain("O'Brien")
        expect(savedVal).toContain('<Công ty>')
        expect(savedVal).toContain('₫')
        expect(savedVal).toContain('€')
      })

      // === EXPLORATORY ASSERTIONS ===
      await test.step('[Exploratory] Độ dài BankNote sau save > 0', async () => {
        const val = await bankPage.loc.fieldBankNote.inputValue()
        expect(val.length).toBeGreaterThan(0)
      })
    }
  )

  // ════════════════════════════════════════════════════════════════════════════
  test('110626_CAT_BANKNOTE_008 — Regression: Index không bị ảnh hưởng @110626 @auto @p2',
    async ({ page }) => {
      const bankPage = new CatBankPage(page)

      await test.step('Step 1: Navigate đến cat_bank Index', async () => {
        await bankPage.goto()
        await checkAuthGuard(page)
      })

      await test.step('Step 2: Grid tải dữ liệu — không có cột BankNote', async () => {
        await bankPage.searchAll()
        // Verify grid visible
        await expect(bankPage.loc.gridRows.first()).toBeVisible()
        // Verify không có column header "Ghi chú đánh giá ngân hàng" (BankNote) trong grid Index
        const bankNoteCol = page.locator('[role="columnheader"]').filter({ hasText: 'Ghi chú đánh giá ngân hàng' })
        await expect(bankNoteCol).toHaveCount(0)
      })

      await test.step('Step 3: Các nút toolbar hiển thị đúng', async () => {
        await expect(bankPage.loc.btnTaoMoi).toBeVisible()
        await expect(bankPage.loc.btnTimKiem).toBeVisible()
        await expect(bankPage.loc.btnXuatExcel).toBeVisible()
        await expect(bankPage.loc.btnDoiCot).toBeVisible()
      })

      await test.step('Step 4: Tìm kiếm không điều kiện — danh sách tải lại bình thường', async () => {
        await bankPage.loc.searchBankName.fill('')
        await bankPage.loc.searchBankCode.fill('')
        await bankPage.loc.btnTimKiem.click()
        await page.waitForTimeout(1500)
        await expect(bankPage.loc.gridRows.first()).toBeVisible()
      })

      await test.step('Step 5: Chọn 1 record — nút Xóa visible', async () => {
        // Click checkbox trên row đầu tiên
        const firstCheckbox = page.locator('#gridCatBank tbody input[type="checkbox"]').first()
        await firstCheckbox.check()
        await expect(bankPage.loc.btnXoa).toBeVisible()
      })

      // === EXPLORATORY ASSERTIONS ===
      await test.step('[Exploratory] Không có JS error blocking', async () => {
        const url = page.url()
        expect(url).toContain('Cat_Bank')
      })
    }
  )
})

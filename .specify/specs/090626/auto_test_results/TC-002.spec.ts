import { test, expect } from '@playwright/test'
import { CatLeaveDayTypePage } from '../../../../.specify/tests/pages/cat/cat_leave_day_type/CatLeaveDayTypePage'
import datafake from '../datafake.json'

// TC-002 — Cấu hình MaxRequestPerMonth thành công
// PBI: 090626 | Group: Cấu hình | Priority: P1

test('TC-002 — Cấu hình MaxRequestPerMonth thành công', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: Tồn tại loại ngày nghỉ datafake.config.leave_type_name ("Nghỉ kết hôn TEST") trong hệ thống
  const catPage = new CatLeaveDayTypePage(page)

  // Bước 1: Điều hướng đến danh sách
  await catPage.goto()

  // Bước 2: Tìm dòng trong grid và click mở form sửa
  const row = page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.config.leave_type_name }).first()
  await row.click()

  // Bước 3: Nhập MaxRequestPerMonth
  await catPage.inputTextbox(page.locator('input[name="MaxRequestPerMonth"]'), datafake.config.max_request_per_month, 'Số lần tối đa/tháng')

  // Bước 4: Lưu form
  await catPage.submitForm()

  // Verify: Toast thành công
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"]').filter({ hasText: /thành công/i })
  ).toBeVisible({ timeout: 10000 })

  // Bước 5: Mở lại form và verify giá trị persist
  await catPage.goto()
  const row2 = page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.config.leave_type_name }).first()
  await row2.click()
  await expect(page.locator('input[name="MaxRequestPerMonth"]')).toHaveValue(datafake.config.max_request_per_month)
})

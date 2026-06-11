import { test, expect } from '@playwright/test'
import { CatLeaveDayTypePage } from '../../../../.specify/tests/pages/cat/cat_leave_day_type/CatLeaveDayTypePage'
import datafake from '../datafake.json'

// TC-004 — Cấu hình IsConsecutive = false (tắt)
// PBI: 090626 | Group: Cấu hình | Priority: P1

test('TC-004 — Cấu hình IsConsecutive = false (tắt)', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: Loại ngày nghỉ datafake.consecutive.leave_type_name ("Nghỉ hiếu TEST") có IsConsecutive = true
  const catPage = new CatLeaveDayTypePage(page)

  // Bước 1: Điều hướng → mở form sửa
  await catPage.goto()
  const row = page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.consecutive.leave_type_name }).first()
  await row.click()

  // Bước 2: Tắt checkbox IsConsecutive = false
  await catPage.inputCheckbox(page.locator('input[name="IsConsecutive"]'), false, 'Đăng ký liên tiếp')

  // Bước 3: Lưu
  await catPage.submitForm()

  // Verify: Toast thành công
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"]').filter({ hasText: /thành công/i })
  ).toBeVisible({ timeout: 10000 })

  // Bước 4: Mở lại form kiểm tra
  await catPage.goto()
  const row2 = page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.consecutive.leave_type_name }).first()
  await row2.click()
  await expect(page.locator('input[name="IsConsecutive"]')).not.toBeChecked()
})

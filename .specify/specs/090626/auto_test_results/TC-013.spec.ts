import { test, expect } from '@playwright/test'
import { AttLeaveDayPage } from '../../../../.specify/tests/pages/att/att_leave_day/AttLeaveDayPage'
import datafake from '../datafake.json'

// TC-013 — Gap trước đơn cũ — hard block
// PBI: 090626 | Group: Business rule | Priority: P1

test('TC-013 — Gap trước đơn cũ — hard block', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: NV có đơn active 05/06/2026–07/06/2026 loại "Nghỉ hiếu TEST", IsConsecutive = true
  const leaveDayPage = new AttLeaveDayPage(page)

  // Bước 1: Điều hướng
  await leaveDayPage.goto()

  // Bước 2+3: Mở form và điền dữ liệu
  // new_start=01/06, new_end=03/06 → gap ngày 04/06 (04/06 ≠ 05/06 existing_start)
  await leaveDayPage.openCreateForm()
  await leaveDayPage.fillCreateForm({
    loaiNgayNghi: datafake.consecutive.leave_type_name,
    ngayBatDau: datafake.tc013.new_start,   // 01/06/2026
    ngayKetThuc: datafake.tc013.new_end,    // 03/06/2026
  })

  // Bước 4: Submit
  await leaveDayPage.submitForm()

  // Verify: Hard block — 03/06 + 1 = 04/06 ≠ 05/06 (existing_start) → gap
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"], [class*="error"], [class*="alert"]')
      .filter({ hasText: /liên tiếp|tiếp nối/i })
  ).toBeVisible({ timeout: 10000 })

  // Verify: Đơn KHÔNG được lưu
  const newRecord = page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.tc013.new_start })
  await expect(newRecord).not.toBeVisible()
})

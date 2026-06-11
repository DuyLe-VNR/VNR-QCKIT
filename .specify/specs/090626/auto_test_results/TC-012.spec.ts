import { test, expect } from '@playwright/test'
import { AttLeaveDayPage } from '../../../../.specify/tests/pages/att/att_leave_day/AttLeaveDayPage'
import datafake from '../datafake.json'

// TC-012 — Gap sau đơn cũ — hard block (BR-NEW-02)
// PBI: 090626 | Group: Business rule | Priority: P1

test('TC-012 — Gap sau đơn cũ — hard block (BR-NEW-02)', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: NV có đơn active 05/06/2026–07/06/2026 loại "Nghỉ hiếu TEST", IsConsecutive = true
  // (Có thể tạo trong cùng test suite trước TC này)
  const leaveDayPage = new AttLeaveDayPage(page)

  // Bước 1: Điều hướng
  await leaveDayPage.goto()

  // Bước 2+3: Mở form và điền dữ liệu
  await leaveDayPage.openCreateForm()
  await leaveDayPage.fillCreateForm({
    loaiNgayNghi: datafake.consecutive.leave_type_name,
    ngayBatDau: datafake.tc012.new_start,   // 09/06/2026 — gap ngày 08/06
    ngayKetThuc: datafake.tc012.new_end,
  })

  // Bước 4: Submit
  await leaveDayPage.submitForm()

  // Verify: Hard block hiển thị với message yêu cầu liên tiếp
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"], [class*="error"], [class*="alert"]')
      .filter({ hasText: /liên tiếp|tiếp nối/i })
  ).toBeVisible({ timeout: 10000 })

  // Verify: Đơn KHÔNG được lưu (không có record ngày 09/06 trong grid)
  const newRecord = page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.tc012.new_start })
  await expect(newRecord).not.toBeVisible()
})

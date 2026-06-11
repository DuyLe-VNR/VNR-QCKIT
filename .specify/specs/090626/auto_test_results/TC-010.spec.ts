import { test, expect } from '@playwright/test'
import { AttLeaveDayPage } from '../../../../.specify/tests/pages/att/att_leave_day/AttLeaveDayPage'
import datafake from '../datafake.json'

// TC-010 — Đơn đầu tiên trong tháng — luôn pass (EX-003)
// PBI: 090626 | Group: Happy path | Priority: P1

test('TC-010 — Đơn đầu tiên trong tháng — luôn pass (EX-003)', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: IsConsecutive = true trên loại datafake.consecutive.leave_type_name ("Nghỉ hiếu TEST")
  // PRECONDITION: NV (đăng nhập hiện tại) chưa có đơn active nào loại "Nghỉ hiếu TEST" trong tháng 06/2026
  const leaveDayPage = new AttLeaveDayPage(page)

  // Bước 1: Điều hướng
  await leaveDayPage.goto()

  // Bước 2: Tạo đơn đầu tiên trong tháng — IsConsecutive không check khi chưa có đơn nào (EX-003)
  await leaveDayPage.createLeaveDay({
    loaiNgayNghi: datafake.consecutive.leave_type_name,
    ngayBatDau: datafake.tc010.date_start,
    ngayKetThuc: datafake.tc010.date_end,
  })

  // Verify: Không block → Toast thành công
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"]').filter({ hasText: /thành công/i })
  ).toBeVisible({ timeout: 10000 })
})

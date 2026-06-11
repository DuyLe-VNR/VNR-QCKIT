import { test, expect } from '@playwright/test'
import { AttLeaveDayPage } from '../../../../.specify/tests/pages/att/att_leave_day/AttLeaveDayPage'
import datafake from '../datafake.json'

// TC-006 — Lần đầu đăng ký — pass (count = 0 < max)
// PBI: 090626 | Group: Happy path | Priority: P1

test('TC-006 — Lần đầu đăng ký — pass (count = 0 < max)', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: MaxRequestPerMonth = 2 trên loại datafake.config.leave_type_name
  // PRECONDITION: NV (đăng nhập hiện tại) chưa có đơn active nào loại "Nghỉ kết hôn TEST" trong tháng 06/2026
  const leaveDayPage = new AttLeaveDayPage(page)

  // Bước 1: Điều hướng đến DS Ngày nghỉ
  await leaveDayPage.goto()

  // Bước 2: Tạo đơn ngày nghỉ lần đầu
  await leaveDayPage.createLeaveDay({
    loaiNgayNghi: datafake.config.leave_type_name,
    ngayBatDau: datafake.tc006.date_start,
    ngayKetThuc: datafake.tc006.date_end,
  })

  // Verify: Không block → Toast thành công
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"]').filter({ hasText: /thành công/i })
  ).toBeVisible({ timeout: 10000 })

  // Verify: Grid hiển thị đơn mới trạng thái Chờ duyệt
  await expect(
    page.locator('.k-grid-content tr, .k-grid tbody tr').filter({ hasText: datafake.config.leave_type_name }).first()
  ).toBeVisible({ timeout: 10000 })
})

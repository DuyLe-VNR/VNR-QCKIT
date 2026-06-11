import { test, expect } from '@playwright/test'
import { AttLeaveDayPage } from '../../../../.specify/tests/pages/att/att_leave_day/AttLeaveDayPage'
import datafake from '../datafake.json'

// TC-016 — Loại nghỉ không cấu hình rule mới — tự do đăng ký
// PBI: 090626 | Group: Business rule | Priority: P1

test('TC-016 — Loại nghỉ không cấu hình rule mới — tự do đăng ký', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: Loại datafake.no_rule.leave_type_name ("Nghỉ phép năm") có MaxRequestPerMonth=0, IsConsecutive=false
  const leaveDayPage = new AttLeaveDayPage(page)

  // Bước 1: Điều hướng
  await leaveDayPage.goto()

  // Bước 2: Tạo đơn 1 (dùng datafake.tc006 dates)
  await leaveDayPage.createLeaveDay({
    loaiNgayNghi: datafake.no_rule.leave_type_name,
    ngayBatDau: datafake.tc006.date_start,
    ngayKetThuc: datafake.tc006.date_end,
  })

  // Verify đơn 1: Toast thành công
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"]').filter({ hasText: /thành công/i })
  ).toBeVisible({ timeout: 10000 })

  // Bước 3: Tạo đơn 2 với gap cố tình (dùng datafake.tc007 dates)
  await leaveDayPage.createLeaveDay({
    loaiNgayNghi: datafake.no_rule.leave_type_name,
    ngayBatDau: datafake.tc007.date_start,
    ngayKetThuc: datafake.tc007.date_end,
  })

  // Verify đơn 2: Toast thành công — không có hard block nào (BR-NEW-06 + BR-NEW-07)
  await expect(
    page.locator('[class*="toast"], [class*="notification"], [class*="message"]').filter({ hasText: /thành công/i })
  ).toBeVisible({ timeout: 10000 })
})

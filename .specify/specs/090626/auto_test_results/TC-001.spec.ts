import { test, expect } from '@playwright/test'
import { CatLeaveDayTypePage } from '../../../../.specify/tests/pages/cat/cat_leave_day_type/CatLeaveDayTypePage'

// TC-001 — Hiển thị 3 field mới trên form cấu hình
// PBI: 090626 | Group: Cấu hình | Priority: P1

test('TC-001 — Hiển thị 3 field mới trên form cấu hình', { tag: ['@090626', '@auto'] }, async ({ page }) => {
  // PRECONDITION: DB đã chạy migration 20260609_01.sql để có MaxPerTimes, MaxRequestPerMonth, IsConsecutive
  const catPage = new CatLeaveDayTypePage(page)

  // Bước 1: Điều hướng đến trang tạo mới
  await catPage.gotoCreate()

  // Bước 2: Kiểm tra MaxPerTimes hiển thị
  await expect(page.locator('input[name="MaxPerTimes"]')).toBeVisible()

  // Bước 3: Kiểm tra MaxRequestPerMonth hiển thị
  await expect(page.locator('input[name="MaxRequestPerMonth"]')).toBeVisible()

  // Bước 4: Kiểm tra IsConsecutive hiển thị và mặc định unchecked
  await expect(page.locator('input[name="IsConsecutive"]')).toBeVisible()
  await expect(page.locator('input[name="IsConsecutive"]')).not.toBeChecked()
})

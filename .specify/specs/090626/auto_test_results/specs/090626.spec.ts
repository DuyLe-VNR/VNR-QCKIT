/**
 * Spec: PBI 090626 — Phép kinh nguyệt (Menstrual Leave)
 * Sinh bởi: /qc_auto_test — 2026-06-12
 * Màn hình : cat_leave_day_type (CAT), att_leave_day (ATT)
 *
 * Chạy lại (cd .specify/tests trước):
 *   npx playwright test ../specs/090626/auto_test_results/specs/090626.spec.ts
 *   npx playwright test ../specs/090626/auto_test_results/specs/090626.spec.ts --grep "090626_CAT_CATLEAVEDAY_001"
 */

import { test, expect, Page } from '@playwright/test'
import { CatLeaveDayTypePage } from '../../pages/cat/cat_leave_day_type/CatLeaveDayTypePage'
import { AttLeaveDayPage }      from '../../pages/att/att_leave_day/AttLeaveDayPage'
import datafake from '../../datafake.json'

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Chờ toast/notification chứa text */
async function waitForToast(page: Page, text: string, timeout = 10_000) {
  await page
    .locator('.k-notification-wrap, [class*="toast"], [class*="notification"]')
    .filter({ hasText: text })
    .first()
    .waitFor({ state: 'visible', timeout })
}

/** Kiểm tra auth guard — nếu bị redirect về login thì throw */
async function checkAuthGuard(page: Page) {
  const url = page.url()
  const loginPatterns = ['/login', '/sign-in', '/dang-nhap', '#/login', '/auth']
  if (loginPatterns.some(p => url.includes(p))) {
    throw new Error(`AUTH_EXPIRED: đang ở login page — ${url}`)
  }
}

/** Navigate đến màn hình và check auth */
async function safeNavigate(page: Page, screenPage: { goto: () => Promise<void> }) {
  await screenPage.goto()
  await page.waitForTimeout(1500)
  await checkAuthGuard(page)
}

// ─── Test data shortcuts ─────────────────────────────────────────────────────────

const d = datafake as any

// ─── NHÓM: Critical ─────────────────────────────────────────────────────────────

test.describe('Critical', () => {

  test.beforeEach(async ({ page }) => {
    await checkAuthGuard(page)
  })

  // ─── CAT ────────────────────────────────────────────────────────────────────

  test('090626_CAT_CATLEAVEDAY_001 — Tạo loại ngày nghỉ KN với 3 field mới — happy path @090626 @auto @critical', async ({ page }) => {
    const catPage = new CatLeaveDayTypePage(page)

    // Bước 1: Mở màn hình
    await test.step('Mở màn hình cat_leave_day_type', async () => {
      await safeNavigate(page, catPage)
      await expect(page).toHaveURL(/Cat_LeaveDayType\/Index/)
    })

    // Bước 2: Click Tạo mới
    await test.step('Click Tạo mới → navigate Create', async () => {
      await catPage.openCreateForm()
      await page.waitForTimeout(1500)
      await expect(page).toHaveURL(/Cat_LeaveDayType\/Create/)
    })

    // Bước 3-4: Nhập tên và mã
    await test.step('Nhập Loại ngày nghỉ và Mã', async () => {
      await catPage.fillCreateForm({
        loaiNgayNghi: d.menstrual.ten_loai_test,
        ma: d.menstrual.ma_loai_test,
      })
    })

    // Bước 5: Bật IsMenses
    await test.step('Bật checkbox Quỹ phép nghị định 85 (IsMenses)', async () => {
      await catPage.fillCreateForm({ quyPhepNghiDinh85: true })
    })

    // Bước 6: Chọn ApplyGender = Female (Nữ)
    await test.step('Chọn Giới tính áp dụng = Nữ (Female)', async () => {
      await catPage.fillCreateForm({ applyGender: 'Nữ' })
    })

    // Bước 7: Bật IsRequireConsecutive → field MaxConsecutive hiện
    await test.step('Bật checkbox Yêu cầu ngày liên tục', async () => {
      await catPage.fillCreateForm({ isRequireConsecutive: true })
      await page.waitForTimeout(300)
    })

    // Bước 8: Nhập MaxConsecutiveDaysPerMonth = 3
    await test.step('Nhập Số ngày tối đa/tháng = 3', async () => {
      await catPage.fillCreateForm({ maxConsecutiveDaysPerMonth: d.menstrual.max_ngay_thang })
    })

    // Bước 9: Click Lưu
    await test.step('Click Lưu → toast Lưu thành công', async () => {
      await catPage.submitForm()
      await waitForToast(page, 'thành công')
    })

    // Bước 10: Kiểm tra redirect (về Index hoặc Edit)
    await test.step('Kiểm tra redirect sau khi lưu', async () => {
      await expect(page).toHaveURL(/Cat_LeaveDayType\/(Index|Edit)/)
    })
  })

  // ─── ATT ────────────────────────────────────────────────────────────────────

  test('090626_ATT_LEAVEDAY_001 — NV nữ đăng ký KN lần đầu tháng — PASS @090626 @auto @critical', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate đến att_leave_day', async () => {
      await safeNavigate(page, attPage)
      await expect(page).toHaveURL(/Att_LeaveDay\/Index/)
    })

    await test.step('Click Tạo mới, điền NV nữ + loại KN + ngày hợp lệ 1', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({
        nhanVien: d.nv_nu_name,
        loaiNgayNghi: d.ten_loai_kn,
        ngayBatDau: d.dates.ngay_hop_le_1,
        nguoiDuyetDau: d.nguoi_duyet_dau,
        nguoiDuyetCuoi: d.nguoi_duyet_cuoi,
      })
    })

    await test.step('Lưu và đóng → toast Lưu thành công', async () => {
      await attPage.submitForm()
      await waitForToast(page, 'thành công')
    })
  })

  test('090626_ATT_LEAVEDAY_002 — NV nữ đăng ký KN liên tiếp ngày 2 — PASS @090626 @auto @critical', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate att_leave_day (tiền điều kiện: ngày 1 đã approved)', async () => {
      await safeNavigate(page, attPage)
      await expect(page).toHaveURL(/Att_LeaveDay\/Index/)
    })

    await test.step('Tạo đơn KN ngày 2 (liên tiếp với ngày 1)', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({
        nhanVien: d.nv_nu_name,
        loaiNgayNghi: d.ten_loai_kn,
        ngayBatDau: d.dates.ngay_hop_le_2,
        nguoiDuyetDau: d.nguoi_duyet_dau,
        nguoiDuyetCuoi: d.nguoi_duyet_cuoi,
      })
    })

    await test.step('Lưu → toast Lưu thành công (Rule 2 consecutive PASS)', async () => {
      await attPage.submitForm()
      await waitForToast(page, 'thành công')
    })
  })

  test('090626_ATT_LEAVEDAY_003 — NV nam đăng ký loại KN ApplyGender=Female — FAIL Rule 1 @090626 @auto @critical', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate att_leave_day', async () => {
      await safeNavigate(page, attPage)
    })

    await test.step('Mở form tạo mới, chọn NV nam', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({ nhanVien: d.nv_nam_name })
      await page.waitForTimeout(800)
    })

    await test.step('Kiểm tra dropdown Loại ngày nghỉ KHÔNG có loại KN', async () => {
      // Mở combobox Loại ngày nghỉ, tìm kiếm tên loại KN
      await attPage.loc.formLoaiNgayNghi.click()
      await attPage.loc.formLoaiNgayNghi.fill(d.ten_loai_kn)
      await page.waitForTimeout(800)
      // Verify: không có option KN trong dropdown (gender filter áp dụng cho NV nam)
      const knOption = page.locator(
        '.ui-autocomplete li.ui-menu-item, ul.k-list-ul li.k-list-item'
      ).filter({ hasText: d.ten_loai_kn })
      const count = await knOption.count()
      expect(count, `Loại "${d.ten_loai_kn}" KHÔNG được xuất hiện khi NV là Nam`).toBe(0)
    })
  })

  test('090626_ATT_LEAVEDAY_004 — NV nữ đăng ký KN không liên tiếp — FAIL Rule 2 @090626 @auto @critical', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate att_leave_day (tiền điều kiện: ngày 1 đã E_APPROVED)', async () => {
      await safeNavigate(page, attPage)
    })

    await test.step('Tạo đơn KN ngày không liên tiếp (gap_date)', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({
        nhanVien: d.nv_nu_name,
        loaiNgayNghi: d.ten_loai_kn,
        ngayBatDau: d.dates.gap_date,
        nguoiDuyetDau: d.nguoi_duyet_dau,
        nguoiDuyetCuoi: d.nguoi_duyet_cuoi,
      })
    })

    await test.step('Lưu → BLOCK: có thông báo lỗi ngày không liên tiếp', async () => {
      await attPage.submitForm()
      await page.waitForTimeout(2000)
      // Verify: error message về consecutive hoặc form chưa redirect
      const errorMsg = page.locator(
        '.k-notification-wrap, [class*="toast"], [class*="notification"], [class*="error"], .k-messagebox, .k-window-content'
      ).filter({ hasText: /liên tiếp|consecutive|phải là|ngày đăng ký/i })
      const hasError = await errorMsg.first().isVisible({ timeout: 5000 }).catch(() => false)
      const stillOnForm = await attPage.loc.btnLuuVaDong.isVisible({ timeout: 2000 }).catch(() => false)
      expect(hasError || stillOnForm, 'Hệ thống phải BLOCK đơn KN không liên tiếp (Rule 2)').toBeTruthy()
    })
  })

  test('090626_ATT_LEAVEDAY_005 — NV nữ vượt MaxConsecutiveDaysPerMonth=3 — FAIL Rule 3 @090626 @auto @critical', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate att_leave_day (tiền điều kiện: NV đã có 3 đơn E_APPROVED)', async () => {
      await safeNavigate(page, attPage)
    })

    await test.step('Tạo đơn KN liên tiếp nhưng vượt limit=3', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({
        nhanVien: d.nv_nu_name,
        loaiNgayNghi: d.ten_loai_kn,
        ngayBatDau: d.dates.ngay_tiep_theo,  // ngày liên tiếp hợp lệ nhưng là lần 4
        nguoiDuyetDau: d.nguoi_duyet_dau,
        nguoiDuyetCuoi: d.nguoi_duyet_cuoi,
      })
    })

    await test.step('Lưu → BLOCK: có thông báo vượt số ngày tối đa tháng', async () => {
      await attPage.submitForm()
      await page.waitForTimeout(2000)
      const errorMsg = page.locator(
        '.k-notification-wrap, [class*="toast"], [class*="notification"], [class*="error"], .k-messagebox, .k-window-content'
      ).filter({ hasText: /đủ|tháng|tối đa|vượt|limit/i })
      const hasError = await errorMsg.first().isVisible({ timeout: 5000 }).catch(() => false)
      const stillOnForm = await attPage.loc.btnLuuVaDong.isVisible({ timeout: 2000 }).catch(() => false)
      expect(hasError || stillOnForm, 'Hệ thống phải BLOCK khi vượt MaxConsecutiveDaysPerMonth (Rule 3)').toBeTruthy()
    })
  })

})

// ─── NHÓM: High ─────────────────────────────────────────────────────────────────

test.describe('High', () => {

  test.beforeEach(async ({ page }) => {
    await checkAuthGuard(page)
  })

  test('090626_CAT_CATLEAVEDAY_002 — Validate IsRequireConsecutive=true + MaxConsecutive trống @090626 @auto @high', async ({ page }) => {
    const catPage = new CatLeaveDayTypePage(page)

    await test.step('Navigate đến /Cat_LeaveDayType/Create', async () => {
      await catPage.gotoCreate()
      await page.waitForTimeout(1500)
      await checkAuthGuard(page)
      await expect(page).toHaveURL(/Cat_LeaveDayType\/Create/)
    })

    await test.step('Nhập tên, mã, bật IsRequireConsecutive; để trống MaxConsecutive', async () => {
      await catPage.fillCreateForm({
        loaiNgayNghi: 'Test KN Validate',
        ma: 'TKNVAL',
        isRequireConsecutive: true,
        // maxConsecutiveDaysPerMonth: bỏ trống
      })
    })

    await test.step('Click Lưu → hệ thống KHÔNG lưu; có thông báo lỗi', async () => {
      await catPage.submitForm()
      await page.waitForTimeout(1500)
      // Verify: form không redirect, còn nút Lưu
      const stillOnCreate = await catPage.loc.btnLuu.isVisible({ timeout: 3000 }).catch(() => false)
      const hasValidationMsg = await page.locator(
        '[class*="error"], .k-tooltip-validation, span[style*="color:red"], .k-form-error, .text-danger'
      ).first().isVisible({ timeout: 3000 }).catch(() => false)
      expect(stillOnCreate || hasValidationMsg, 'Hệ thống phải giữ form và hiện lỗi validation').toBeTruthy()
    })
  })

  test('090626_CAT_CATLEAVEDAY_003 — Tạo loại nghỉ thường ApplyGender=All, IsRequireConsecutive=false @090626 @auto @high', async ({ page }) => {
    const catPage = new CatLeaveDayTypePage(page)

    await test.step('Navigate Create form', async () => {
      await catPage.gotoCreate()
      await page.waitForTimeout(1500)
      await checkAuthGuard(page)
    })

    await test.step('Nhập tên, mã; không set ApplyGender và IsRequireConsecutive (dùng default)', async () => {
      await catPage.fillCreateForm({
        loaiNgayNghi: 'Nghỉ phép thường TEST',
        ma: 'NPT_TEST',
      })
    })

    await test.step('Click Lưu → toast Lưu thành công (không bị block bởi rules KN)', async () => {
      await catPage.submitForm()
      await waitForToast(page, 'thành công')
    })
  })

  test('090626_ATT_LEAVEDAY_006 — NV nữ đăng ký KN tháng mới — counter reset — PASS @090626 @auto @high', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate att_leave_day (tiền điều kiện: NV đã đạt limit trong tháng 6)', async () => {
      await safeNavigate(page, attPage)
    })

    await test.step('Tạo đơn KN tháng 8 (tháng mới, counter reset về 0)', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({
        nhanVien: d.nv_nu_name,
        loaiNgayNghi: d.ten_loai_kn,
        ngayBatDau: '01/08/2026',
        nguoiDuyetDau: d.nguoi_duyet_dau,
        nguoiDuyetCuoi: d.nguoi_duyet_cuoi,
      })
    })

    await test.step('Lưu → toast Lưu thành công (tháng 8 counter=0, PASS)', async () => {
      await attPage.submitForm()
      await waitForToast(page, 'thành công')
    })
  })

})

// ─── NHÓM: Medium ────────────────────────────────────────────────────────────────

test.describe('Medium', () => {

  test.beforeEach(async ({ page }) => {
    await checkAuthGuard(page)
  })

  test('090626_CAT_CATLEAVEDAY_004 — Toggle IsRequireConsecutive hiện/ẩn MaxConsecutive @090626 @auto @medium', async ({ page }) => {
    const catPage = new CatLeaveDayTypePage(page)

    await test.step('Navigate Create form', async () => {
      await catPage.gotoCreate()
      await page.waitForTimeout(1500)
      await checkAuthGuard(page)
    })

    await test.step('Bước 1: MaxConsecutive ẩn khi IsRequireConsecutive=false (default)', async () => {
      const containerHidden = await page.evaluate(() => {
        const input = document.querySelector('[name="MaxConsecutiveDaysPerMonth"]')
        if (!input) return true
        const container = (input as HTMLElement).closest('.FieldWrap, .form-group, [class*="field"]')
        if (!container) return false
        return window.getComputedStyle(container as Element).display === 'none'
      })
      expect(containerHidden, 'MaxConsecutive phải ẩn khi IsRequireConsecutive=false').toBeTruthy()
    })

    await test.step('Bước 2: Bật IsRequireConsecutive → MaxConsecutive hiện', async () => {
      await catPage.fillCreateForm({ isRequireConsecutive: true })
      await page.waitForTimeout(500)
      const containerVisible = await page.evaluate(() => {
        const input = document.querySelector('[name="MaxConsecutiveDaysPerMonth"]')
        if (!input) return false
        const container = (input as HTMLElement).closest('.FieldWrap, .form-group, [class*="field"]')
        if (!container) return true
        return window.getComputedStyle(container as Element).display !== 'none'
      })
      expect(containerVisible, 'MaxConsecutive phải hiện khi IsRequireConsecutive=true').toBeTruthy()
    })

    await test.step('Bước 3: Tắt IsRequireConsecutive → MaxConsecutive ẩn lại', async () => {
      await catPage.fillCreateForm({ isRequireConsecutive: false })
      await page.waitForTimeout(500)
      const containerHiddenAgain = await page.evaluate(() => {
        const input = document.querySelector('[name="MaxConsecutiveDaysPerMonth"]')
        if (!input) return true
        const container = (input as HTMLElement).closest('.FieldWrap, .form-group, [class*="field"]')
        if (!container) return false
        return window.getComputedStyle(container as Element).display === 'none'
      })
      expect(containerHiddenAgain, 'MaxConsecutive phải ẩn lại khi IsRequireConsecutive=false').toBeTruthy()
    })
  })

  test('090626_ATT_LEAVEDAY_012 — Loại nghỉ ApplyGender=All không bị chặn bởi gender rule — Regression @090626 @auto @medium', async ({ page }) => {
    const attPage = new AttLeaveDayPage(page)

    await test.step('Navigate att_leave_day (tiền điều kiện: loại "Nghỉ phép năm" tồn tại với ApplyGender=All)', async () => {
      await safeNavigate(page, attPage)
    })

    await test.step('Tạo đơn cho NV nam với loại Nghỉ phép năm (ApplyGender=All)', async () => {
      await attPage.openCreateForm()
      await page.waitForTimeout(1000)
      await attPage.fillCreateForm({
        nhanVien: d.nv_nam_name,
        loaiNgayNghi: d.all_gender.ten_loai,
        ngayBatDau: d.dates.ngay_bat_ky,
        nguoiDuyetDau: d.nguoi_duyet_dau,
        nguoiDuyetCuoi: d.nguoi_duyet_cuoi,
      })
    })

    await test.step('Lưu → toast Lưu thành công (không bị gender rule chặn)', async () => {
      await attPage.submitForm()
      await waitForToast(page, 'thành công')
    })
  })

})

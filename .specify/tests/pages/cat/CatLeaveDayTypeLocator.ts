import { Page, Locator } from '@playwright/test'

/**
 * Locator: DS Loại ngày nghỉ
 * URL: /Cat_LeaveDayType/Index
 * Sinh bởi /qc_map_flow — 2026-06-12
 * Source: component_cat_leave_day_type.md + component-rule.md
 * Group: cat
 */
export class CatLeaveDayTypeLocator {
  // ─── Toolbar Actions (List page) ──────────────────────────────────────────────

  readonly btnTaoMoi: Locator          // Tạo mới — List toolbar
  readonly btnTimKiem: Locator         // Tìm kiếm — List toolbar
  readonly btnXuatExcel: Locator       // Xuất excel — List toolbar
  readonly btnDoiCot: Locator          // Đổi cột — List toolbar
  readonly btnXoa: Locator             // Xóa — List toolbar

  // ─── Toolbar Actions (Create/Edit page) ──────────────────────────────────────

  readonly btnLuu: Locator             // Lưu — Create/Edit page toolbar
  readonly btnLuuVaTaoMoi: Locator     // Lưu và tạo mới — Create/Edit page toolbar

  // ─── Create/Edit Form Fields — route /Cat_LeaveDayType/Create ─────────────────

  /** Thông tin chung */
  readonly loaiNgayNghi: Locator       // Loại ngày nghỉ — k-textbox (bắt buộc)
  readonly ma: Locator                 // Mã — k-textbox (bắt buộc)
  readonly maTK: Locator               // Mã TK — k-textbox (bắt buộc)
  readonly nhomLoaiNgayNghi: Locator   // Nhóm loại ngày nghỉ — k-textbox
  readonly ghiChu: Locator             // Ghi chú — k-textbox
  readonly donViToChuc: Locator        // Đơn vị tổ chức — k-combobox
  readonly maPhuThuoc: Locator         // Mã phụ thuộc — k-combobox
  readonly loaiNhomNghi: Locator       // Loại nhóm nghỉ — k-combobox

  /** Số */
  readonly soThuTu: Locator            // Số thứ tự — numeric
  readonly soNgayNghiToiDaNam: Locator // Số ngày nghỉ tối đa/năm — numeric
  readonly soNgayNghiToiDaThang: Locator // Số ngày nghỉ tối đa/tháng — numeric

  /** Công thức / formula */
  readonly congThuc: Locator           // Công thức — text-formula
  readonly dsGioNghi: Locator          // DS Số giờ đăng ký nghỉ giữa ca — text-formula
  readonly dieuKienDangKy: Locator     // Điều kiện được đăng ký — text-formula

  /** Checkboxes */
  readonly cbChuaChonTrongPortal: Locator         // Chưa chọn trong portal
  readonly cbChungTuYTe: Locator                  // Chứng từ y tế
  readonly cbKhongKiemTraCa: Locator              // Không kiểm tra ca
  readonly cbKhongDangKyThoiGianThuViec: Locator  // Không đăng ký nghỉ trong t.gian thử việc
  readonly cbChan: Locator                        // Chặn
  readonly cbChoPhepLuuKhiTrungDuLieu: Locator    // Cho phép lưu khi trùng dữ liệu
  readonly cbNgayThuong: Locator                  // Ngày thường
  /** BS-01 — 3 fields mới theo PBI 090626 */
  readonly ddlApplyGender: Locator                 // Giới tính áp dụng — k-dropdown [NEW /qc_auto_test 090626]
  readonly cbIsRequireConsecutive: Locator         // Yêu cầu ngày liên tục — checkbox [NEW /qc_auto_test 090626]
  readonly numMaxConsecutiveDaysPerMonth: Locator  // Số ngày tối đa/tháng — k-numerictextbox [NEW /qc_auto_test 090626]

  readonly cbQuyPhepNghiDinh85: Locator           // Quỹ phép nghị định 85
  readonly cbLoaiNghiBHXH: Locator                // Loại nghỉ BHXH
  readonly cbSoPhepThemTonDauKy: Locator          // Số phép thêm tồn đầu kỳ
  readonly cbNghiBuHuongCheDoMaternityBenefit: Locator // Nghỉ bù hưởng chế độ
  readonly cbPhepKetHon: Locator                  // Phép kết hôn
  readonly cbPhepOm: Locator                      // Phép ốm
  readonly cbNghiPhaiLamBu: Locator               // Nghỉ phải làm bù
  readonly cbPhepThaiSan: Locator                 // Phép thai sản
  readonly cbDiCongTac: Locator                   // Đi công tác
  readonly cbHuongLuongTheoLuat: Locator          // Hưởng lương theo luật
  readonly cbNghiNgungViec: Locator               // Nghỉ ngừng việc
  readonly cbLaPhepNam: Locator                   // Là phép năm
  readonly cbNghiBu: Locator                      // Nghỉ bù
  readonly cbTruVaoPhepDauKy: Locator             // Trừ vào phép đầu kỳ
  readonly cbTruVaoPhepThamNien: Locator          // Trừ vào phép thâm niên
  readonly cbCanhBaoMaxNam: Locator               // Cảnh báo (max/năm)
  readonly cbSuatAn: Locator                      // Suất ăn
  readonly cbTaiNguoiThan: Locator                // Tải người thân
  readonly cbVoHieu: Locator                      // Vô hiệu

  constructor(private readonly page: Page) {
    // ── List Toolbar ──────────────────────────────────────────────────────────
    this.btnTaoMoi = page.getByRole('button', { name: 'Tạo mới' })
    this.btnTimKiem = page.getByRole('button', { name: 'Tìm kiếm' })
    this.btnXuatExcel = page.getByRole('button', { name: 'Xuất excel' })
    this.btnDoiCot = page.getByRole('button', { name: 'Đổi cột' })
    this.btnXoa = page.getByRole('button', { name: 'Xóa' })

    // ── Create/Edit Toolbar ───────────────────────────────────────────────────
    this.btnLuu = page.getByRole('button', { name: 'Lưu' })
    this.btnLuuVaTaoMoi = page.getByRole('button', { name: 'Lưu và tạo mới' })

    // ── k-textbox fields ─────────────────────────────────────────────────────
    this.loaiNgayNghi = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Loại ngày nghỉ' }) })
      .locator('div.FieldValue input.k-textbox')

    this.ma = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Mã' }) })
      .locator('div.FieldValue input.k-textbox')

    this.maTK = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Mã TK' }) })
      .locator('div.FieldValue input.k-textbox')

    this.nhomLoaiNgayNghi = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Nhóm loại ngày nghỉ' }) })
      .locator('div.FieldValue input.k-textbox')

    this.ghiChu = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Ghi chú' }) })
      .locator('div.FieldValue input.k-textbox')

    // ── k-combobox fields ────────────────────────────────────────────────────
    // [TODO: OrgTreeViewDropDown dùng treeview đặc biệt, cần confirm selector thực tế]
    this.donViToChuc = page.locator('[id*="OrgTreeViewDropDown"], [name*="OrgTreeViewDropDown"]')
      .first()

    this.maPhuThuoc = page.locator('[name="CodeLeaveDayDepend"]').closest('span.k-combobox')
      .locator('input.k-input')

    // [WARN: label trùng "Nhóm loại ngày nghỉ" — dùng k-combobox để phân biệt với k-textbox trên]
    this.loaiNhomNghi = page.locator('[name="LeaveTypeGroup"]').closest('span.k-combobox')
      .locator('input.k-input')

    // ── numeric fields ────────────────────────────────────────────────────────
    this.soThuTu = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Số thứ tự' }) })
      .locator('div.FieldValue input[type="number"]')

    this.soNgayNghiToiDaNam = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Số ngày nghỉ tối đa/năm' }) })
      .locator('div.FieldValue input[type="number"]')

    this.soNgayNghiToiDaThang = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Số ngày nghỉ tối đa/tháng' }) })
      .locator('div.FieldValue input[type="number"]')

    // ── text-formula fields ───────────────────────────────────────────────────
    this.congThuc = page.locator('[name="Formula"]')
    this.dsGioNghi = page.locator('[name="ListRegisterHours"]')
    this.dieuKienDangKy = page.locator('[name="ConditionRegisteredFormula"]')

    // ── checkbox fields ───────────────────────────────────────────────────────
    this.cbChuaChonTrongPortal = page.locator('[name="NotSelectedInPortal"]')
    this.cbChungTuYTe = page.locator('[name="MedicalDocument"]')
    this.cbKhongKiemTraCa = page.locator('[name="IsNoShift"]')
    this.cbKhongDangKyThoiGianThuViec = page.locator('[name="IsProbationNotLeaveDay"]')
    this.cbChan = page.locator('[name="IsProbationNotLeaveDayBlock"]')
    this.cbChoPhepLuuKhiTrungDuLieu = page.locator('[name="IsAllowDuplicateData"]')
    this.cbNgayThuong = page.locator('[name="IsWorkDay"]')
    this.cbQuyPhepNghiDinh85 = page.locator('[name="IsMenses"]')
    this.cbLoaiNghiBHXH = page.locator('[name="IsInsuranceLeave"]')
    this.cbSoPhepThemTonDauKy = page.locator('[name="IsAdditonalLeave"]')
    this.cbNghiBuHuongCheDoMaternityBenefit = page.locator('[name="IsCompensationforMaternity"]')
    this.cbPhepKetHon = page.locator('[name="IsMarrige"]')
    this.cbPhepOm = page.locator('[name="IsSick"]')
    this.cbNghiPhaiLamBu = page.locator('[name="IsTimeOffMakeUp"]')
    this.cbPhepThaiSan = page.locator('[name="IsPregnantLeave"]')
    this.cbDiCongTac = page.locator('[name="IsBusinessTravel"]')
    this.cbHuongLuongTheoLuat = page.locator('[name="IsPaidLeaveInLaw"]')
    this.cbNghiNgungViec = page.locator('[name="IsForceMajeure"]')
    this.cbLaPhepNam = page.locator('[name="IsAnnualLeave"]')
    this.cbNghiBu = page.locator('[name="IsTimeOffInLieu"]')
    this.cbTruVaoPhepDauKy = page.locator('[name="ExceptInAnlBeginning"]')
    this.cbTruVaoPhepThamNien = page.locator('[name="ExceptInAnlSeniority"]')
    this.cbCanhBaoMaxNam = page.locator('[name="IsWarningMaxPerYear"]')
    this.cbSuatAn = page.locator('[name="IsMeal"]')
    this.cbTaiNguoiThan = page.locator('[name="IsLoadRelatives"]')
    this.cbVoHieu = page.locator('[name="IsInactive"]')

    // ── BS-01 fields mới — PBI 090626 ─────────────────────────────────────────
    // ApplyGender: Kendo DropdownList — span.k-dropdown chứa input[name="ApplyGender"]
    this.ddlApplyGender = page.locator('[name="ApplyGender"]').locator('..').locator('span.k-input-inner')

    // IsRequireConsecutive: checkbox thuần
    this.cbIsRequireConsecutive = page.locator('[name="IsRequireConsecutive"]')

    // MaxConsecutiveDaysPerMonth: Kendo NumericTextBox — span.k-numerictextbox
    this.numMaxConsecutiveDaysPerMonth = page.locator('[name="MaxConsecutiveDaysPerMonth"]')
      .closest('span.k-numerictextbox')
      .locator('input.k-input-inner')
  }
}

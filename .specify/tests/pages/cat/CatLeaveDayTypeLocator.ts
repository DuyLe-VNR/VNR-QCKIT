import { Page, Locator } from '@playwright/test'

/**
 * Locator: DS Loại ngày nghỉ
 * URL: /Cat_LeaveDayType/Index (list)  |  /Cat_LeaveDayType/Create (create/edit)
 * Sinh bởi /qc_map_flow — 2026-06-10
 * Source: component_temp_cat_leave_day_type.md + component-rule.md
 * Group: cat
 * Stack: Kendo MVC + AngularJS
 */
export class CatLeaveDayTypeLocator {

  // ─── Toolbar — List page ──────────────────────────────────────────────────────
  readonly btnTaoMoi: Locator       // Tạo mới — navigate to /Create
  readonly btnTimKiem: Locator      // Tìm kiếm — refresh danh sách
  readonly btnXuatExcel: Locator    // Xuất excel
  readonly btnDoiCot: Locator       // Đổi cột — tùy chỉnh cột hiển thị
  readonly btnXoa: Locator          // Xóa record đã chọn

  // ─── Toolbar — Create/Edit page ───────────────────────────────────────────────
  readonly btnLuu: Locator          // Lưu — customevent doSave
  readonly btnLuuVaTaoMoi: Locator  // Lưu và tạo mới — customevent doSaveNew

  // ─── Form Fields — k-textbox ──────────────────────────────────────────────────
  readonly loaiNgayNghi: Locator     // Loại ngày nghỉ — LeaveDayTypeName
  readonly ma: Locator               // Mã — Code  [WARN: label ngắn, dùng .first()]
  readonly maTk: Locator             // Mã TK — CodeStatistic
  readonly nhomLoaiNgayNghi: Locator // Nhóm loại ngày nghỉ — LeaveTypeGroup (text)
  readonly ghiChu: Locator           // Ghi chú — Notes (textarea)

  // ─── Form Fields — k-combobox ─────────────────────────────────────────────────
  readonly donViToChuc: Locator  // Đơn vị tổ chức — OrgTreeViewDropDown [TODO: verify name attr]
  readonly maPhuThuoc: Locator   // Mã phụ thuộc — CodeLeaveDayDepend
  readonly loaiNhomNghi: Locator // Loại nhóm nghỉ — LeaveTypeGroup (combobox)

  // ─── Form Fields — numeric ────────────────────────────────────────────────────
  readonly soThuTu: Locator              // Số thứ tự — Order
  readonly soNgayNghiToiDaNam: Locator   // Số ngày nghỉ tối đa/năm — MaxPerYear
  readonly soNgayNghiToiDaThang: Locator // Số ngày nghỉ tối đa/tháng — MaxPerMonth

  // ─── Form Fields — text-formula ───────────────────────────────────────────────
  readonly congThuc: Locator                // Công thức — Formula
  readonly dsSoGioDangKyNghiGiuaCa: Locator // DS Số giờ đăng ký nghỉ giữa ca — ListRegisterHours
  readonly dieuKienDuocDangKy: Locator      // Điều kiện được đăng ký — ConditionRegisteredFormula

  // ─── Form Fields — checkbox (26 fields) ──────────────────────────────────────
  readonly chuaChonTrongPortal: Locator       // Chưa chọn trong portal — NotSelectedInPortal
  readonly chungTuYTe: Locator                // Chứng từ y tế — MedicalDocument
  readonly khongKiemTraCa: Locator            // Không kiểm tra ca — IsNoShift
  readonly khongDangKyNghiThuViec: Locator    // Không đăng ký nghỉ trong t.gian thử việc — IsProbationNotLeaveDay
  readonly chanBlock: Locator                 // Chặn — IsProbationNotLeaveDayBlock
  readonly choPhepLuuKhiTrung: Locator        // Cho phép lưu khi trùng dữ liệu từ lịch — IsAllowDuplicateData
  readonly ngayThuong: Locator                // Ngày thường — IsWorkDay
  readonly quyPhepNghiDinh85: Locator         // Quỹ phép nghị định 85 — IsMenses
  readonly loaiNghiBhxh: Locator              // Loại nghỉ BHXH — IsInsuranceLeave
  readonly soPhepThemTonDauKy: Locator        // Số phép thêm tồn đầu kỳ — IsAdditonalLeave
  readonly nghiBuHuongCheDoc: Locator         // Nghỉ bù hưởng chế độ — IsCompensationforMaternity
  readonly phepKetHon: Locator                // Phép kết hôn — IsMarrige
  readonly phepOm: Locator                    // Phép ốm — IsSick
  readonly nghiPhaiLamBu: Locator             // Nghỉ phải làm bù — IsTimeOffMakeUp
  readonly phepThaiSan: Locator               // Phép thai sản — IsPregnantLeave
  readonly diCongTac: Locator                 // Đi công tác — IsBusinessTravel
  readonly huongLuongTheoLuat: Locator        // Hưởng lương theo luật — IsPaidLeaveInLaw
  readonly nghiNgungViec: Locator             // Nghỉ ngừng việc — IsForceMajeure
  readonly laPhepNam: Locator                 // Là phép năm — IsAnnualLeave
  readonly nghiBu: Locator                    // Nghỉ bù — IsTimeOffInLieu
  readonly truVaoPhepDauKy: Locator           // Trừ vào phép đầu kỳ — ExceptInAnlBeginning
  readonly truVaoPhepThamNien: Locator        // Trừ vào phép thâm niên — ExceptInAnlSeniority
  readonly canhBaoMaxNam: Locator             // Cảnh báo (max/năm) — IsWarningMaxPerYear
  readonly suatAn: Locator                    // Suất ăn — IsMeal
  readonly taiNguoiThan: Locator              // Tải người thân — IsLoadRelatives
  readonly voHieu: Locator                    // Vô hiệu — IsInactive

  constructor(private readonly page: Page) {

    // ─── Toolbar — List page ────────────────────────────────────────────────────
    this.btnTaoMoi    = page.getByRole('button', { name: 'Tạo mới' }).first()
    this.btnTimKiem   = page.getByRole('button', { name: 'Tìm kiếm' })
    this.btnXuatExcel = page.getByRole('button', { name: 'Xuất excel' })
    this.btnDoiCot    = page.getByRole('button', { name: 'Đổi cột' })
    this.btnXoa       = page.getByRole('button', { name: 'Xóa' })

    // ─── Toolbar — Create/Edit page ─────────────────────────────────────────────
    this.btnLuu         = page.locator('button[customevent="doSave"]')
    this.btnLuuVaTaoMoi = page.locator('button[customevent="doSaveNew"]')

    // ─── k-textbox fields ────────────────────────────────────────────────────────
    this.loaiNgayNghi = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Loại ngày nghỉ' }) })
      .locator('div.FieldValue input.k-textbox')

    // [WARN: label "Mã" ngắn, có thể match nhiều container — dùng .first()]
    this.ma = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Mã' }) })
      .locator('div.FieldValue input.k-textbox')
      .first()

    this.maTk = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Mã TK' }) })
      .locator('div.FieldValue input.k-textbox')

    this.nhomLoaiNgayNghi = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Nhóm loại ngày nghỉ' }) })
      .locator('div.FieldValue input.k-textbox')

    // Ghi chú — textarea (không phải input.k-textbox)
    this.ghiChu = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Ghi chú' }) })
      .locator('div.FieldValue textarea')

    // ─── k-combobox fields ───────────────────────────────────────────────────────
    // [TODO: Đơn vị tổ chức là OrgTreeViewDropDown — verify name attr trong DOM thực]
    this.donViToChuc = page.locator('input[name="orgTreeView-input-OrgTreeViewDropDown"]')

    this.maPhuThuoc = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Mã phụ thuộc' }) })
      .locator('span.k-combobox input.k-input')

    this.loaiNhomNghi = page
      .locator('div:has(> div.FieldTitle, > div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Loại nhóm nghỉ' }) })
      .locator('span.k-combobox input.k-input')

    // ─── numeric fields ──────────────────────────────────────────────────────────
    this.soThuTu              = page.locator('input[name="Order"]')
    this.soNgayNghiToiDaNam   = page.locator('input[name="MaxPerYear"]')
    this.soNgayNghiToiDaThang = page.locator('input[name="MaxPerMonth"]')

    // ─── text-formula fields ─────────────────────────────────────────────────────
    this.congThuc                = page.locator('input[name="Formula"]')
    this.dsSoGioDangKyNghiGiuaCa = page.locator('input[name="ListRegisterHours"]')
    this.dieuKienDuocDangKy      = page.locator('input[name="ConditionRegisteredFormula"]')

    // ─── checkbox fields ─────────────────────────────────────────────────────────
    this.chuaChonTrongPortal    = page.locator('input[name="NotSelectedInPortal"]')
    this.chungTuYTe             = page.locator('input[name="MedicalDocument"]')
    this.khongKiemTraCa         = page.locator('input[name="IsNoShift"]')
    this.khongDangKyNghiThuViec = page.locator('input[name="IsProbationNotLeaveDay"]')
    this.chanBlock              = page.locator('input[name="IsProbationNotLeaveDayBlock"]')
    this.choPhepLuuKhiTrung     = page.locator('input[name="IsAllowDuplicateData"]')
    this.ngayThuong             = page.locator('input[name="IsWorkDay"]')
    this.quyPhepNghiDinh85      = page.locator('input[name="IsMenses"]')
    this.loaiNghiBhxh           = page.locator('input[name="IsInsuranceLeave"]')
    this.soPhepThemTonDauKy     = page.locator('input[name="IsAdditonalLeave"]')
    this.nghiBuHuongCheDoc      = page.locator('input[name="IsCompensationforMaternity"]')
    this.phepKetHon             = page.locator('input[name="IsMarrige"]')
    this.phepOm                 = page.locator('input[name="IsSick"]')
    this.nghiPhaiLamBu          = page.locator('input[name="IsTimeOffMakeUp"]')
    this.phepThaiSan            = page.locator('input[name="IsPregnantLeave"]')
    this.diCongTac              = page.locator('input[name="IsBusinessTravel"]')
    this.huongLuongTheoLuat     = page.locator('input[name="IsPaidLeaveInLaw"]')
    this.nghiNgungViec          = page.locator('input[name="IsForceMajeure"]')
    this.laPhepNam              = page.locator('input[name="IsAnnualLeave"]')
    this.nghiBu                 = page.locator('input[name="IsTimeOffInLieu"]')
    this.truVaoPhepDauKy        = page.locator('input[name="ExceptInAnlBeginning"]')
    this.truVaoPhepThamNien     = page.locator('input[name="ExceptInAnlSeniority"]')
    this.canhBaoMaxNam          = page.locator('input[name="IsWarningMaxPerYear"]')
    this.suatAn                 = page.locator('input[name="IsMeal"]')
    this.taiNguoiThan           = page.locator('input[name="IsLoadRelatives"]')
    this.voHieu                 = page.locator('input[name="IsInactive"]')
  }
}

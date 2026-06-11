import { Page } from '@playwright/test'
import { BasePage } from '../../BasePage'
import { CatLeaveDayTypeLocator } from '../CatLeaveDayTypeLocator'

/**
 * Page Object: DS Loại ngày nghỉ
 * URL: /Cat_LeaveDayType/Index  (list)
 *      /Cat_LeaveDayType/Create (create/edit)
 * Screen type: list → navigate to /Create
 * Sinh bởi /qc_map_flow — 2026-06-10
 * Source: component_temp_cat_leave_day_type.md + userflow-cat.md
 * Group: cat | Stack: Kendo MVC + AngularJS
 */
export class CatLeaveDayTypePage extends BasePage {

  // ─── URL ─────────────────────────────────────────────────────────────────────
  readonly url = '/Cat_LeaveDayType/Index'

  // ─── Locator ──────────────────────────────────────────────────────────────────
  readonly loc: CatLeaveDayTypeLocator

  constructor(page: Page) {
    super(page)
    this.loc = new CatLeaveDayTypeLocator(page)
  }

  // ─── Navigation ───────────────────────────────────────────────────────────────

  /** Mở màn hình danh sách DS Loại ngày nghỉ */
  async goto() {
    await this.navigate(this.url)
  }

  // ─── List actions ─────────────────────────────────────────────────────────────

  /**
   * Mở form tạo mới.
   * Click "Tạo mới" → navigate sang /Cat_LeaveDayType/Create
   */
  async openCreateForm() {
    await this.loc.btnTaoMoi.click()
  }

  /**
   * Xóa record đang chọn.
   * Click "Xóa" → confirm dialog "Đồng ý"
   */
  async deleteRecord() {
    await this.loc.btnXoa.click()
    await this.handleConfirmDialog('Đồng ý')
  }

  /**
   * Xuất danh sách ra Excel.
   */
  async exportExcel() {
    await this.loc.btnXuatExcel.click()
  }

  // ─── Form fill ────────────────────────────────────────────────────────────────

  /**
   * Điền form tạo mới / chỉnh sửa.
   * Tất cả field là tùy chọn — chỉ điền field nào được truyền vào.
   *
   * Checkbox field: truyền true/false.
   * Text field: truyền chuỗi string.
   */
  async fillForm(data: {
    // k-textbox
    loaiNgayNghi?: string          // Loại ngày nghỉ — LeaveDayTypeName
    ma?: string                    // Mã — Code
    maTk?: string                  // Mã TK — CodeStatistic
    nhomLoaiNgayNghi?: string      // Nhóm loại ngày nghỉ — LeaveTypeGroup (text)
    ghiChu?: string                // Ghi chú — Notes

    // k-combobox
    donViToChuc?: string           // Đơn vị tổ chức — OrgTreeViewDropDown
    maPhuThuoc?: string            // Mã phụ thuộc — CodeLeaveDayDepend
    loaiNhomNghi?: string          // Loại nhóm nghỉ — LeaveTypeGroup (combobox)

    // numeric
    soThuTu?: string               // Số thứ tự — Order
    soNgayNghiToiDaNam?: string    // Số ngày nghỉ tối đa/năm — MaxPerYear
    soNgayNghiToiDaThang?: string  // Số ngày nghỉ tối đa/tháng — MaxPerMonth

    // text-formula
    congThuc?: string                // Công thức — Formula
    dsSoGioDangKyNghiGiuaCa?: string // DS Số giờ đăng ký nghỉ giữa ca
    dieuKienDuocDangKy?: string      // Điều kiện được đăng ký

    // checkbox flags
    chuaChonTrongPortal?: boolean       // NotSelectedInPortal
    chungTuYTe?: boolean                // MedicalDocument
    khongKiemTraCa?: boolean            // IsNoShift
    khongDangKyNghiThuViec?: boolean    // IsProbationNotLeaveDay
    chanBlock?: boolean                 // IsProbationNotLeaveDayBlock
    choPhepLuuKhiTrung?: boolean        // IsAllowDuplicateData
    ngayThuong?: boolean                // IsWorkDay
    quyPhepNghiDinh85?: boolean         // IsMenses
    loaiNghiBhxh?: boolean              // IsInsuranceLeave
    soPhepThemTonDauKy?: boolean        // IsAdditonalLeave
    nghiBuHuongCheDoc?: boolean         // IsCompensationforMaternity
    phepKetHon?: boolean                // IsMarrige
    phepOm?: boolean                    // IsSick
    nghiPhaiLamBu?: boolean             // IsTimeOffMakeUp
    phepThaiSan?: boolean               // IsPregnantLeave
    diCongTac?: boolean                 // IsBusinessTravel
    huongLuongTheoLuat?: boolean        // IsPaidLeaveInLaw
    nghiNgungViec?: boolean             // IsForceMajeure
    laPhepNam?: boolean                 // IsAnnualLeave
    nghiBu?: boolean                    // IsTimeOffInLieu
    truVaoPhepDauKy?: boolean           // ExceptInAnlBeginning
    truVaoPhepThamNien?: boolean        // ExceptInAnlSeniority
    canhBaoMaxNam?: boolean             // IsWarningMaxPerYear
    suatAn?: boolean                    // IsMeal
    taiNguoiThan?: boolean              // IsLoadRelatives
    voHieu?: boolean                    // IsInactive
  }) {
    // k-textbox
    if (data.loaiNgayNghi !== undefined)
      await this.inputTextbox(this.loc.loaiNgayNghi, data.loaiNgayNghi, 'Loại ngày nghỉ')
    if (data.ma !== undefined)
      await this.inputTextbox(this.loc.ma, data.ma, 'Mã')
    if (data.maTk !== undefined)
      await this.inputTextbox(this.loc.maTk, data.maTk, 'Mã TK')
    if (data.nhomLoaiNgayNghi !== undefined)
      await this.inputTextbox(this.loc.nhomLoaiNgayNghi, data.nhomLoaiNgayNghi, 'Nhóm loại ngày nghỉ')
    if (data.ghiChu !== undefined)
      await this.inputTextbox(this.loc.ghiChu, data.ghiChu, 'Ghi chú')

    // k-combobox
    if (data.donViToChuc !== undefined)
      await this.inputCombobox(this.loc.donViToChuc, data.donViToChuc, 'Đơn vị tổ chức')
    if (data.maPhuThuoc !== undefined)
      await this.inputCombobox(this.loc.maPhuThuoc, data.maPhuThuoc, 'Mã phụ thuộc')
    if (data.loaiNhomNghi !== undefined)
      await this.inputCombobox(this.loc.loaiNhomNghi, data.loaiNhomNghi, 'Loại nhóm nghỉ')

    // numeric (dùng inputTextbox vì fill text)
    if (data.soThuTu !== undefined)
      await this.inputTextbox(this.loc.soThuTu, data.soThuTu, 'Số thứ tự')
    if (data.soNgayNghiToiDaNam !== undefined)
      await this.inputTextbox(this.loc.soNgayNghiToiDaNam, data.soNgayNghiToiDaNam, 'Số ngày nghỉ tối đa/năm')
    if (data.soNgayNghiToiDaThang !== undefined)
      await this.inputTextbox(this.loc.soNgayNghiToiDaThang, data.soNgayNghiToiDaThang, 'Số ngày nghỉ tối đa/tháng')

    // text-formula
    if (data.congThuc !== undefined)
      await this.inputTextbox(this.loc.congThuc, data.congThuc, 'Công thức')
    if (data.dsSoGioDangKyNghiGiuaCa !== undefined)
      await this.inputTextbox(this.loc.dsSoGioDangKyNghiGiuaCa, data.dsSoGioDangKyNghiGiuaCa, 'DS Số giờ đăng ký nghỉ giữa ca')
    if (data.dieuKienDuocDangKy !== undefined)
      await this.inputTextbox(this.loc.dieuKienDuocDangKy, data.dieuKienDuocDangKy, 'Điều kiện được đăng ký')

    // checkbox
    if (data.chuaChonTrongPortal !== undefined)
      await this.inputCheckbox(this.loc.chuaChonTrongPortal, data.chuaChonTrongPortal, 'Chưa chọn trong portal')
    if (data.chungTuYTe !== undefined)
      await this.inputCheckbox(this.loc.chungTuYTe, data.chungTuYTe, 'Chứng từ y tế')
    if (data.khongKiemTraCa !== undefined)
      await this.inputCheckbox(this.loc.khongKiemTraCa, data.khongKiemTraCa, 'Không kiểm tra ca')
    if (data.khongDangKyNghiThuViec !== undefined)
      await this.inputCheckbox(this.loc.khongDangKyNghiThuViec, data.khongDangKyNghiThuViec, 'Không đăng ký nghỉ trong t.gian thử việc')
    if (data.chanBlock !== undefined)
      await this.inputCheckbox(this.loc.chanBlock, data.chanBlock, 'Chặn')
    if (data.choPhepLuuKhiTrung !== undefined)
      await this.inputCheckbox(this.loc.choPhepLuuKhiTrung, data.choPhepLuuKhiTrung, 'Cho phép lưu khi trùng dữ liệu')
    if (data.ngayThuong !== undefined)
      await this.inputCheckbox(this.loc.ngayThuong, data.ngayThuong, 'Ngày thường')
    if (data.quyPhepNghiDinh85 !== undefined)
      await this.inputCheckbox(this.loc.quyPhepNghiDinh85, data.quyPhepNghiDinh85, 'Quỹ phép nghị định 85')
    if (data.loaiNghiBhxh !== undefined)
      await this.inputCheckbox(this.loc.loaiNghiBhxh, data.loaiNghiBhxh, 'Loại nghỉ BHXH')
    if (data.soPhepThemTonDauKy !== undefined)
      await this.inputCheckbox(this.loc.soPhepThemTonDauKy, data.soPhepThemTonDauKy, 'Số phép thêm tồn đầu kỳ')
    if (data.nghiBuHuongCheDoc !== undefined)
      await this.inputCheckbox(this.loc.nghiBuHuongCheDoc, data.nghiBuHuongCheDoc, 'Nghỉ bù hưởng chế độ')
    if (data.phepKetHon !== undefined)
      await this.inputCheckbox(this.loc.phepKetHon, data.phepKetHon, 'Phép kết hôn')
    if (data.phepOm !== undefined)
      await this.inputCheckbox(this.loc.phepOm, data.phepOm, 'Phép ốm')
    if (data.nghiPhaiLamBu !== undefined)
      await this.inputCheckbox(this.loc.nghiPhaiLamBu, data.nghiPhaiLamBu, 'Nghỉ phải làm bù')
    if (data.phepThaiSan !== undefined)
      await this.inputCheckbox(this.loc.phepThaiSan, data.phepThaiSan, 'Phép thai sản')
    if (data.diCongTac !== undefined)
      await this.inputCheckbox(this.loc.diCongTac, data.diCongTac, 'Đi công tác')
    if (data.huongLuongTheoLuat !== undefined)
      await this.inputCheckbox(this.loc.huongLuongTheoLuat, data.huongLuongTheoLuat, 'Hưởng lương theo luật')
    if (data.nghiNgungViec !== undefined)
      await this.inputCheckbox(this.loc.nghiNgungViec, data.nghiNgungViec, 'Nghỉ ngừng việc')
    if (data.laPhepNam !== undefined)
      await this.inputCheckbox(this.loc.laPhepNam, data.laPhepNam, 'Là phép năm')
    if (data.nghiBu !== undefined)
      await this.inputCheckbox(this.loc.nghiBu, data.nghiBu, 'Nghỉ bù')
    if (data.truVaoPhepDauKy !== undefined)
      await this.inputCheckbox(this.loc.truVaoPhepDauKy, data.truVaoPhepDauKy, 'Trừ vào phép đầu kỳ')
    if (data.truVaoPhepThamNien !== undefined)
      await this.inputCheckbox(this.loc.truVaoPhepThamNien, data.truVaoPhepThamNien, 'Trừ vào phép thâm niên')
    if (data.canhBaoMaxNam !== undefined)
      await this.inputCheckbox(this.loc.canhBaoMaxNam, data.canhBaoMaxNam, 'Cảnh báo (max/năm)')
    if (data.suatAn !== undefined)
      await this.inputCheckbox(this.loc.suatAn, data.suatAn, 'Suất ăn')
    if (data.taiNguoiThan !== undefined)
      await this.inputCheckbox(this.loc.taiNguoiThan, data.taiNguoiThan, 'Tải người thân')
    if (data.voHieu !== undefined)
      await this.inputCheckbox(this.loc.voHieu, data.voHieu, 'Vô hiệu')
  }

  // ─── Submit ───────────────────────────────────────────────────────────────────

  /** Lưu form (doSave) → toast "Lưu thành công" */
  async submitForm() {
    await this.loc.btnLuu.click()
  }

  /** Lưu và tạo mới (doSaveNew) → toast "Lưu thành công" + form rỗng */
  async submitFormAndCreateNew() {
    await this.loc.btnLuuVaTaoMoi.click()
  }

  // ─── Shortcuts ────────────────────────────────────────────────────────────────

  /**
   * Tạo mới một loại ngày nghỉ — shortcut end-to-end.
   * goto() → openCreateForm() → fillForm(data) → submitForm()
   */
  async createRecord(data: Parameters<typeof this.fillForm>[0]) {
    await this.openCreateForm()
    await this.fillForm(data)
    await this.submitForm()
  }
}

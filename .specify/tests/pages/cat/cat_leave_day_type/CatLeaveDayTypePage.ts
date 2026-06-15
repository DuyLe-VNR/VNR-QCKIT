import { Page } from '@playwright/test'
import { BasePage } from '../../BasePage'
import { CatLeaveDayTypeLocator } from '../CatLeaveDayTypeLocator'

/**
 * Page Object: DS Loại ngày nghỉ
 * URL: /Cat_LeaveDayType/Index
 * Screen type: list (tạo mới navigate sang /Create, sửa sang /Edit/{id})
 * Sinh bởi /qc_map_flow — 2026-06-12
 * Source: component_cat_leave_day_type.md + userflow-cat.md
 * Group: cat
 */
export class CatLeaveDayTypePage extends BasePage {
  // ─── URL ────────────────────────────────────────────────────────────────────

  readonly url = '/Cat_LeaveDayType/Index'
  readonly createUrl = '/Cat_LeaveDayType/Create'

  // ─── Locator ─────────────────────────────────────────────────────────────────

  readonly loc: CatLeaveDayTypeLocator

  constructor(page: Page) {
    super(page)
    this.loc = new CatLeaveDayTypeLocator(page)
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto() {
    await this.navigate(this.url)
  }

  async gotoCreate() {
    await this.navigate(this.createUrl)
  }

  // ─── Actions: Tạo mới ────────────────────────────────────────────────────────

  /** Click Tạo mới → navigate sang /Cat_LeaveDayType/Create */
  async openCreateForm() {
    await this.loc.btnTaoMoi.click()
  }

  /**
   * Điền form tạo mới loại ngày nghỉ
   * Các field có (*) là bắt buộc theo userflow
   */
  async fillCreateForm(data: {
    loaiNgayNghi?: string        // Loại ngày nghỉ* — k-textbox
    ma?: string                  // Mã* — k-textbox
    maTK?: string                // Mã TK* — k-textbox
    ghiChu?: string              // Ghi chú — k-textbox
    nhomLoaiNgayNghi?: string    // Nhóm loại ngày nghỉ — k-textbox
    maPhuThuoc?: string          // Mã phụ thuộc — k-combobox
    loaiNhomNghi?: string        // Loại nhóm nghỉ — k-combobox
    soThuTu?: string             // Số thứ tự — numeric
    soNgayNghiToiDaNam?: string  // Số ngày nghỉ tối đa/năm — numeric
    soNgayNghiToiDaThang?: string // Số ngày nghỉ tối đa/tháng — numeric
    congThuc?: string            // Công thức — text-formula
    // Checkboxes (phổ biến)
    laPhepNam?: boolean          // Là phép năm
    nghiBu?: boolean             // Nghỉ bù
    loaiNghiBHXH?: boolean       // Loại nghỉ BHXH
    phepOm?: boolean             // Phép ốm
    phepThaiSan?: boolean        // Phép thai sản
    voHieu?: boolean             // Vô hiệu
    khongKiemTraCa?: boolean     // Không kiểm tra ca
    // BS-01 — 3 fields mới PBI 090626
    quyPhepNghiDinh85?: boolean  // Quỹ phép nghị định 85 (IsMenses)
    applyGender?: string         // Giới tính áp dụng — k-dropdown ('All'|'Female'|'Male')
    isRequireConsecutive?: boolean // Yêu cầu ngày liên tục
    maxConsecutiveDaysPerMonth?: string // Số ngày tối đa/tháng
  }) {
    if (data.loaiNgayNghi !== undefined)
      await this.inputTextbox(this.loc.loaiNgayNghi, data.loaiNgayNghi, 'Loại ngày nghỉ')

    if (data.ma !== undefined)
      await this.inputTextbox(this.loc.ma, data.ma, 'Mã')

    if (data.maTK !== undefined)
      await this.inputTextbox(this.loc.maTK, data.maTK, 'Mã TK')

    if (data.ghiChu !== undefined)
      await this.inputTextbox(this.loc.ghiChu, data.ghiChu, 'Ghi chú')

    if (data.nhomLoaiNgayNghi !== undefined)
      await this.inputTextbox(this.loc.nhomLoaiNgayNghi, data.nhomLoaiNgayNghi, 'Nhóm loại ngày nghỉ')

    if (data.maPhuThuoc !== undefined)
      await this.inputCombobox(this.loc.maPhuThuoc, data.maPhuThuoc, 'Mã phụ thuộc')

    if (data.loaiNhomNghi !== undefined)
      await this.inputCombobox(this.loc.loaiNhomNghi, data.loaiNhomNghi, 'Loại nhóm nghỉ')

    if (data.soThuTu !== undefined)
      await this.inputTextbox(this.loc.soThuTu, data.soThuTu, 'Số thứ tự')

    if (data.soNgayNghiToiDaNam !== undefined)
      await this.inputTextbox(this.loc.soNgayNghiToiDaNam, data.soNgayNghiToiDaNam, 'Số ngày nghỉ tối đa/năm')

    if (data.soNgayNghiToiDaThang !== undefined)
      await this.inputTextbox(this.loc.soNgayNghiToiDaThang, data.soNgayNghiToiDaThang, 'Số ngày nghỉ tối đa/tháng')

    if (data.congThuc !== undefined)
      await this.inputTextbox(this.loc.congThuc, data.congThuc, 'Công thức')

    if (data.laPhepNam !== undefined)
      await this.inputCheckbox(this.loc.cbLaPhepNam, data.laPhepNam, 'Là phép năm')

    if (data.nghiBu !== undefined)
      await this.inputCheckbox(this.loc.cbNghiBu, data.nghiBu, 'Nghỉ bù')

    if (data.loaiNghiBHXH !== undefined)
      await this.inputCheckbox(this.loc.cbLoaiNghiBHXH, data.loaiNghiBHXH, 'Loại nghỉ BHXH')

    if (data.phepOm !== undefined)
      await this.inputCheckbox(this.loc.cbPhepOm, data.phepOm, 'Phép ốm')

    if (data.phepThaiSan !== undefined)
      await this.inputCheckbox(this.loc.cbPhepThaiSan, data.phepThaiSan, 'Phép thai sản')

    if (data.voHieu !== undefined)
      await this.inputCheckbox(this.loc.cbVoHieu, data.voHieu, 'Vô hiệu')

    if (data.khongKiemTraCa !== undefined)
      await this.inputCheckbox(this.loc.cbKhongKiemTraCa, data.khongKiemTraCa, 'Không kiểm tra ca')

    // BS-01 fields mới PBI 090626
    if (data.quyPhepNghiDinh85 !== undefined)
      await this.inputCheckbox(this.loc.cbQuyPhepNghiDinh85, data.quyPhepNghiDinh85, 'Quỹ phép nghị định 85')

    if (data.applyGender !== undefined)
      await this.selectDropdown(this.loc.ddlApplyGender, data.applyGender, 'Giới tính áp dụng')

    if (data.isRequireConsecutive !== undefined)
      await this.inputCheckbox(this.loc.cbIsRequireConsecutive, data.isRequireConsecutive, 'Yêu cầu ngày liên tục')

    if (data.maxConsecutiveDaysPerMonth !== undefined)
      await this.inputTextbox(this.loc.numMaxConsecutiveDaysPerMonth, data.maxConsecutiveDaysPerMonth, 'Số ngày tối đa/tháng')
  }

  /** Submit form: Lưu */
  async submitForm() {
    await this.loc.btnLuu.click()
  }

  /** Submit form: Lưu và tạo mới */
  async submitFormAndNew() {
    await this.loc.btnLuuVaTaoMoi.click()
  }

  /** Điền và submit form tạo mới — shortcut */
  async createRecord(data: Parameters<typeof this.fillCreateForm>[0]) {
    await this.openCreateForm()
    await this.fillCreateForm(data)
    await this.submitForm()
  }

  // ─── Actions: Tìm kiếm ───────────────────────────────────────────────────────

  /** Tìm kiếm trong danh sách (click Tìm kiếm) */
  async search() {
    await this.loc.btnTimKiem.click()
  }

  // ─── Actions: Export ─────────────────────────────────────────────────────────

  /** Xuất excel */
  async exportExcel() {
    await this.loc.btnXuatExcel.click()
  }

  // ─── Actions: Xóa ────────────────────────────────────────────────────────────

  /** Xóa record đã chọn */
  async deleteRecord() {
    await this.loc.btnXoa.click()
    await this.handleConfirmDialog(true)
  }
}

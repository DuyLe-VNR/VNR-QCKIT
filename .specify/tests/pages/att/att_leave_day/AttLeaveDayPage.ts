import { Page } from '@playwright/test'
import { BasePage } from '../../BasePage'
import { AttLeaveDayLocator } from '../AttLeaveDayLocator'

/**
 * Page Object: DS Ngày nghỉ
 * URL: /Att_LeaveDay/Index
 * Screen type: list (form tạo mới mở inline)
 * Sinh bởi /qc_map_flow — 2026-06-12
 * Source: component_att_leave_day.md + userflow-att.md
 * Group: att
 */
export class AttLeaveDayPage extends BasePage {
  // ─── URL ────────────────────────────────────────────────────────────────────

  readonly url = '/Att_LeaveDay/Index'

  // ─── Locator ─────────────────────────────────────────────────────────────────

  readonly loc: AttLeaveDayLocator

  constructor(page: Page) {
    super(page)
    this.loc = new AttLeaveDayLocator(page)
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto() {
    await this.navigate(this.url)
  }

  // ─── Actions: Tạo mới ────────────────────────────────────────────────────────

  /** Mở dialog tạo mới ngày nghỉ */
  async openCreateForm() {
    await this.loc.btnTaoMoi.click()
  }

  /** Mở dialog tạo ngày nghỉ không ca */
  async openCreateFormNoShift() {
    await this.loc.btnTaoMoiKhongCa.click()
  }

  /**
   * Điền form tạo mới ngày nghỉ — truyền partial data
   * Các field có dấu (*) là bắt buộc theo userflow
   */
  async fillCreateForm(data: {
    nhanVien?: string         // Nhân viên* — chọn từ tree
    ngayBatDau?: string       // Ngày bắt đầu* — format: dd/MM/yyyy
    ngayBatDauDen?: string    // Đến ngày — format: dd/MM/yyyy
    loaiNgayNghi?: string     // Loại ngày nghỉ*
    kyChiTra?: string         // Kỳ chi trả
    nhomLoaiNgayNghi?: string // Nhóm loại ngày nghỉ
    nguoiDuyetDau?: string    // Người duyệt đầu*
    nguoiDuyetCuoi?: string   // Người duyệt cuối*
    nguoiDuyetKeTiep?: string // Người duyệt kế tiếp
    nguoiDuyetTiepTheo?: string // Người duyệt tiếp theo
    lyDo?: string             // Lý do nghỉ
    tinhBuLuong?: boolean     // Tính bù lương
    canNguoiThayThe?: boolean // Cần người thay thế
    chungTuYTe?: boolean      // Chứng từ y tế
  }) {
    if (data.nhanVien !== undefined)
      await this.inputTextbox(this.loc.formNhanVien, data.nhanVien, 'Nhân viên')

    if (data.ngayBatDau !== undefined)
      await this.inputTextbox(this.loc.formNgayBatDau, data.ngayBatDau, 'Ngày bắt đầu')

    if (data.ngayBatDauDen !== undefined)
      await this.inputTextbox(this.loc.formNgayBatDauDen, data.ngayBatDauDen, 'Đến ngày')

    if (data.loaiNgayNghi !== undefined)
      await this.inputCombobox(this.loc.formLoaiNgayNghi, data.loaiNgayNghi, 'Loại ngày nghỉ')

    if (data.kyChiTra !== undefined)
      await this.inputCombobox(this.loc.formKyChiTra, data.kyChiTra, 'Kỳ chi trả')

    if (data.nhomLoaiNgayNghi !== undefined)
      await this.inputCombobox(this.loc.formNhomLoaiNgayNghi, data.nhomLoaiNgayNghi, 'Nhóm loại ngày nghỉ')

    if (data.nguoiDuyetDau !== undefined)
      await this.inputCombobox(this.loc.formNguoiDuyetDau, data.nguoiDuyetDau, 'Người duyệt đầu')

    if (data.nguoiDuyetCuoi !== undefined)
      await this.inputCombobox(this.loc.formNguoiDuyetCuoi, data.nguoiDuyetCuoi, 'Người duyệt cuối')

    if (data.nguoiDuyetKeTiep !== undefined)
      await this.inputCombobox(this.loc.formNguoiDuyetKeTiep, data.nguoiDuyetKeTiep, 'Người duyệt kế tiếp')

    if (data.nguoiDuyetTiepTheo !== undefined)
      await this.inputCombobox(this.loc.formNguoiDuyetTiepTheo, data.nguoiDuyetTiepTheo, 'Người duyệt tiếp theo')

    if (data.lyDo !== undefined)
      await this.inputTextbox(this.loc.formLyDo, data.lyDo, 'Lý do')

    if (data.tinhBuLuong !== undefined)
      await this.inputCheckbox(this.loc.formTinhBuLuong, data.tinhBuLuong, 'Tính bù lương')

    if (data.canNguoiThayThe !== undefined)
      await this.inputCheckbox(this.loc.formCanNguoiThayThe, data.canNguoiThayThe, 'Cần người thay thế')

    if (data.chungTuYTe !== undefined)
      await this.inputCheckbox(this.loc.formChungTuYTe, data.chungTuYTe, 'Chứng từ y tế')
  }

  /** Submit form: Lưu và đóng */
  async submitForm() {
    await this.loc.btnLuuVaDong.click()
  }

  /** Submit form: Lưu và tạo mới tiếp */
  async submitFormAndNew() {
    await this.loc.btnLuuVaTaoMoi.click()
  }

  /** Điền và submit form tạo mới — shortcut */
  async createRecord(data: Parameters<typeof this.fillCreateForm>[0]) {
    await this.openCreateForm()
    await this.fillCreateForm(data)
    await this.submitForm()
  }

  // ─── Actions: Tìm kiếm / Lọc ─────────────────────────────────────────────────

  /** Lọc danh sách ngày nghỉ */
  async filter(params: {
    tenNhanVien?: string
    maNV?: string
    loaiNgayNghi?: string
    thoiGianTu?: string   // dd/MM/yyyy
    thoiGianDen?: string  // dd/MM/yyyy
  }) {
    if (params.tenNhanVien !== undefined)
      await this.inputTextbox(this.loc.filterTenNhanVien, params.tenNhanVien, 'Tên nhân viên')

    if (params.maNV !== undefined)
      await this.inputTextbox(this.loc.filterMaNV, params.maNV, 'Mã NV')

    if (params.loaiNgayNghi !== undefined)
      await this.inputCombobox(this.loc.filterLoaiNgayNghi, params.loaiNgayNghi, 'Loại ngày nghỉ')

    if (params.thoiGianTu !== undefined)
      await this.inputTextbox(this.loc.filterThoiGianNghiTu, params.thoiGianTu, 'Thời gian nghỉ (từ)')

    if (params.thoiGianDen !== undefined)
      await this.inputTextbox(this.loc.filterThoiGianNghiDen, params.thoiGianDen, 'Thời gian nghỉ (đến)')

    await this.loc.btnTimKiem.click()
  }

  // ─── Actions: Phê duyệt ──────────────────────────────────────────────────────

  /** Phê duyệt các record đã chọn */
  async approve() {
    await this.loc.btnPheDuyet.click()
  }

  /** Từ chối các record đã chọn */
  async reject() {
    await this.loc.btnTuChoi.click()
  }

  /** Hủy các record đã chọn */
  async cancel() {
    await this.loc.btnHuy.click()
  }

  // ─── Actions: Export ─────────────────────────────────────────────────────────

  /** Kết xuất danh sách ra Excel */
  async exportExcel() {
    await this.loc.btnKetXuat.click()
  }

  // ─── Actions: Xóa ────────────────────────────────────────────────────────────

  /** Xóa record đã chọn */
  async deleteRecord() {
    await this.loc.btnXoa.click()
    await this.handleConfirmDialog(true)
  }
}

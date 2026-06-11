import { Page } from '@playwright/test'
import { BasePage } from '../../BasePage'
import { AttLeaveDayLocator } from '../AttLeaveDayLocator'

/**
 * Page Object: DS Ngày nghỉ
 * URL: /Att_LeaveDay/Index
 * Screen type: list (form inline)
 * Sinh bởi /qc_map_flow — 2026-06-10
 * Source: component_temp_att_leave_day.md + userflow-att.md
 * Group: att
 * Kiến trúc: Kendo MVC + AngularJS — form tạo mới mở inline (không chuyển trang)
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

  // ─── Search / Filter ─────────────────────────────────────────────────────────

  /** Nhập điều kiện tìm kiếm ngày nghỉ và bấm Tìm kiếm */
  async search(params: {
    tenNhanVien?: string      // Tên nhân viên — search filter
    maNV?: string             // Mã NV — search filter
    ngayNghiTu?: string       // Thời gian nghỉ từ ngày (dd/MM/yyyy)
    ngayNghiDen?: string      // Thời gian nghỉ đến ngày (dd/MM/yyyy)
    kyCong?: string           // Kỳ công
    loaiNgayNghi?: string     // Loại ngày nghỉ
    loai?: string             // Loại
    donViKinhDoanh?: string   // Đơn vị kinh doanh
  }) {
    if (params.tenNhanVien !== undefined)
      await this.inputTextbox(this.loc.searchTenNhanVien, params.tenNhanVien, 'Tên nhân viên')
    if (params.maNV !== undefined)
      await this.inputTextbox(this.loc.searchMaNV, params.maNV, 'Mã NV')
    if (params.ngayNghiTu !== undefined)
      await this.inputTextbox(this.loc.searchNgayNghiTu, params.ngayNghiTu, 'Thời gian nghỉ (từ)')
    if (params.ngayNghiDen !== undefined)
      await this.inputTextbox(this.loc.searchNgayNghiDen, params.ngayNghiDen, 'Thời gian nghỉ (đến)')
    if (params.kyCong !== undefined)
      await this.inputCombobox(this.loc.searchKyCong, params.kyCong, 'Kỳ công')
    if (params.loaiNgayNghi !== undefined)
      await this.inputCombobox(this.loc.searchLoaiNgayNghi, params.loaiNgayNghi, 'Loại ngày nghỉ')
    if (params.loai !== undefined)
      await this.inputCombobox(this.loc.searchLoai, params.loai, 'Loại')
    if (params.donViKinhDoanh !== undefined)
      await this.inputCombobox(this.loc.searchDonViKinhDoanh, params.donViKinhDoanh, 'Đơn vị kinh doanh')
    await this.loc.btnTimKiem.click()
  }

  // ─── Create form ─────────────────────────────────────────────────────────────

  /** Mở form tạo mới ngày nghỉ (inline) */
  async openCreateForm() {
    await this.loc.btnTaoMoi.click()
  }

  /** Mở form tạo mới ngày nghỉ không ca (inline) */
  async openCreateFormKhongCa() {
    await this.loc.btnTaoMoiKhongCa.click()
  }

  /** Điền form tạo mới ngày nghỉ — truyền partial data */
  async fillCreateForm(data: {
    nhanVien?: string           // Nhân viên (chọn từ tree)
    ngayBatDau?: string         // Ngày bắt đầu (dd/MM/yyyy) — bắt buộc theo nghiệp vụ
    ngayKetThuc?: string        // Ngày kết thúc (dd/MM/yyyy)
    ngayDiLamLai?: string       // Ngày đi làm lại
    ngayDuSinh?: string         // Ngày dự sinh
    gioVao?: string             // Giờ vào (HH:mm)
    gioRa?: string              // Giờ ra (HH:mm)
    kyChiTra?: string           // Kỳ chi trả
    nguoiThayThe?: string       // Người thay thế
    nhomLoaiNgayNghi?: string   // Nhóm loại ngày nghỉ
    loaiNgayNghi?: string       // Loại ngày nghỉ (form) — bắt buộc theo nghiệp vụ
    caLamViec?: string          // Ca làm việc
    tietHoc?: string            // Tiết học
    loaiSinh?: string           // Loại sinh
    noiGuiDen?: string          // Nơi gửi đến
    lyDo?: string               // Lý do
    noiLienHe?: string          // Nơi liên hệ và nội dung công tác
    tinhBuLuong?: boolean       // Tính bù lương — checkbox
    canNguoiThayThe?: boolean   // Cần người thay thế — checkbox
  }) {
    if (data.nhanVien !== undefined)
      await this.inputTextbox(this.loc.formNhanVien, data.nhanVien, 'Nhân viên')
    if (data.ngayBatDau !== undefined)
      await this.inputTextbox(this.loc.formNgayBatDau, data.ngayBatDau, 'Ngày bắt đầu')
    if (data.ngayKetThuc !== undefined)
      await this.inputTextbox(this.loc.formNgayKetThuc, data.ngayKetThuc, 'Ngày kết thúc')
    if (data.ngayDiLamLai !== undefined)
      await this.inputTextbox(this.loc.formNgayDiLamLai, data.ngayDiLamLai, 'Ngày đi làm lại')
    if (data.ngayDuSinh !== undefined)
      await this.inputTextbox(this.loc.formNgayDuSinh, data.ngayDuSinh, 'Ngày dự sinh')
    if (data.gioVao !== undefined)
      await this.inputTextbox(this.loc.formGioVao, data.gioVao, 'Giờ vào')
    if (data.gioRa !== undefined)
      await this.inputTextbox(this.loc.formGioRa, data.gioRa, 'Giờ ra')
    if (data.kyChiTra !== undefined)
      await this.inputCombobox(this.loc.formKyChiTra, data.kyChiTra, 'Kỳ chi trả')
    if (data.nguoiThayThe !== undefined)
      await this.inputCombobox(this.loc.formNguoiThayThe, data.nguoiThayThe, 'Người thay thế')
    if (data.nhomLoaiNgayNghi !== undefined)
      await this.inputCombobox(this.loc.formNhomLoaiNgayNghi, data.nhomLoaiNgayNghi, 'Nhóm loại ngày nghỉ')
    if (data.loaiNgayNghi !== undefined)
      await this.inputCombobox(this.loc.formLoaiNgayNghi, data.loaiNgayNghi, 'Loại ngày nghỉ')
    if (data.caLamViec !== undefined)
      await this.inputCombobox(this.loc.formCaLamViec, data.caLamViec, 'Ca làm việc')
    if (data.tietHoc !== undefined)
      await this.inputCombobox(this.loc.formTietHoc, data.tietHoc, 'Tiết học')
    if (data.loaiSinh !== undefined)
      await this.inputCombobox(this.loc.formLoaiSinh, data.loaiSinh, 'Loại sinh')
    if (data.noiGuiDen !== undefined)
      await this.inputCombobox(this.loc.formNoiGuiDen, data.noiGuiDen, 'Nơi gửi đến')
    if (data.lyDo !== undefined)
      await this.inputTextbox(this.loc.formLyDo, data.lyDo, 'Lý do')
    if (data.noiLienHe !== undefined)
      await this.inputTextbox(this.loc.formNoiLienHe, data.noiLienHe, 'Nơi liên hệ và nội dung công tác')
    if (data.tinhBuLuong !== undefined)
      await this.inputCheckbox(this.loc.formTinhBuLuong, data.tinhBuLuong, 'Tính bù lương')
    if (data.canNguoiThayThe !== undefined)
      await this.inputCheckbox(this.loc.formCanNguoiThayThe, data.canNguoiThayThe, 'Cần người thay thế')
  }

  /** Submit form — Lưu và đóng */
  async submitForm() {
    await this.loc.btnLuuVaDong.click()
  }

  /** Submit form — Lưu và tạo mới (tiếp tục tạo thêm record) */
  async submitAndCreateNew() {
    await this.loc.btnLuuVaTaoMoi.click()
  }

  /** Điền và submit form tạo mới ngày nghỉ — shortcut */
  async createRecord(data: Parameters<typeof this.fillCreateForm>[0]) {
    await this.openCreateForm()
    await this.fillCreateForm(data)
    await this.submitForm()
  }

  // ─── Approval actions ────────────────────────────────────────────────────────

  /** Phê duyệt record đã chọn */
  async approveSelected() {
    await this.loc.btnPheDuyet.click()
  }

  /** Từ chối record đã chọn */
  async rejectSelected() {
    await this.loc.btnTuChoi.click()
  }

  /** Chuyển sang trạng thái Chờ duyệt */
  async setPending() {
    await this.loc.btnChoDuyet.click()
  }

  /** Xác nhận khẩn cấp */
  async urgentConfirm() {
    await this.loc.btnXacNhanKhanCap.click()
  }

  // ─── Other actions ───────────────────────────────────────────────────────────

  /** Xóa record đã chọn (sẽ hiện confirm dialog) */
  async deleteSelected() {
    await this.loc.btnXoa.click()
    await this.handleConfirmDialog(true)
  }

  /** Kết xuất Excel */
  async exportExcel() {
    await this.loc.btnKetXuat.click()
  }

  /** Xem số ngày nghỉ còn lại (trong form) */
  async viewRemainDays() {
    await this.loc.btnXemSoNgayConLai.click()
  }

  /** Xem số phép còn lại (trong form) */
  async viewRemainLeaveDays() {
    await this.loc.btnXemSoPhepConLai.click()
  }
}

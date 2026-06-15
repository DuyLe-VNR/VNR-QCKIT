import { Page, Locator } from '@playwright/test'

/**
 * Locator: DS Ngày nghỉ
 * URL: /Att_LeaveDay/Index
 * Sinh bởi /qc_map_flow — 2026-06-12
 * Source: component_att_leave_day.md + component-rule.md
 * Group: att
 */
export class AttLeaveDayLocator {
  // ─── Toolbar Actions ─────────────────────────────────────────────────────────

  readonly btnTaoMoi: Locator               // Tạo mới — List toolbar
  readonly btnTaoMoiKhongCa: Locator        // Tạo mới ngày nghỉ không ca — List toolbar
  readonly btnAddNew: Locator               // Add new — List toolbar
  readonly btnTimKiem: Locator              // Tìm kiếm — List toolbar
  readonly btnXacNhanKhanCap: Locator       // Xác nhận khẩn cấp — List toolbar
  readonly btnChoDuyet: Locator             // Chờ duyệt — List toolbar
  readonly btnPheDuyet: Locator             // Phê duyệt — List toolbar
  readonly btnTuChoi: Locator              // Từ chối — List toolbar
  readonly btnHuy: Locator                 // Hủy — List toolbar
  readonly btnKetXuat: Locator             // Kết xuất — List toolbar
  readonly btnTaoMau: Locator              // Tạo mẫu — List toolbar
  readonly btnXoa: Locator                 // Xóa — List toolbar
  readonly btnSaoCHep: Locator             // Sao chép — List toolbar
  readonly btnTinhSoNgayNghi: Locator      // Tính số ngày nghỉ — List toolbar
  readonly btnCapNhatLoaiNgayNghi: Locator // Cập nhật loại ngày nghỉ — List toolbar
  readonly btnGuiMail: Locator             // Gửi mail — List toolbar
  readonly btnLuuVaDong: Locator           // Lưu và đóng — Form toolbar
  readonly btnLuuVaTaoMoi: Locator         // Lưu và tạo mới — Form toolbar

  // ─── Search Filter Fields ─────────────────────────────────────────────────────

  readonly filterTenNhanVien: Locator      // Tên nhân viên (k-textbox)
  readonly filterMaNV: Locator             // Mã NV (k-textbox)
  readonly filterBoPhanTrucThuoc: Locator  // Bộ phận trực thuộc (orgTreeView k-textbox)
  readonly filterKyCong: Locator           // Kỳ công (k-combobox)
  readonly filterLoaiNgayNghi: Locator     // Loại ngày nghỉ (k-combobox)
  readonly filterLoai: Locator             // Loại (k-combobox)
  readonly filterDonViKinhDoanh: Locator   // Đơn vị kinh doanh (k-combobox)
  readonly filterThoiGianNghiTu: Locator   // Thời gian nghỉ (từ) — k-datepicker
  readonly filterThoiGianNghiDen: Locator  // Thời gian nghỉ (đến) — k-datepicker
  readonly filterTrungDuLieu: Locator      // Trùng dữ liệu! (checkbox)
  readonly filterDuLieuGiaiTrinh: Locator  // Dữ liệu giải trình (checkbox)
  readonly filterChuyenTLDV: Locator       // Chuyển TLĐV (checkbox)

  // ─── Create Form Fields — inline dialog ──────────────────────────────────────

  readonly formNhanVien: Locator           // Nhân viên — orgTreeView k-textbox (bắt buộc)
  readonly formNgayBatDau: Locator         // Ngày bắt đầu — k-datepicker (bắt buộc)
  readonly formNgayBatDauDen: Locator      // Ngày bắt đầu (đến) — k-datepicker
  readonly formNgayDiLamLai: Locator       // Ngày đi làm lại — k-datepicker
  readonly formNgayDuSinh: Locator         // Ngày dự sinh — k-datepicker
  readonly formGioVao: Locator             // Giờ vào — k-timepicker
  readonly formGioRa: Locator              // Giờ ra — k-timepicker
  readonly formKyChiTra: Locator           // Kỳ chi trả — k-combobox
  readonly formNguoiThayThe: Locator       // Người thay thế — k-combobox
  readonly formNhomLoaiNgayNghi: Locator   // Nhóm loại ngày nghỉ — k-combobox
  readonly formLoaiNgayNghi: Locator       // Loại ngày nghỉ — k-combobox (bắt buộc)
  readonly formCaLamViec: Locator          // Ca làm việc — k-combobox
  readonly formTietHoc: Locator            // Tiết học — k-combobox
  readonly formLoaiSinh: Locator           // Loại sinh — k-combobox
  readonly formNoiGuiDen: Locator          // Nơi gửi đến — k-combobox
  readonly formQuaTrinhTHaiSan: Locator    // Quá trình thai sản — k-combobox
  readonly formNguoiDuyetDau: Locator      // Người duyệt đầu — k-combobox (bắt buộc)
  readonly formNguoiDuyetKeTiep: Locator   // Người duyệt kế tiếp — k-combobox
  readonly formNguoiDuyetTiepTheo: Locator // Người duyệt tiếp theo — k-combobox
  readonly formNguoiDuyetCuoi: Locator     // Người duyệt cuối — k-combobox (bắt buộc)
  readonly formGioVaoRa: Locator           // Giờ vào ra — k-textbox
  readonly formGioVaoRaRa: Locator         // Giờ vào ra (ra) — k-textbox
  readonly formGioVaoRaGiuaCa: Locator     // Giờ vào ra giữa ca — k-textbox
  readonly formGioVaoRaGiuaCaRa: Locator   // Giờ vào ra giữa ca (ra) — k-textbox
  readonly formTongSoGioNghi: Locator      // Tổng số giờ nghỉ — k-textbox
  readonly formSoNgayNghi: Locator         // Số ngày nghỉ — k-textbox
  readonly formTongNgayNghi: Locator       // Tổng ngày nghỉ — k-textbox
  readonly formSoGioNghi: Locator          // Số giờ nghỉ — k-textbox
  readonly formSoGioGiuaCa: Locator        // Số giờ giữa ca — k-textbox
  readonly formCapBinhLuan1: Locator        // Cấp bình luận 1 — k-textbox
  readonly formCapBinhLuan2: Locator        // Cấp bình luận 2 — k-textbox
  readonly formCapBinhLuan3: Locator        // Cấp bình luận 3 — k-textbox
  readonly formCapBinhLuan4: Locator        // Cấp bình luận 4 — k-textbox
  readonly formLyDo: Locator               // Lý do — textarea
  readonly formNoiLienHeVaNoiDungCongTac: Locator // Nơi liên hệ và nội dung công tác — textarea
  readonly formGhiChuNguoiDuyet: Locator   // Ghi chú người duyệt — textarea
  readonly formLyDoTuChoi: Locator         // Lý do từ chối — textarea
  readonly formTinhBuLuong: Locator        // Tính bù lương (checkbox)
  readonly formCanNguoiThayThe: Locator    // Cần người thay thế (checkbox)
  readonly formChungTuYTe: Locator         // Chứng từ y tế (checkbox)
  readonly formNhanSuDieuChinh: Locator    // Nhân sự điều chỉnh (checkbox)
  readonly formChuyenTLDV: Locator         // Chuyển TLĐV (form) (checkbox)

  constructor(private readonly page: Page) {
    // ── Toolbar ──────────────────────────────────────────────────────────────
    this.btnTaoMoi = page.getByRole('button', { name: 'Tạo mới' }).first()
    this.btnTaoMoiKhongCa = page.getByRole('button', { name: 'Tạo mới ngày nghỉ không ca' })
    this.btnAddNew = page.getByRole('button', { name: 'Add new' })
    this.btnTimKiem = page.getByRole('button', { name: 'Tìm kiếm' })
    this.btnXacNhanKhanCap = page.getByRole('button', { name: 'Xác nhận khẩn cấp' })
    this.btnChoDuyet = page.getByRole('button', { name: 'Chờ duyệt' })
    this.btnPheDuyet = page.getByRole('button', { name: 'Phê duyệt' })
    this.btnTuChoi = page.getByRole('button', { name: 'Từ chối' })
    this.btnHuy = page.getByRole('button', { name: 'Hủy' })
    this.btnKetXuat = page.getByRole('button', { name: 'Kết xuất' })
    this.btnTaoMau = page.getByRole('button', { name: 'Tạo mẫu' })
    this.btnXoa = page.getByRole('button', { name: 'Xóa' })
    this.btnSaoCHep = page.getByRole('button', { name: 'Sao chép' })
    this.btnTinhSoNgayNghi = page.getByRole('button', { name: 'Tính số ngày nghỉ' })
    this.btnCapNhatLoaiNgayNghi = page.getByRole('button', { name: 'Cập nhật loại ngày nghỉ' })
    this.btnGuiMail = page.getByRole('button', { name: 'Gửi mail' })
    this.btnLuuVaDong = page.getByRole('button', { name: 'Lưu và đóng' })
    this.btnLuuVaTaoMoi = page.getByRole('button', { name: 'Lưu và tạo mới' })

    // ── Search Filter ─────────────────────────────────────────────────────────
    this.filterTenNhanVien = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Tên nhân viên' }) })
      .locator('div.FieldValue input.k-textbox')

    this.filterMaNV = page
      .locator('div:has(div.FieldTitle, div.FieldValue)')
      .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Mã NV' }) })
      .locator('div.FieldValue input.k-textbox')

    this.filterBoPhanTrucThuoc = page.locator(
      '[name="orgTreeView-input-indexOrgStructureTreeView"], [placeholder="Vui lòng chọn..."]'
    ).first()

    this.filterKyCong = page.locator('[name="CutOffDurationID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.filterLoaiNgayNghi = page.locator('[name="LeaveDayTypeID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.filterLoai = page.locator('[name="DurationType"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.filterDonViKinhDoanh = page.locator('[name="ShopIDs"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.filterThoiGianNghiTu = page.locator('[name="indexDateStart"]').closest('span.k-datepicker')
      .locator('input.k-input')

    this.filterThoiGianNghiDen = page.locator('[name="indexDateEnd"]').closest('span.k-datepicker')
      .locator('input.k-input')

    this.filterTrungDuLieu = page.locator('[name="IsDuplicate"]')
    this.filterDuLieuGiaiTrinh = page.locator('[name="IsExplanatory"]')
    this.filterChuyenTLDV = page.locator('[name="IsUnitAssistantSearch"]')

    // ── Create Form ───────────────────────────────────────────────────────────
    this.formNhanVien = page.locator(
      '[name="orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure"]'
    )

    this.formNgayBatDau = page.locator('[name="DateStart"]').closest('span.k-datepicker')
      .locator('input.k-input')

    this.formNgayBatDauDen = page.locator('[name="DateEnd"]').closest('span.k-datepicker')
      .locator('input.k-input')

    this.formNgayDiLamLai = page.locator('[name="DateReturnToWork"]').closest('span.k-datepicker')
      .locator('input.k-input')

    this.formNgayDuSinh = page.locator('[name="ExpectedDate"]').closest('span.k-datepicker')
      .locator('input.k-input')

    this.formGioVao = page.locator('[name="HoursFrom"]').closest('span.k-timepicker')
      .locator('input.k-input')

    this.formGioRa = page.locator('[name="HoursTo"]').closest('span.k-timepicker')
      .locator('input.k-input')

    this.formKyChiTra = page.locator('[name="PayPeriodID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formNguoiThayThe = page.locator('[name="SubstituteID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formNhomLoaiNgayNghi = page.locator('[name="LeaveTypeGroup"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formLoaiNgayNghi = page.locator('[name="TempLeaveDayTypeID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formCaLamViec = page.locator('[name="ShiftID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formTietHoc = page.locator('[name="ShiftDetailID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formLoaiSinh = page.locator('[name="LeaveDayTypeDefaultID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formNoiGuiDen = page.locator('[name="PlaceSendToID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formQuaTrinhTHaiSan = page.locator('[name="PregnancyCycleID"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formNguoiDuyetDau = page.locator('[name="UserApproveID"]').first().closest('span.k-combobox')
      .locator('input.k-input')

    this.formNguoiDuyetKeTiep = page.locator('[name="UserApproveID3"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formNguoiDuyetTiepTheo = page.locator('[name="UserApproveID4"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formNguoiDuyetCuoi = page.locator('[name="UserApproveID2"]').closest('span.k-combobox')
      .locator('input.k-input')

    this.formGioVaoRa = page.locator('[name="InTimeView1"]')
    this.formGioVaoRaRa = page.locator('[name="OutTimeView1"]')
    this.formGioVaoRaGiuaCa = page.locator('[name="InTimeView2"]')
    this.formGioVaoRaGiuaCaRa = page.locator('[name="OutTimeView2"]')
    this.formTongSoGioNghi = page.locator('[name="LeaveHours"]')
    this.formSoNgayNghi = page.locator('[name="LeaveDays"]')
    this.formTongNgayNghi = page.locator('[name="TypeHalfShiftLeaveDays"]')
    this.formSoGioNghi = page.locator('[name="TypeHalfShiftLeaveHours"]')
    this.formSoGioGiuaCa = page.locator('[name="HoursMiddleOfShift"]')
    this.formCapBinhLuan1 = page.locator('[name="UserComment1"]')
    this.formCapBinhLuan2 = page.locator('[name="UserComment2"]')
    this.formCapBinhLuan3 = page.locator('[name="UserComment3"]')
    this.formCapBinhLuan4 = page.locator('[name="UserComment4"]')

    this.formLyDo = page.locator('[name="Comment"]')
    this.formNoiLienHeVaNoiDungCongTac = page.locator('[name="BusinessReason"]')
    this.formGhiChuNguoiDuyet = page.locator('[name="CommentApprove"]')
    this.formLyDoTuChoi = page.locator('[name="DeclineReason"]')

    this.formTinhBuLuong = page.locator('[name="IsPayback"]')
    this.formCanNguoiThayThe = page.locator('[name="IsSubstitute"]')
    this.formChungTuYTe = page.locator('[name="CreateLeaveDayInfo_MedicalDocument"]')
    this.formNhanSuDieuChinh = page.locator('[name="CreateLeaveDayInfo_IsHrUpdate"]')
    this.formChuyenTLDV = page.locator('[name="CreateLeaveDayInfo_IsUnitAssistant"]')
  }
}

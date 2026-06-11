import { Page, Locator } from '@playwright/test'

/**
 * Locator: DS Ngày nghỉ
 * URL: /Att_LeaveDay/Index
 * Sinh bởi /qc_map_flow — 2026-06-10
 * Source: component_temp_att_leave_day.md + component-rule.md
 * Group: att
 * Kiến trúc: Kendo MVC + AngularJS — form inline (không chuyển trang)
 */
export class AttLeaveDayLocator {
  // ─── Toolbar Actions — List ──────────────────────────────────────────────────

  readonly btnTaoMoi: Locator              // Tạo mới — list toolbar
  readonly btnTaoMoiKhongCa: Locator      // Tạo mới ngày nghỉ không ca
  readonly btnTimKiem: Locator             // Tìm kiếm — search
  readonly btnXacNhanKhanCap: Locator      // Xác nhận khẩn cấp
  readonly btnChoDuyet: Locator            // Chờ duyệt
  readonly btnPheDuyet: Locator            // Phê duyệt
  readonly btnTuChoi: Locator              // Từ chối
  readonly btnHuy: Locator                 // Hủy
  readonly btnKetXuat: Locator             // Kết xuất
  readonly btnTaoMau: Locator              // Tạo mẫu
  readonly btnKhac: Locator                // Khác
  readonly btnXoa: Locator                 // Xóa
  readonly btnSaoChep: Locator             // Sao chép
  readonly btnTinhSoNgayNghi: Locator      // Tính số ngày nghỉ
  readonly btnCapNhatLoaiNgayNghi: Locator // Cập nhật loại ngày nghỉ
  readonly btnGuiMail: Locator             // Gửi mail

  // ─── Toolbar Actions — Form ──────────────────────────────────────────────────

  readonly btnLuuVaDong: Locator           // Lưu và đóng — form toolbar
  readonly btnLuuVaTaoMoi: Locator         // Lưu và tạo mới — form toolbar
  readonly btnXemSoNgayConLai: Locator     // Xem số ngày nghỉ còn lại
  readonly btnXemSoGioConLai: Locator      // Xem số giờ nghỉ còn lại
  readonly btnXemSoPhepConLai: Locator     // Xem số phép còn lại
  readonly btnChiTiet: Locator             // Chi tiết

  // ─── Search Filter Fields ───────────────────────────────────────────────────

  readonly searchNgayNghiTu: Locator       // Thời gian nghỉ (từ) — k-datepicker [indexDateStart]
  readonly searchNgayNghiDen: Locator      // Thời gian nghỉ (đến) — k-datepicker [indexDateEnd]
  readonly searchKyCong: Locator           // Kỳ công — k-combobox [CutOffDurationID]
  readonly searchLoaiNgayNghi: Locator     // Loại ngày nghỉ (tìm kiếm) — k-combobox [LeaveDayTypeID]
  readonly searchLoai: Locator             // Loại — k-combobox [DurationType]
  readonly searchDonViKinhDoanh: Locator   // Đơn vị kinh doanh — k-combobox [ShopIDs]
  readonly searchTenNhanVien: Locator      // Tên nhân viên — k-textbox [indexProfileName]
  readonly searchMaNV: Locator             // Mã NV — k-textbox [indexCodeEmp]
  readonly searchBoPhanTrucThuoc: Locator  // Bộ phận trực thuộc — orgTreeView input
  readonly searchTrungDuLieu: Locator      // Trùng dữ liệu! — checkbox [IsDuplicate]
  readonly searchDuLieuGiaiTrinh: Locator  // Dữ liệu giải trình — checkbox [IsExplanatory]
  readonly searchChuyenTLDV: Locator       // Chuyển TLĐV (tìm kiếm) — checkbox [IsUnitAssistantSearch]

  // ─── Create/Edit Form Fields ────────────────────────────────────────────────

  readonly formNgayBatDau: Locator         // Ngày bắt đầu — k-datepicker [DateStart]
  readonly formNgayKetThuc: Locator        // Ngày bắt đầu (đến) / Đến ngày — k-datepicker [DateEnd]
  readonly formNgayDiLamLai: Locator       // Ngày đi làm lại — k-datepicker [DateReturnToWork]
  readonly formNgayDuSinh: Locator         // Ngày dự sinh — k-datepicker [ExpectedDate]
  readonly formGioVao: Locator             // Giờ vào — k-timepicker [HoursFrom]
  readonly formGioRa: Locator              // Giờ ra — k-timepicker [HoursTo]
  readonly formKyChiTra: Locator           // Kỳ chi trả — k-combobox [PayPeriodID]
  readonly formNguoiThayThe: Locator       // Người thay thế — k-combobox [SubstituteID]
  readonly formNhomLoaiNgayNghi: Locator   // Nhóm loại ngày nghỉ — k-combobox [LeaveTypeGroup]
  readonly formLoaiNgayNghi: Locator       // Loại ngày nghỉ (form) — k-combobox [TempLeaveDayTypeID]
  readonly formCaLamViec: Locator          // Ca làm việc — k-combobox [ShiftID]
  readonly formTietHoc: Locator            // Tiết học — k-combobox [ShiftDetailID]
  readonly formLoaiSinh: Locator           // Loại sinh — k-combobox [LeaveDayTypeDefaultID]
  readonly formNoiGuiDen: Locator          // Nơi gửi đến — k-combobox [PlaceSendToID]
  readonly formQuaTrinhThaySan: Locator    // Quá trình thai sản — k-combobox [PregnancyCycleID]
  readonly formNguoiDuyetDau: Locator      // Người duyệt đầu — k-combobox [UserApproveID]
  readonly formNguoiDuyetKeTiep: Locator   // Người duyệt kế tiếp — k-combobox [UserApproveID3]
  readonly formNguoiDuyetTiepTheo: Locator // Người duyệt tiếp theo — k-combobox [UserApproveID4]
  readonly formNguoiDuyetCuoi: Locator     // Người duyệt cuối — k-combobox [UserApproveID2]
  readonly formNhanVien: Locator           // Nhân viên (chọn từ tree) — orgTreeView input
  readonly formGioVaoRa1: Locator          // Giờ vào ra — k-textbox [InTimeView1]
  readonly formGioVaoRa1Ra: Locator        // Giờ vào ra (ra) — k-textbox [OutTimeView1]
  readonly formGioVaoRa2: Locator          // Giờ vào ra giữa ca — k-textbox [InTimeView2]
  readonly formGioVaoRa2Ra: Locator        // Giờ vào ra giữa ca (ra) — k-textbox [OutTimeView2]
  readonly formTongSoGioNghi: Locator      // Tổng số giờ nghỉ — k-textbox [LeaveHours]
  readonly formSoNgayNghi: Locator         // Số ngày nghỉ — k-textbox [LeaveDays]
  readonly formTongNgayNghi: Locator       // Tổng ngày nghỉ — k-textbox [TypeHalfShiftLeaveDays]
  readonly formSoGioNghi: Locator          // Số giờ nghỉ — k-textbox [TypeHalfShiftLeaveHours]
  readonly formSoGioGiuaCa: Locator        // Số giờ giữa ca — k-textbox [HoursMiddleOfShift]
  readonly formBinhLuan1: Locator          // Cấp bình luận 1 — k-textbox [UserComment1]
  readonly formBinhLuan2: Locator          // Cấp bình luận 2 — k-textbox [UserComment2]
  readonly formBinhLuan3: Locator          // Cấp bình luận 3 — k-textbox [UserComment3]
  readonly formBinhLuan4: Locator          // Cấp bình luận 4 — k-textbox [UserComment4]
  readonly formLyDo: Locator              // Lý do — textarea [Comment]
  readonly formNoiLienHe: Locator          // Nơi liên hệ và nội dung công tác — textarea [BusinessReason]
  readonly formGhiChuNguoiDuyet: Locator   // Ghi chú người duyệt — textarea [CommentApprove]
  readonly formLyDoTuChoi: Locator         // Lý do từ chối — textarea [DeclineReason]
  readonly formTinhBuLuong: Locator        // Tính bù lương — checkbox [IsPayback]
  readonly formCanNguoiThayThe: Locator    // Cần người thay thế — checkbox [IsSubstitute]
  readonly formChungTuYTe: Locator         // Chứng từ y tế — checkbox [CreateLeaveDayInfo_MedicalDocument]
  readonly formNhanSuDieuChinh: Locator    // Nhân sự điều chỉnh — checkbox [CreateLeaveDayInfo_IsHrUpdate]
  readonly formChuyenTLDV: Locator         // Chuyển TLĐV (form) — checkbox [CreateLeaveDayInfo_IsUnitAssistant]

  constructor(private readonly page: Page) {
    // ─── Toolbar buttons ────────────────────────────────────────────────────

    this.btnTaoMoi = page.locator('a.k-button, button.k-button').filter({ hasText: /^Tạo mới$/ })
    this.btnTaoMoiKhongCa = page.locator('a.k-button, button.k-button').filter({ hasText: 'Tạo mới ngày nghỉ không ca' })
    this.btnTimKiem = page.locator('a.k-button, button.k-button').filter({ hasText: /^Tìm kiếm$/ })
    this.btnXacNhanKhanCap = page.locator('a.k-button, button.k-button').filter({ hasText: 'Xác nhận khẩn cấp' })
    this.btnChoDuyet = page.locator('a.k-button, button.k-button').filter({ hasText: /^Chờ duyệt$/ })
    this.btnPheDuyet = page.locator('a.k-button, button.k-button').filter({ hasText: /^Phê duyệt$/ })
    this.btnTuChoi = page.locator('a.k-button, button.k-button').filter({ hasText: /^Từ chối$/ })
    this.btnHuy = page.locator('a.k-button, button.k-button').filter({ hasText: /^Hủy$/ })
    this.btnKetXuat = page.locator('a.k-button, button.k-button').filter({ hasText: /^Kết xuất$/ })
    this.btnTaoMau = page.locator('a.k-button, button.k-button').filter({ hasText: /^Tạo mẫu$/ })
    this.btnKhac = page.locator('a.k-button, button.k-button').filter({ hasText: /^Khác$/ })
    this.btnXoa = page.locator('a.k-button, button.k-button').filter({ hasText: /^Xóa$/ })
    this.btnSaoChep = page.locator('a.k-button, button.k-button').filter({ hasText: /^Sao chép$/ })
    this.btnTinhSoNgayNghi = page.locator('a.k-button, button.k-button').filter({ hasText: 'Tính số ngày nghỉ' })
    this.btnCapNhatLoaiNgayNghi = page.locator('a.k-button, button.k-button').filter({ hasText: 'Cập nhật loại ngày nghỉ' })
    this.btnGuiMail = page.locator('a.k-button, button.k-button').filter({ hasText: /^Gửi mail$/ })

    this.btnLuuVaDong = page.locator('a.k-button, button.k-button').filter({ hasText: 'Lưu và đóng' })
    this.btnLuuVaTaoMoi = page.locator('a.k-button, button.k-button').filter({ hasText: 'Lưu và tạo mới' })
    this.btnXemSoNgayConLai = page.locator('a.k-button, button.k-button').filter({ hasText: 'Xem số ngày nghỉ còn lại' })
    this.btnXemSoGioConLai = page.locator('a.k-button, button.k-button').filter({ hasText: 'Xem số giờ nghỉ còn lại' })
    this.btnXemSoPhepConLai = page.locator('a.k-button, button.k-button').filter({ hasText: 'Xem số phép còn lại' })
    this.btnChiTiet = page.locator('a.k-button, button.k-button').filter({ hasText: /^Chi tiết$/ })

    // ─── Search filter fields ────────────────────────────────────────────────

    this.searchNgayNghiTu = page.locator('[name="indexDateStart"]').closest('span.k-datepicker').locator('input.k-input')
    this.searchNgayNghiDen = page.locator('[name="indexDateEnd"]').closest('span.k-datepicker').locator('input.k-input')
    this.searchKyCong = page.locator('[name="CutOffDurationID"]').closest('span.k-combobox').locator('input.k-input')
    this.searchLoaiNgayNghi = page.locator('[name="LeaveDayTypeID"]').closest('span.k-combobox').locator('input.k-input')
    this.searchLoai = page.locator('[name="DurationType"]').closest('span.k-combobox').locator('input.k-input')
    this.searchDonViKinhDoanh = page.locator('[name="ShopIDs"]').closest('span.k-combobox').locator('input.k-input')
    this.searchTenNhanVien = page.locator('[name="indexProfileName"]')
    this.searchMaNV = page.locator('[name="indexCodeEmp"]')
    this.searchBoPhanTrucThuoc = page.locator('[name="orgTreeView-input-indexOrgStructureTreeView"]')
    this.searchTrungDuLieu = page.locator('[name="IsDuplicate"]')
    this.searchDuLieuGiaiTrinh = page.locator('[name="IsExplanatory"]')
    this.searchChuyenTLDV = page.locator('[name="IsUnitAssistantSearch"]')

    // ─── Create/Edit form fields ─────────────────────────────────────────────

    this.formNgayBatDau = page.locator('[name="DateStart"]').closest('span.k-datepicker').locator('input.k-input')
    this.formNgayKetThuc = page.locator('[name="DateEnd"]').closest('span.k-datepicker').locator('input.k-input')
    this.formNgayDiLamLai = page.locator('[name="DateReturnToWork"]').closest('span.k-datepicker').locator('input.k-input')
    this.formNgayDuSinh = page.locator('[name="ExpectedDate"]').closest('span.k-datepicker').locator('input.k-input')
    this.formGioVao = page.locator('[name="HoursFrom"]').closest('span.k-timepicker').locator('input.k-input')
    this.formGioRa = page.locator('[name="HoursTo"]').closest('span.k-timepicker').locator('input.k-input')
    this.formKyChiTra = page.locator('[name="PayPeriodID"]').closest('span.k-combobox').locator('input.k-input')
    this.formNguoiThayThe = page.locator('[name="SubstituteID"]').closest('span.k-combobox').locator('input.k-input')
    this.formNhomLoaiNgayNghi = page.locator('[name="LeaveTypeGroup"]').closest('span.k-combobox').locator('input.k-input')
    this.formLoaiNgayNghi = page.locator('[name="TempLeaveDayTypeID"]').closest('span.k-combobox').locator('input.k-input')
    this.formCaLamViec = page.locator('[name="ShiftID"]').closest('span.k-combobox').locator('input.k-input')
    this.formTietHoc = page.locator('[name="ShiftDetailID"]').closest('span.k-combobox').locator('input.k-input')
    this.formLoaiSinh = page.locator('[name="LeaveDayTypeDefaultID"]').closest('span.k-combobox').locator('input.k-input')
    this.formNoiGuiDen = page.locator('[name="PlaceSendToID"]').closest('span.k-combobox').locator('input.k-input')
    this.formQuaTrinhThaySan = page.locator('[name="PregnancyCycleID"]').closest('span.k-combobox').locator('input.k-input')
    this.formNguoiDuyetDau = page.locator('[name="UserApproveID"]').closest('span.k-combobox').locator('input.k-input')
    this.formNguoiDuyetKeTiep = page.locator('[name="UserApproveID3"]').closest('span.k-combobox').locator('input.k-input')
    this.formNguoiDuyetTiepTheo = page.locator('[name="UserApproveID4"]').closest('span.k-combobox').locator('input.k-input')
    this.formNguoiDuyetCuoi = page.locator('[name="UserApproveID2"]').closest('span.k-combobox').locator('input.k-input')
    this.formNhanVien = page.locator('[name="orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure"]')
    this.formGioVaoRa1 = page.locator('[name="InTimeView1"]')
    this.formGioVaoRa1Ra = page.locator('[name="OutTimeView1"]')
    this.formGioVaoRa2 = page.locator('[name="InTimeView2"]')
    this.formGioVaoRa2Ra = page.locator('[name="OutTimeView2"]')
    this.formTongSoGioNghi = page.locator('[name="LeaveHours"]')
    this.formSoNgayNghi = page.locator('[name="LeaveDays"]')
    this.formTongNgayNghi = page.locator('[name="TypeHalfShiftLeaveDays"]')
    this.formSoGioNghi = page.locator('[name="TypeHalfShiftLeaveHours"]')
    this.formSoGioGiuaCa = page.locator('[name="HoursMiddleOfShift"]')
    this.formBinhLuan1 = page.locator('[name="UserComment1"]')
    this.formBinhLuan2 = page.locator('[name="UserComment2"]')
    this.formBinhLuan3 = page.locator('[name="UserComment3"]')
    this.formBinhLuan4 = page.locator('[name="UserComment4"]')
    this.formLyDo = page.locator('[name="Comment"]')
    this.formNoiLienHe = page.locator('[name="BusinessReason"]')
    this.formGhiChuNguoiDuyet = page.locator('[name="CommentApprove"]')
    this.formLyDoTuChoi = page.locator('[name="DeclineReason"]')
    this.formTinhBuLuong = page.locator('[name="IsPayback"]')
    this.formCanNguoiThayThe = page.locator('[name="IsSubstitute"]')
    this.formChungTuYTe = page.locator('[name="CreateLeaveDayInfo_MedicalDocument"]')
    this.formNhanSuDieuChinh = page.locator('[name="CreateLeaveDayInfo_IsHrUpdate"]')
    this.formChuyenTLDV = page.locator('[name="CreateLeaveDayInfo_IsUnitAssistant"]')
  }
}

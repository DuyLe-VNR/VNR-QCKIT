# Locator Map — att_leave_day

> Sinh bởi /qc_map_flow — 2026-06-12
> Group: att
> Source: component_att_leave_day.md + component-rule.md
> Locator file : .specify/tests/pages/att/AttLeaveDayLocator.ts
> Page Object  : .specify/tests/pages/att/att_leave_day/AttLeaveDayPage.ts

## Toolbar — List

| Property | Locator expression | Label | Type |
| --- | --- | --- | --- |
| `btnTaoMoi` | `page.getByRole('button', { name: 'Tạo mới' }).first()` | Tạo mới | k-button |
| `btnTaoMoiKhongCa` | `page.getByRole('button', { name: 'Tạo mới ngày nghỉ không ca' })` | Tạo mới ngày nghỉ không ca | k-button |
| `btnAddNew` | `page.getByRole('button', { name: 'Add new' })` | Add new | k-button |
| `btnTimKiem` | `page.getByRole('button', { name: 'Tìm kiếm' })` | Tìm kiếm | k-button |
| `btnXacNhanKhanCap` | `page.getByRole('button', { name: 'Xác nhận khẩn cấp' })` | Xác nhận khẩn cấp | k-button |
| `btnChoDuyet` | `page.getByRole('button', { name: 'Chờ duyệt' })` | Chờ duyệt | k-button |
| `btnPheDuyet` | `page.getByRole('button', { name: 'Phê duyệt' })` | Phê duyệt | k-button |
| `btnTuChoi` | `page.getByRole('button', { name: 'Từ chối' })` | Từ chối | k-button |
| `btnHuy` | `page.getByRole('button', { name: 'Hủy' })` | Hủy | k-button |
| `btnKetXuat` | `page.getByRole('button', { name: 'Kết xuất' })` | Kết xuất | k-button |
| `btnXoa` | `page.getByRole('button', { name: 'Xóa' })` | Xóa | k-button |
| `btnLuuVaDong` | `page.getByRole('button', { name: 'Lưu và đóng' })` | Lưu và đóng | k-button (form) |
| `btnLuuVaTaoMoi` | `page.getByRole('button', { name: 'Lưu và tạo mới' })` | Lưu và tạo mới | k-button (form) |

## Search Filter Fields

| Property | Locator expression | Label | Component | BasePage Method |
| --- | --- | --- | --- | --- |
| `filterTenNhanVien` | `div:has(FieldTitle+FieldValue).filter(hasText:'Tên nhân viên') input.k-textbox` | Tên nhân viên | k-textbox | `inputTextbox` |
| `filterMaNV` | `div:has(FieldTitle+FieldValue).filter(hasText:'Mã NV') input.k-textbox` | Mã NV | k-textbox | `inputTextbox` |
| `filterBoPhanTrucThuoc` | `[name="orgTreeView-input-indexOrgStructureTreeView"]` | Bộ phận trực thuộc | k-textbox (orgTree) | `inputTextbox` |
| `filterKyCong` | `[name="CutOffDurationID"].closest('span.k-combobox') input.k-input` | Kỳ công | k-combobox | `inputCombobox` |
| `filterLoaiNgayNghi` | `[name="LeaveDayTypeID"].closest('span.k-combobox') input.k-input` | Loại ngày nghỉ | k-combobox | `inputCombobox` |
| `filterLoai` | `[name="DurationType"].closest('span.k-combobox') input.k-input` | Loại | k-combobox | `inputCombobox` |
| `filterDonViKinhDoanh` | `[name="ShopIDs"].closest('span.k-combobox') input.k-input` | Đơn vị kinh doanh | k-combobox | `inputCombobox` |
| `filterThoiGianNghiTu` | `[name="indexDateStart"].closest('span.k-datepicker') input.k-input` | Thời gian nghỉ (từ) | k-datepicker | `inputTextbox` |
| `filterThoiGianNghiDen` | `[name="indexDateEnd"].closest('span.k-datepicker') input.k-input` | Thời gian nghỉ (đến) | k-datepicker | `inputTextbox` |
| `filterTrungDuLieu` | `[name="IsDuplicate"]` | Trùng dữ liệu! | checkbox | `inputCheckbox` |
| `filterDuLieuGiaiTrinh` | `[name="IsExplanatory"]` | Dữ liệu giải trình | checkbox | `inputCheckbox` |
| `filterChuyenTLDV` | `[name="IsUnitAssistantSearch"]` | Chuyển TLĐV | checkbox | `inputCheckbox` |

## Form Fields — Create form (inline dialog)

| Property | Locator expression | Label | Component | Required | BasePage Method |
| --- | --- | --- | --- | --- | --- |
| `formNhanVien` | `[name="orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure"]` | Nhân viên | k-textbox (orgTree) | ✓ | `inputTextbox` |
| `formNgayBatDau` | `[name="DateStart"].closest('span.k-datepicker') input.k-input` | Ngày bắt đầu | k-datepicker | ✓ | `inputTextbox` |
| `formNgayBatDauDen` | `[name="DateEnd"].closest('span.k-datepicker') input.k-input` | Đến ngày | k-datepicker | — | `inputTextbox` |
| `formNgayDiLamLai` | `[name="DateReturnToWork"].closest('span.k-datepicker') input.k-input` | Ngày đi làm lại | k-datepicker | — | `inputTextbox` |
| `formNgayDuSinh` | `[name="ExpectedDate"].closest('span.k-datepicker') input.k-input` | Ngày dự sinh | k-datepicker | — | `inputTextbox` |
| `formGioVao` | `[name="HoursFrom"].closest('span.k-timepicker') input.k-input` | Giờ vào | k-timepicker | — | `inputTextbox` |
| `formGioRa` | `[name="HoursTo"].closest('span.k-timepicker') input.k-input` | Giờ ra | k-timepicker | — | `inputTextbox` |
| `formKyChiTra` | `[name="PayPeriodID"].closest('span.k-combobox') input.k-input` | Kỳ chi trả | k-combobox | — | `inputCombobox` |
| `formNguoiThayThe` | `[name="SubstituteID"].closest('span.k-combobox') input.k-input` | Người thay thế | k-combobox | — | `inputCombobox` |
| `formNhomLoaiNgayNghi` | `[name="LeaveTypeGroup"].closest('span.k-combobox') input.k-input` | Nhóm loại ngày nghỉ | k-combobox | — | `inputCombobox` |
| `formLoaiNgayNghi` | `[name="TempLeaveDayTypeID"].closest('span.k-combobox') input.k-input` | Loại ngày nghỉ | k-combobox | ✓ | `inputCombobox` |
| `formCaLamViec` | `[name="ShiftID"].closest('span.k-combobox') input.k-input` | Ca làm việc | k-combobox | — | `inputCombobox` |
| `formTietHoc` | `[name="ShiftDetailID"].closest('span.k-combobox') input.k-input` | Tiết học | k-combobox | — | `inputCombobox` |
| `formLoaiSinh` | `[name="LeaveDayTypeDefaultID"].closest('span.k-combobox') input.k-input` | Loại sinh | k-combobox | — | `inputCombobox` |
| `formNoiGuiDen` | `[name="PlaceSendToID"].closest('span.k-combobox') input.k-input` | Nơi gửi đến | k-combobox | — | `inputCombobox` |
| `formQuaTrinhTHaiSan` | `[name="PregnancyCycleID"].closest('span.k-combobox') input.k-input` | Quá trình thai sản | k-combobox | — | `inputCombobox` |
| `formNguoiDuyetDau` | `[name="UserApproveID"].first().closest('span.k-combobox') input.k-input` | Người duyệt đầu | k-combobox | ✓ | `inputCombobox` |
| `formNguoiDuyetKeTiep` | `[name="UserApproveID3"].closest('span.k-combobox') input.k-input` | Người duyệt kế tiếp | k-combobox | — | `inputCombobox` |
| `formNguoiDuyetTiepTheo` | `[name="UserApproveID4"].closest('span.k-combobox') input.k-input` | Người duyệt tiếp theo | k-combobox | — | `inputCombobox` |
| `formNguoiDuyetCuoi` | `[name="UserApproveID2"].closest('span.k-combobox') input.k-input` | Người duyệt cuối | k-combobox | ✓ | `inputCombobox` |
| `formGioVaoRa` | `[name="InTimeView1"]` | Giờ vào ra | k-textbox | — | `inputTextbox` |
| `formGioVaoRaRa` | `[name="OutTimeView1"]` | Giờ vào ra (ra) | k-textbox | — | `inputTextbox` |
| `formGioVaoRaGiuaCa` | `[name="InTimeView2"]` | Giờ vào ra giữa ca | k-textbox | — | `inputTextbox` |
| `formGioVaoRaGiuaCaRa` | `[name="OutTimeView2"]` | Giờ vào ra giữa ca (ra) | k-textbox | — | `inputTextbox` |
| `formTongSoGioNghi` | `[name="LeaveHours"]` | Tổng số giờ nghỉ | k-textbox | — | `inputTextbox` |
| `formSoNgayNghi` | `[name="LeaveDays"]` | Số ngày nghỉ | k-textbox | — | `inputTextbox` |
| `formLyDo` | `[name="Comment"]` | Lý do | textarea | — | `inputTextbox` |
| `formNoiLienHeVaNoiDungCongTac` | `[name="BusinessReason"]` | Nơi liên hệ và nội dung công tác | textarea | — | `inputTextbox` |
| `formGhiChuNguoiDuyet` | `[name="CommentApprove"]` | Ghi chú người duyệt | textarea | — | `inputTextbox` |
| `formLyDoTuChoi` | `[name="DeclineReason"]` | Lý do từ chối | textarea | — | `inputTextbox` |
| `formTinhBuLuong` | `[name="IsPayback"]` | Tính bù lương | checkbox | — | `inputCheckbox` |
| `formCanNguoiThayThe` | `[name="IsSubstitute"]` | Cần người thay thế | checkbox | — | `inputCheckbox` |
| `formChungTuYTe` | `[name="CreateLeaveDayInfo_MedicalDocument"]` | Chứng từ y tế | checkbox | — | `inputCheckbox` |
| `formNhanSuDieuChinh` | `[name="CreateLeaveDayInfo_IsHrUpdate"]` | Nhân sự điều chỉnh | checkbox | — | `inputCheckbox` |
| `formChuyenTLDV` | `[name="CreateLeaveDayInfo_IsUnitAssistant"]` | Chuyển TLĐV | checkbox | — | `inputCheckbox` |

## [TODO] Fields cần xác nhận thủ công

| Field | Vấn đề | Gợi ý |
| --- | --- | --- |
| `formNhanVien` | orgTreeView input — cần click chọn từ popup tree, không phải fill trực tiếp | Dùng `page.locator('[name="orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure"]').click()` rồi chọn node |
| `filterBoPhanTrucThuoc` | orgTreeView tương tự — placeholder "Vui lòng chọn..." | Inspect thực tế để xác nhận selector |
| `formNguoiDuyetDau` | name="UserApproveID" có thể trùng với các combobox người duyệt khác | Dùng `.first()` — xác nhận thứ tự DOM |
| `donViToChuc` (cat) | OrgTreeViewDropDown — dạng treeview đặc biệt | Inspect DOM thực tế tại /Cat_LeaveDayType/Create |

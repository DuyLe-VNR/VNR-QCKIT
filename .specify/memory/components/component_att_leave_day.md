# Component List — att_leave_day

> Screen   : DS Ngày nghỉ
> URL      : /#/Hrm_Main_Web/Att_LeaveDay/Index
> Sinh bởi : /qc_detect_component — 2026-06-09
> Tổng     : 5 component types, 80+ instances

---

> ⚠ **Lưu ý kiến trúc**: Màn hình này dùng **Kendo MVC + AngularJS** (không phải Angular SPA với vnr-input/vnr-combobox/vnr-button).
> Form tạo mới mở **inline** (không điều hướng trang mới), bao gồm 2 vùng:
> - **Vùng tìm kiếm / bộ lọc** (Search panel) — các field lọc danh sách
> - **Form tạo/sửa ngày nghỉ** (Create/Edit inline) — các field nhập liệu chính
> Tất cả component đều được đánh dấu `[NEW - chưa có trong components.md]`.

---

## k-datepicker — Kendo DatePicker (8 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Ngày bắt đầu | DateStart | Từ ngày | — | Create form |
| 2 | Ngày bắt đầu (đến) | DateEnd | Đến ngày | — | Create form |
| 3 | Ngày đi làm lại | DateReturnToWork | Ngày đi làm lại | — | Create form |
| 4 | Ngày dự sinh | ExpectedDate | Ngày dự sinh | — | Create form |
| 5 | Thời gian nghỉ (từ) | indexDateStart | Từ ngày | — | Search filter |
| 6 | Thời gian nghỉ (đến) | indexDateEnd | Đến ngày | — | Search filter |

---

## k-timepicker — Kendo TimePicker (2 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Giờ vào | HoursFrom | — | — | Create form |
| 2 | Giờ ra | HoursTo | — | — | Create form |

---

## k-combobox — Kendo ComboBox (10 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Kỳ công | CutOffDurationID | — | — | Search filter |
| 2 | Loại ngày nghỉ (tìm kiếm) | LeaveDayTypeID | — | — | Search filter |
| 3 | Loại | DurationType | — | — | Search filter |
| 4 | Đơn vị kinh doanh | ShopIDs | — | — | Search filter |
| 5 | Kỳ chi trả | PayPeriodID | — | — | Create form |
| 6 | Người thay thế | SubstituteID | — | — | Create form |
| 7 | Nhóm loại ngày nghỉ | LeaveTypeGroup | — | — | Create form |
| 8 | Loại ngày nghỉ (form) | TempLeaveDayTypeID | — | — | Create form |
| 9 | Ca làm việc | ShiftID | — | — | Create form |
| 10 | Tiết học | ShiftDetailID | — | — | Create form |
| 11 | Loại sinh | LeaveDayTypeDefaultID | — | — | Create form |
| 12 | Nơi gửi đến | PlaceSendToID | — | — | Create form |
| 13 | Quá trình thai sản | PregnancyCycleID | — | — | Create form |
| 14 | Người duyệt đầu | UserApproveID | — | — | Create form |
| 15 | Người duyệt kế tiếp | UserApproveID3 | — | — | Create form |
| 16 | Người duyệt tiếp theo | UserApproveID4 | — | — | Create form |
| 17 | Người duyệt cuối | UserApproveID2 | — | — | Create form |

---

## k-textbox / input text (16 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Tên nhân viên | indexProfileName | — | — | Search filter |
| 2 | Mã NV | indexCodeEmp | — | — | Search filter |
| 3 | Bộ phận trực thuộc | orgTreeView-input-indexOrgStructureTreeView | Vui lòng chọn... | — | Search filter |
| 4 | Nhân viên (chọn từ tree) | orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure | Vui lòng chọn... | — | Create form |
| 5 | Giờ vào ra | InTimeView1 | — | — | Create form |
| 6 | Giờ vào ra (ra) | OutTimeView1 | — | — | Create form |
| 7 | Giờ vào ra giữa ca | InTimeView2 | — | — | Create form |
| 8 | Giờ vào ra giữa ca (ra) | OutTimeView2 | — | — | Create form |
| 9 | Tổng số giờ nghỉ | LeaveHours | — | — | Create form |
| 10 | Số ngày nghỉ | LeaveDays | — | — | Create form |
| 11 | Tổng ngày nghỉ | TypeHalfShiftLeaveDays | — | — | Create form |
| 12 | Số giờ nghỉ | TypeHalfShiftLeaveHours | — | — | Create form |
| 13 | Số giờ giữa ca | HoursMiddleOfShift | — | — | Create form |
| 14 | Cấp bình luận 1 | UserComment1 | — | — | Create form |
| 15 | Cấp bình luận 2 | UserComment2 | — | — | Create form |
| 16 | Cấp bình luận 3 | UserComment3 | — | — | Create form |
| 17 | Cấp bình luận 4 | UserComment4 | — | — | Create form |

---

## textarea (4 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Lý do | Comment | — | — | Create form |
| 2 | Nơi liên hệ và nội dung công tác | BusinessReason | — | — | Create form |
| 3 | Ghi chú người duyệt | CommentApprove | — | — | Create form |
| 4 | Lý do từ chối | DeclineReason | — | — | Create form |

---

## checkbox (10 fields)  [NEW - chưa có trong components.md]

| # | Label | name | Required | Context |
| --- | --- | --- | --- | --- |
| 1 | Trùng dữ liệu! | IsDuplicate | — | Search filter |
| 2 | Dữ liệu giải trình | IsExplanatory | — | Search filter |
| 3 | Chuyển TLĐV (tìm kiếm) | IsUnitAssistantSearch | — | Search filter |
| 4 | Tính bù lương | IsPayback | — | Create form |
| 5 | Cần người thay thế | IsSubstitute | — | Create form |
| 6 | Chứng từ y tế | CreateLeaveDayInfo_MedicalDocument | — | Create form |
| 7 | Nhân sự điều chỉnh | CreateLeaveDayInfo_IsHrUpdate | — | Create form |
| 8 | Chuyển TLĐV (form) | CreateLeaveDayInfo_IsUnitAssistant | — | Create form |

---

## k-button — Kendo Button / toolbar (13 buttons)  [NEW - chưa có trong components.md]

| # | Label | Type / Action | Context |
| --- | --- | --- | --- |
| 1 | Tạo mới | create | List toolbar |
| 2 | Tạo mới ngày nghỉ không ca | create-no-shift | List toolbar |
| 3 | Add new | create | List toolbar |
| 4 | Tìm kiếm | search | List toolbar |
| 5 | Xác nhận khẩn cấp | urgent-confirm | List toolbar |
| 6 | Chờ duyệt | pending | List toolbar |
| 7 | Phê duyệt | approve | List toolbar |
| 8 | Từ chối | reject | List toolbar |
| 9 | Hủy | cancel | List toolbar |
| 10 | Kết xuất | export | List toolbar |
| 11 | Tạo mẫu | template | List toolbar |
| 12 | Khác | other | List toolbar |
| 13 | Xóa | delete | List toolbar |
| 14 | Lưu và đóng | save-close | Form toolbar |
| 15 | Lưu và tạo mới | save-new | Form toolbar |
| 16 | Xem số ngày nghỉ còn lại | ComputeRemainDays | Form |
| 17 | Xem số giờ nghỉ còn lại | ComputeRemainDays | Form |
| 18 | Xem số phép còn lại | ComputeRemainLeaveDays | Form |
| 19 | Chi tiết | detail | Form |
| 20 | Sao chép | copy | List toolbar |
| 21 | Tính số ngày nghỉ | calc | List toolbar |
| 22 | Cập nhật loại ngày nghỉ | update-type | List toolbar |
| 23 | Gửi mail | send-mail | List toolbar |

---

## Tóm tắt

| Component | Số lượng | Context chính |
| --- | --- | --- |
| k-datepicker | 6 | Create form + Search filter |
| k-timepicker | 2 | Create form |
| k-combobox | 17 | Create form + Search filter |
| k-textbox (text input) | 17 | Create form + Search filter |
| textarea | 4 | Create form |
| checkbox | 8 | Create form + Search filter |
| k-button | 23 | List toolbar + Form toolbar |

> ⚠ **Component mới phát hiện**: Màn hình sử dụng Kendo UI (k-datepicker, k-timepicker, k-combobox, k-textbox, k-button) và native textarea/checkbox.
> → Chạy `/qc_init_component` để thêm `k-datepicker`, `k-timepicker`, `k-combobox`, `k-textbox`, `k-button` vào components.md nếu cần.

> **Đặc điểm màn hình**: Form tạo mới ngày nghỉ mở **inline** (không chuyển trang). Bao gồm:
> - Panel tìm kiếm / bộ lọc danh sách (phía trên grid)
> - Form nhập liệu ngày nghỉ bên cạnh (có nhiều section: Thông tin NV, Thời gian, Giờ, Lý do, Phê duyệt)

> Dùng file này làm input cho /qc_generate để sinh test case chính xác hơn.

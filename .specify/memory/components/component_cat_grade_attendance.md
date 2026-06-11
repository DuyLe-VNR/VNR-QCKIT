# Component List — cat_grade_attendance

> Screen   : Chế độ công
> URL      : /#/Hrm_Main_Web/Cat_GradeAttendance/Index → Create: /#/Hrm_Main_Web/Cat_GradeAttendance/Create
> Sinh bởi : /qc_detect_component — 2026-06-09
> Tổng     : 4 component types, 29 instances

---

> ⚠ **Lưu ý kiến trúc**: Màn hình này dùng **Kendo MVC + AngularJS** (không phải Angular SPA với vnr-input/vnr-combobox/vnr-button).
> Các component là Kendo TextBox, Kendo ComboBox, native checkbox/select và Kendo Button.
> Tất cả đều được đánh dấu `[NEW - chưa có trong components.md]`.

---

## k-textbox — input text (4 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Mã chế độ công | Code | — | — | Create page |
| 2 | Tên chế độ công | GradeAttendanceName | — | — | Create page |
| 3 | Mô tả | Description | — | — | Create page |
| 4 | Ngày có mã ca làm việc thuộc cấu hình thì ngày liền sau phải OFF | ShiftCodeInDay | — | — | Create page |
| 5 | Công thức tính công chuẩn/1 tháng | OTWorkdayFormula | — | — | Create page |

---

## k-combobox — dropdown (1 field)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Loại kỳ công | CutOffDuration_TypeDurationID | Vui lòng chọn... | — | Create page |

---

## k-select — Kendo DropDownList / select (14+ fields)  [NEW - chưa có trong components.md]

| # | Label | name | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Cho phép tách tăng ca | _SplitShiftDuration23 | — | — | Create page |
| 2 | Ngày không xếp ca | _DaysOFWeeksNew | — | — | Create page |
| 3 | TC ngày thường | _OTNomalPayMent1 | — | — | Create page |
| 4 | TC đêm ngày thường | _OTNomalNightPayMent1 | — | — | Create page |
| 5 | TC đêm ngày thường 2 | _OTNomalNightPayMent25 | — | — | Create page |
| 6 | TC ngày nghỉ | _OTLeaveDayPayMent1 | — | — | Create page |
| 7 | TC đêm ngày nghỉ | _OTLeaveDayNightPayMent1 | — | — | Create page |
| 8 | TC ngày lễ | _OTHolidayPayMent1 | — | — | Create page |
| 9 | TC đêm ngày lễ | _OTHolidayNightPayMent1 | — | — | Create page |
| 10 | TC ngày nghỉ lễ công ty | _OTHolidayComPayMent1 | — | — | Create page |
| 11 | TC đêm ngày nghỉ lễ công ty | _OTHolidayComNightPayMent1 | — | — | Create page |
| 12 | TC ngày lễ quốc gia | _OTNationalHolidayPayment1 | — | — | Create page |
| 13 | TC đêm ngày lễ quốc gia | _OTNationalHolidayNightPayment1 | — | — | Create page |
| 14 | Tăng ca ngày thường (loại giới hạn) | _OTTypeLimitWorkingDay1 | — | — | Create page |
| 15 | Tăng ca ngày lễ (loại giới hạn) | _OTTypeLimitHoliDay1 | — | — | Create page |
| 16 | Tăng ca ngày nghỉ phép (loại giới hạn) | _OTTypeLimitLeaveDay1 | — | — | Create page |
| 17 | Tăng ca ngày không có lịch làm việc (loại giới hạn) | _OTTypeLimitNoWorkingDay1 | — | — | Create page |
| 18 | Tăng ca ngày thường (loại đăng ký) | _OTTypeRegistedWorkingDay1 | — | — | Create page |
| 19 | Tăng ca ngày lễ (loại đăng ký) | _OTTypeRegistedHoliDay1 | — | — | Create page |
| 20 | Tăng ca ngày nghỉ phép (loại đăng ký) | _OTTypeRegistedLeaveDay1 | — | — | Create page |
| 21 | Tăng ca ngày không có lịch làm việc (loại đăng ký) | _OTTypeRegistedNoWorkingDay1 | — | — | Create page |

---

## checkbox — input checkbox (2 fields)  [NEW - chưa có trong components.md]

| # | Label | name | Required | Context |
| --- | --- | --- | --- | --- |
| 1 | Vô hiệu | IsInactive | — | Create page |
| 2 | Tính làm thêm | IsReceiveOvertimeBonus | — | Create page |

---

## k-button — Kendo Button (6 buttons)  [NEW - chưa có trong components.md]

| # | Label | customevent / action | Context |
| --- | --- | --- | --- |
| 1 | Lưu | doSave | Create page toolbar |
| 2 | Lưu và tạo mới | doSaveNew | Create page toolbar |
| 3 | Tạo mới | — | List page toolbar |
| 4 | Tạo mới wz | — | List page toolbar |
| 5 | Nhân bản | — | List page toolbar |
| 6 | Xóa | — | List page toolbar |
| 7 | Tìm kiếm | — | List page toolbar |
| 8 | Xuất excel | — | List page toolbar |
| 9 | Đổi cột | — | List page toolbar |

---

## Tóm tắt

| Component | Số lượng | Context chính |
| --- | --- | --- |
| k-textbox (input text) | 5 | Create page |
| k-combobox (dropdown) | 1 | Create page |
| k-select (select / DropDownList) | 21 | Create page |
| checkbox | 2 | Create page |
| k-button | 9 | toolbar |

> ⚠ **Component mới phát hiện**: Màn hình sử dụng Kendo UI (k-textbox, k-combobox, k-select, k-button) và native checkbox — không phải vnr-input/vnr-combobox/vnr-button.
> → Chạy `/qc_init_component` để thêm `k-textbox`, `k-combobox`, `k-select`, `k-button` vào components.md nếu cần.

> Dùng file này làm input cho /qc_generate để sinh test case chính xác hơn.

# Component List — cat_leave_day_type

> Screen   : DS Loại ngày nghỉ
> URL      : /#/Hrm_Main_Web/Cat_LeaveDayType/Index → Create: /#/Hrm_Main_Web/Cat_LeaveDayType/Create
> Sinh bởi : /qc_detect_component — 2026-06-09
> Tổng     : 4 component types, 39 instances

---

> ⚠ **Lưu ý kiến trúc**: Màn hình này dùng **Kendo MVC + AngularJS** (không phải Angular SPA với vnr-input/vnr-combobox/vnr-button).
> Các component là Kendo TextBox, Kendo ComboBox, native checkbox và Kendo Button.
> Tất cả đều được đánh dấu `[NEW - chưa có trong components.md]`.

---

## k-textbox — input text (5 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Loại ngày nghỉ | LeaveDayTypeName | — | — | dialog (Create page) |
| 2 | Mã | Code | — | — | dialog (Create page) |
| 3 | Mã TK | CodeStatistic | — | — | dialog (Create page) |
| 4 | Nhóm loại ngày nghỉ | LeaveTypeGroup | — | — | dialog (Create page) |
| 5 | Ghi chú | Notes | — | — | dialog (Create page) |

---

## k-combobox — dropdown (3 fields)  [NEW - chưa có trong components.md]

| # | Label | name (formControlName) | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Đơn vị tổ chức | orgTreeView (OrgTreeViewDropDown) | Vui lòng chọn... | — | dialog (Create page) |
| 2 | Mã phụ thuộc | CodeLeaveDayDepend | — | — | dialog (Create page) |
| 3 | Loại nhóm nghỉ | LeaveTypeGroup (k-combobox) | — | — | dialog (Create page) |

---

## k-dropdown — Kendo DropdownList (1 field)  [NEW - /qc_auto_test 090626]

| # | Label | name | Values | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Giới tính áp dụng | ApplyGender | All/Female/Male | — | dialog (Create/Edit page) [NEW - /qc_auto_test 090626] |

---

## checkbox — input checkbox (27 fields)  [NEW - chưa có trong components.md]

| # | Label | name | Required | Context |
| --- | --- | --- | --- | --- |
| 1 | Chưa chọn trong portal | NotSelectedInPortal | — | dialog |
| 2 | Chứng từ y tế | MedicalDocument | — | dialog |
| 3 | Không kiểm tra ca | IsNoShift | — | dialog |
| 4 | Không đăng ký nghỉ trong t.gian thử việc | IsProbationNotLeaveDay | — | dialog |
| 5 | Chặn | IsProbationNotLeaveDayBlock | — | dialog |
| 6 | Cho phép lưu khi trùng dữ liệu được sinh từ lịch làm việc | IsAllowDuplicateData | — | dialog |
| 7 | Ngày thường | IsWorkDay | — | dialog |
| 8 | Quỹ phép nghị định 85 | IsMenses | — | dialog |
| 9 | Loại nghỉ BHXH | IsInsuranceLeave | — | dialog |
| 10 | Số phép thêm tồn đầu kỳ | IsAdditonalLeave | — | dialog |
| 11 | Nghỉ bù hưởng chế độ | IsCompensationforMaternity | — | dialog |
| 12 | Phép kết hôn | IsMarrige | — | dialog |
| 13 | Phép ốm | IsSick | — | dialog |
| 14 | Nghỉ phải làm bù | IsTimeOffMakeUp | — | dialog |
| 15 | Phép thai sản | IsPregnantLeave | — | dialog |
| 16 | Đi công tác | IsBusinessTravel | — | dialog |
| 17 | Hưởng lương theo luật | IsPaidLeaveInLaw | — | dialog |
| 18 | Nghỉ ngừng việc | IsForceMajeure | — | dialog |
| 19 | Là phép năm | IsAnnualLeave | — | dialog |
| 20 | Nghỉ bù | IsTimeOffInLieu | — | dialog |
| 21 | Trừ vào phép đầu kỳ | ExceptInAnlBeginning | — | dialog |
| 22 | Trừ vào phép thâm niên | ExceptInAnlSeniority | — | dialog |
| 23 | Cảnh báo (max/năm) | IsWarningMaxPerYear | — | dialog |
| 24 | Suất ăn | IsMeal | — | dialog |
| 25 | Tải người thân | IsLoadRelatives | — | dialog |
| 26 | Vô hiệu | IsInactive | — | dialog |
| 27 | Yêu cầu ngày liên tục | IsRequireConsecutive | — | dialog [NEW - /qc_auto_test 090626] |
| 28 | (các checkbox bổ sung trong config) | — | — | dialog |

---

## numeric — input số (3 fields)  [NEW - chưa có trong components.md]

| # | Label | name | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Số thứ tự | Order | — | — | dialog |
| 2 | Số ngày nghỉ tối đa/năm | MaxPerYear | — | — | dialog |
| 3 | Số ngày nghỉ tối đa/tháng | MaxPerMonth | — | — | dialog |
| 4 | Số ngày tối đa/tháng (KN) | MaxConsecutiveDaysPerMonth | — | conditional (hiện khi IsRequireConsecutive=true) | dialog [NEW - /qc_auto_test 090626] |

---

## text-formula (1 fields)  [NEW - chưa có trong components.md]

| # | Label | name | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Công thức | Formula | — | — | dialog |
| 2 | DS Số giờ đăng ký nghỉ giữa ca | ListRegisterHours | — | — | dialog |
| 3 | Điều kiện được đăng ký | ConditionRegisteredFormula | — | — | dialog |

---

## k-button — Kendo Button (4 buttons)  [NEW - chưa có trong components.md]

| # | Label | customevent / action | Context |
| --- | --- | --- | --- |
| 1 | Lưu | doSave | Create page toolbar |
| 2 | Lưu và tạo mới | doSaveNew | Create page toolbar |
| 3 | Tạo mới | — | List page toolbar |
| 4 | Xóa | — | List page toolbar |
| 5 | Tìm kiếm | — | List page toolbar |
| 6 | Xuất excel | — | List page toolbar |
| 7 | Đổi cột | — | List page toolbar |

---

## Tóm tắt

| Component | Số lượng | Context chính |
| --- | --- | --- |
| k-textbox (input text) | 5 | Create page / dialog |
| k-combobox (dropdown) | 3 | Create page / dialog |
| checkbox | 26+ | Create page / dialog |
| numeric input | 3 | Create page / dialog |
| k-button | 7 | toolbar |

> ⚠ **Component mới phát hiện**: Màn hình sử dụng Kendo UI (k-textbox, k-combobox, k-button) và native checkbox — không phải vnr-input/vnr-combobox/vnr-button.
> → Chạy `/qc_init_component` để thêm `k-textbox`, `k-combobox`, `k-button` vào components.md nếu cần.

> Dùng file này làm input cho /qc_generate để sinh test case chính xác hơn.

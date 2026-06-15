# Field Catalog — PBI 090626: Phép kinh nguyệt

> PBI: 090626  
> Sinh ngày: 2026-06-12

---

## Cat_LeaveDayType — 3 Fields Mới (BS-01)

| Field | Selector hint | Loại | Bắt buộc | Validation | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| ApplyGender | `[TODO: selector field mới BS-01 — chưa có trong component_cat.md]` | k-combobox | Không | All / Female | Default=All. Giá trị: `All` hoặc `Female` |
| IsRequireConsecutive | `[TODO: selector field mới BS-01]` | checkbox | Không | boolean | Khi bật → hiện MaxConsecutiveDaysPerMonth |
| MaxConsecutiveDaysPerMonth | `[TODO: selector field mới BS-01]` | numeric | Có (khi IsRequireConsecutive=true) | Required khi IsRequireConsecutive=true | int, null khi IsRequireConsecutive=false |

### Fields Hiện Có Liên Quan

| Field | Selector hint | Loại | Bắt buộc | Ghi chú |
| --- | --- | --- | --- | --- |
| LeaveDayTypeName | `div:has(FieldTitle+FieldValue).filter('Loại ngày nghỉ') input.k-textbox` | k-textbox | Có | |
| Code | `div:has(FieldTitle+FieldValue).filter('Mã') input.k-textbox` | k-textbox | Có | |
| IsMenses | `[name="IsMenses"]` | checkbox | Không | Quỹ phép NĐ85 — cần bật cho loại KN |
| IsInactive | `[name="IsInactive"]` | checkbox | Không | Vô hiệu |

---

## Att_LeaveDay — Form Fields (liên quan đến PBI này)

| Field | Selector hint | Loại | Bắt buộc | Ghi chú |
| --- | --- | --- | --- | --- |
| Nhân viên (orgTree) | `[name="orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure"]` | k-textbox (orgTree) | Có | Chọn NV từ tree popup |
| Loại ngày nghỉ | `[name="TempLeaveDayTypeID"].closest('span.k-combobox') input.k-input` | k-combobox | Có | Dropdown filter theo giới tính NV (BS-03) |
| Ngày bắt đầu | `[name="DateStart"].closest('span.k-datepicker') input.k-input` | k-datepicker | Có | |
| Người duyệt đầu | `[name="UserApproveID"].first().closest('span.k-combobox') input.k-input` | k-combobox | Có | |
| Người duyệt cuối | `[name="UserApproveID2"].closest('span.k-combobox') input.k-input` | k-combobox | Có | |

---

## Validate Rules — Backend

| Rule | Field | Method | Logic |
| --- | --- | --- | --- |
| Rule 1 | ApplyGender | `ValidateGenderApplyFilter` | ApplyGender=Female AND giới tính NV≠Nữ → FAIL |
| Rule 2 | IsRequireConsecutive | `ValidateConsecutiveDays` | LastApprovedDate≠null AND ngày≠LastApprovedDate+1 → FAIL |
| Rule 3 | MaxConsecutiveDaysPerMonth | `ValidateMonthlyConsecutiveLimit` | ApprovedCount>=MaxConsecutiveDaysPerMonth → FAIL |

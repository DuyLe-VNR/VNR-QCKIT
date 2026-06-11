# Test Cases — 090626: Nghỉ kinh nguyệt cho NV nữ (BS-01 → BS-03)

> PBI: 090626
> Sinh bởi /qc_generate — 2026-06-10
> Spec: .specify/specs/090626/spec.md
> Màn hình: cat_leave_day_type (Admin config BS-01), att_leave_day (đăng ký BS-02), dropdown filter (BS-03)

## Page Object Context

### CatLeaveDayTypePage (`cat`)

| Action method | Mô tả |
| --- | --- |
| `catPage.goto()` | Mở danh sách Cat_LeaveDayType (`/Cat_LeaveDayType/Index`) |
| `catPage.openCreateForm()` | Click Tạo mới → navigate sang `/Cat_LeaveDayType/Create` |
| `catPage.fillForm(data)` | Điền form (partial) — chỉ các field có trong CatLeaveDayTypeLocator |
| `catPage.submitForm()` | Click Lưu (customevent=doSave) |
| `catPage.createRecord(data)` | openCreateForm + fillForm + submitForm (shortcut) |

**Locator field mới** (chưa có trong CatLeaveDayTypeLocator.ts — bổ sung sau khi FE deploy):

| Field | Selector tạm | Label UI | Ghi chú |
| --- | --- | --- | --- |
| ApplyGender | `input[name="ApplyGender_input"]` hoặc `select[name="ApplyGender"]` | Giới tính áp dụng | k-combobox / k-dropdownlist |
| IsRequireConsecutive | `input[name="IsRequireConsecutive"]` | Yêu cầu ngày liên tục | checkbox |
| MaxConsecutiveDaysPerMonth | `input[name="MaxConsecutiveDaysPerMonth"]` | Số ngày tối đa/tháng | number input, conditional show |

### AttLeaveDayPage (`att`)

| Action method | Mô tả |
| --- | --- |
| `leaveDayPage.goto()` | Mở DS Ngày nghỉ (`/Att_LeaveDay/Index`) |
| `leaveDayPage.openCreateForm()` | Click Tạo mới (inline form) |
| `leaveDayPage.fillCreateForm(data)` | Điền form (partial data object) |
| `leaveDayPage.submitForm()` | Click Lưu và đóng |
| `leaveDayPage.createRecord(data)` | openCreateForm + fillCreateForm + submitForm (shortcut) |
| `leaveDayPage.approveSelected()` | Click Phê duyệt |
| `leaveDayPage.rejectSelected()` | Click Từ chối |

---

## Tóm tắt

| Nhóm | ✅ Auto | 🖐 Manual | Tổng | Priority | ✅ Passed |
| --- | --- | --- | --- | --- | --- |
| BS-01: Admin cấu hình Cat_LeaveDayType | 5 | 0 | 5 | P1 | 2/5 |
| BS-02 Rule 1: Gender Filter | 5 | 0 | 5 | P1 | 0/5 |
| BS-02 Rule 2: Consecutive Days | 2 | 3 | 5 | P1 | 0/2 |
| BS-02 Rule 3: Monthly Limit | 2 | 2 | 4 | P1 | 0/2 |
| BS-03: Filter dropdown theo gender | 4 | 0 | 4 | P1 | 0/4 |
| Edge case | 1 | 1 | 2 | P2 | 0/1 |
| **Tổng** | **19** | **6** | **25** | — | **2/19** |

---

## TC-001 — Form Cat_LeaveDayType hiển thị đủ 3 field mới sau DB migration

**Mục tiêu**: Verify 3 field mới (ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth) xuất hiện trên form Create/Edit sau khi migration chạy
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Navigate → mở form → verify element visible, tất cả qua DOM
**Nhóm**: BS-01 Admin cấu hình

**Tiền điều kiện**:
- Đã đăng nhập Admin / BPNS quản trị
- DB đã chạy `v059_add_leavetype_gender_fields.sql` (ALTER TABLE Cat_LeaveDayType ADD ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth)

**Bước thực hiện**:
// Page Object: CatLeaveDayTypePage
1. Gọi `catPage.goto()`
2. Gọi `catPage.openCreateForm()` — navigate sang `/Cat_LeaveDayType/Create`
3. Verify element visible: `page.locator('input[name="ApplyGender_input"]')` hoặc `page.locator('select[name="ApplyGender"]')`
4. Verify element visible: `page.locator('input[name="IsRequireConsecutive"]')`
5. Verify element visible: `page.locator('input[name="MaxConsecutiveDaysPerMonth"]')`

**Kết quả mong đợi**:
- Field "Giới tính áp dụng" (ApplyGender) hiển thị dưới dạng dropdown, mặc định = "Tất cả"
- Checkbox "Yêu cầu ngày liên tục" (IsRequireConsecutive) hiển thị, mặc định = unchecked
- Field "Số ngày tối đa/tháng" (MaxConsecutiveDaysPerMonth) hiển thị (có thể ẩn hoặc disabled khi IsRequireConsecutive=false)

---

## TC-002 — Cấu hình thành công loại nghỉ kinh nguyệt (ApplyGender=Female, IsRequireConsecutive=1, MaxConsecutiveDaysPerMonth=3)

**Mục tiêu**: Tạo mới loại nghỉ kinh nguyệt với đầy đủ config BS-01, lưu thành công và persist đúng
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Input → Lưu → mở lại → verify field values, tất cả qua DOM
**Nhóm**: BS-01 Admin cấu hình

**Tiền điều kiện**:
- Đã đăng nhập Admin có quyền tạo/sửa Cat_LeaveDayType
- DB đã chạy migration

**Bước thực hiện**:
// Page Object: CatLeaveDayTypePage
1. Gọi `catPage.goto()`
2. Gọi `catPage.openCreateForm()`
3. Gọi `catPage.fillForm({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ma: '{datafake.menstrual.ma_loai}', quyPhepNghiDinh85: true })`
4. Chọn ApplyGender = "Nữ": `inputCombobox(page.locator('input[name="ApplyGender_input"]'), 'Nữ', 'Giới tính áp dụng')`
5. Tick IsRequireConsecutive = true: `inputCheckbox(page.locator('input[name="IsRequireConsecutive"]'), true, 'Yêu cầu ngày liên tục')`
6. Nhập MaxConsecutiveDaysPerMonth = 3: `inputTextbox(page.locator('input[name="MaxConsecutiveDaysPerMonth"]'), '3', 'Số ngày tối đa/tháng')`
7. Gọi `catPage.submitForm()`
8. Mở lại form Edit record vừa tạo → verify các field value

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- Form Edit hiển thị: ApplyGender = "Nữ", IsRequireConsecutive = checked, MaxConsecutiveDaysPerMonth = 3
- IsMenses = checked (quyPhepNghiDinh85)

---

## TC-003 — MaxConsecutiveDaysPerMonth chỉ hiển thị khi IsRequireConsecutive = true

**Mục tiêu**: Field "Số ngày tối đa/tháng" conditional show — ẩn khi unchecked, hiện khi checked
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Toggle checkbox → verify element visible/hidden qua DOM
**Nhóm**: BS-01 Admin cấu hình

**Tiền điều kiện**:
- Đăng nhập Admin, đang mở form Create Cat_LeaveDayType
- IsRequireConsecutive = unchecked (default)

**Bước thực hiện**:
// Page Object: CatLeaveDayTypePage
1. Gọi `catPage.goto()`
2. Gọi `catPage.openCreateForm()`
3. Verify `page.locator('input[name="MaxConsecutiveDaysPerMonth"]')` ẩn hoặc disabled khi IsRequireConsecutive = false
4. Tick IsRequireConsecutive = true: `inputCheckbox(page.locator('input[name="IsRequireConsecutive"]'), true, 'Yêu cầu ngày liên tục')`
5. Verify `page.locator('input[name="MaxConsecutiveDaysPerMonth"]')` visible và có thể nhập

**Kết quả mong đợi**:
- Khi IsRequireConsecutive = false: MaxConsecutiveDaysPerMonth ẩn hoặc disabled
- Khi IsRequireConsecutive = true: MaxConsecutiveDaysPerMonth hiển thị và có thể nhập số

**Kết quả thực tế**: ✅ PASSED
**Chạy lúc**: 2026-06-10T11:18:00Z | Playwright 1.60.0

---

## TC-004 — Validation BS-01: IsRequireConsecutive=true + MaxConsecutiveDaysPerMonth rỗng → block

**Mục tiêu**: Form validate khi tick "Yêu cầu ngày liên tục" mà để trống "Số ngày tối đa/tháng"
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Hard block với message text đã xác định rõ trong spec BS-01
**Nhóm**: BS-01 Admin cấu hình

**Tiền điều kiện**:
- Đăng nhập Admin

**Bước thực hiện**:
// Page Object: CatLeaveDayTypePage
1. Gọi `catPage.goto()`
2. Gọi `catPage.openCreateForm()`
3. Gọi `catPage.fillForm({ loaiNgayNghi: '{datafake.menstrual.ten_loai_test}', ma: '{datafake.menstrual.ma_loai_test}' })`
4. Tick IsRequireConsecutive = true: `inputCheckbox(page.locator('input[name="IsRequireConsecutive"]'), true, 'Yêu cầu ngày liên tục')`
5. Để trống MaxConsecutiveDaysPerMonth (không nhập)
6. Gọi `catPage.submitForm()`

**Kết quả mong đợi**:
- Popup / toast lỗi xuất hiện
- Message: "Vui lòng nhập số ngày tối đa/tháng"
- Record không được tạo

---

## TC-005 — Default values khi tạo mới Cat_LeaveDayType

**Mục tiêu**: 3 field mới có default value đúng theo spec (ApplyGender=All, IsRequireConsecutive=false, MaxConsecutiveDaysPerMonth=null)
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Verify default state của DOM elements khi form vừa mở
**Nhóm**: BS-01 Admin cấu hình

**Tiền điều kiện**:
- Đăng nhập Admin

**Bước thực hiện**:
// Page Object: CatLeaveDayTypePage
1. Gọi `catPage.goto()`
2. Gọi `catPage.openCreateForm()`
3. Verify ApplyGender default = "Tất cả" (All)
4. Verify IsRequireConsecutive default = unchecked (0)
5. Verify MaxConsecutiveDaysPerMonth default = rỗng / null

**Kết quả mong đợi**:
- ApplyGender dropdown = "Tất cả" (giá trị default 'All')
- IsRequireConsecutive checkbox = unchecked
- MaxConsecutiveDaysPerMonth = trống

**Kết quả thực tế**: ✅ PASSED
**Chạy lúc**: 2026-06-10T11:18:00Z | Playwright 1.60.0

---

## TC-006 — BS-02 Rule 1: NV nữ đăng ký loại ApplyGender=Female → pass

**Mục tiêu**: Happy path — NV nữ tạo đơn nghỉ loại có ApplyGender=Female → không bị gender block
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Navigate → input → submit → verify toast, tất cả qua DOM
**Nhóm**: BS-02 Rule 1 Gender Filter

**Tiền điều kiện**:
- Đăng nhập tài khoản NV nữ (Gender = E_FEMALE)
- Tồn tại loại nghỉ `{datafake.menstrual.ten_loai}` với ApplyGender = Female

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}', lyDo: '{datafake.menstrual.ly_do}' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- Đơn xuất hiện trong grid với trạng thái "Chờ duyệt"
- Không có error message về gender

---

## TC-007 — BS-02 Rule 1: NV nam đăng ký loại ApplyGender=Female → hard block

**Mục tiêu**: NV nam bypass UI dropdown → submit loại Female → system reject (Rule 1 Gender check)
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Hard block với message text đã xác định rõ trong spec BS-02
**Nhóm**: BS-02 Rule 1 Gender Filter

**Tiền điều kiện**:
- Đăng nhập tài khoản NV nam (Gender ≠ E_FEMALE)

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. `inputCombobox(leaveDayPage.loc.formLoaiNgayNghi, '{datafake.menstrual.ten_loai}', 'Loại ngày nghỉ')` — type trực tiếp vào combobox
4. `inputTextbox(leaveDayPage.loc.formNgayBatDau, '{datafake.dates.ngay_hop_le_1}', 'Ngày bắt đầu')`
5. `inputTextbox(leaveDayPage.loc.formNgayKetThuc, '{datafake.dates.ngay_hop_le_1}', 'Ngày kết thúc')`
6. Gọi `leaveDayPage.submitForm()`

**Kết quả mong đợi**:
- Popup / toast lỗi xuất hiện
- Message: "Loại ngày nghỉ {datafake.menstrual.ten_loai} chỉ áp dụng cho nhân viên nữ"
- Đơn không được tạo

---

## TC-008 — BS-02 Rule 1: Đăng ký loại ApplyGender=All → không check gender, pass với mọi NV

**Mục tiêu**: Loại nghỉ ApplyGender=All không block dù NV nam hay nữ
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Submit loại All với NV nam → verify pass (không có gender block), qua DOM
**Nhóm**: BS-02 Rule 1 Gender Filter

**Tiền điều kiện**:
- Đăng nhập tài khoản NV nam
- Tồn tại loại nghỉ `{datafake.all_gender.ten_loai}` với ApplyGender = All, IsRequireConsecutive = false

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.all_gender.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}', lyDo: 'Test ApplyGender=All' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công" — không có gender block
- ApplyGender = All → skip gender check hoàn toàn

---

## TC-009 — BS-02 Rule 1: BPNS đăng ký hộ NV nữ loại Female → pass

**Mục tiêu**: ATT03.02 (BPNS đăng ký hộ) check giới tính NV được chọn — NV nữ → pass
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Web Main có URL test, BPNS flow tất cả qua DOM
**Nhóm**: BS-02 Rule 1 Gender Filter

**Tiền điều kiện**:
- Đăng nhập account BPNS (`{datafake.employee_bpns.name}`)
- Tồn tại NV nữ `{datafake.employee_nu.name}` trong hệ thống

**Bước thực hiện**:
// Page Object: AttLeaveDayPage (Web Main)
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. `inputCombobox(leaveDayPage.loc.formNhanVien, '{datafake.employee_nu.name}', 'Nhân viên')` — chọn NV nữ
4. Gọi `leaveDayPage.fillCreateForm({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}' })`
5. Gọi `leaveDayPage.submitForm()`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- BPNS đăng ký hộ NV nữ — check giới tính NV được chọn → pass

---

## TC-010 — BS-02 Rule 1: BPNS đăng ký hộ NV nam loại Female → hard block

**Mục tiêu**: ATT03.02 — check giới tính NV được chọn (không phải giới tính BPNS) — NV nam → block
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Hard block với message text đã biết, URL testable trên Web Main
**Nhóm**: BS-02 Rule 1 Gender Filter

**Tiền điều kiện**:
- Đăng nhập BPNS
- Tồn tại NV nam `{datafake.employee_nam.name}` trong hệ thống

**Bước thực hiện**:
// Page Object: AttLeaveDayPage (Web Main)
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. `inputCombobox(leaveDayPage.loc.formNhanVien, '{datafake.employee_nam.name}', 'Nhân viên')` — chọn NV nam
4. `inputCombobox(leaveDayPage.loc.formLoaiNgayNghi, '{datafake.menstrual.ten_loai}', 'Loại ngày nghỉ')`
5. `inputTextbox(leaveDayPage.loc.formNgayBatDau, '{datafake.dates.ngay_hop_le_1}', 'Ngày bắt đầu')`
6. `inputTextbox(leaveDayPage.loc.formNgayKetThuc, '{datafake.dates.ngay_hop_le_1}', 'Ngày kết thúc')`
7. Gọi `leaveDayPage.submitForm()`

**Kết quả mong đợi**:
- Hard block: "Loại ngày nghỉ {datafake.menstrual.ten_loai} chỉ áp dụng cho nhân viên nữ"
- Đơn không được tạo (check giới tính NV được chọn, không phải giới tính BPNS)

---

## TC-011 — BS-02 Rule 2: Lần đầu đăng ký trong tháng (LastApprovedDate = null) → luôn pass

**Mục tiêu**: Khi chưa có đơn E_APPROVED nào cùng loại trong tháng → consecutive check skip
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Tiền điều kiện đơn giản (NV chưa có đơn), tất cả qua DOM
**Nhóm**: BS-02 Rule 2 Consecutive Days

**Tiền điều kiện**:
- Đăng nhập NV nữ
- Loại nghỉ `{datafake.menstrual.ten_loai}` có IsRequireConsecutive = true
- NV chưa có đơn E_APPROVED nào loại đó trong tháng `{datafake.month}`

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}', lyDo: '{datafake.menstrual.ly_do}' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- LastApprovedDate = null (không có đơn trước) → consecutive check auto-pass
- Đơn xuất hiện với trạng thái "Chờ duyệt"

---

## TC-012 — BS-02 Rule 2: Ngày đăng ký = LastApprovedDate + 1 → pass (liên tiếp hợp lệ)

**Mục tiêu**: Ngày bắt đầu đơn mới = ngày kết thúc đơn đã duyệt + 1 → consecutive hợp lệ
**Priority**: P1
**Loại**: 🖐 Manual
**Lý do loại**: Manual: cần đơn E_APPROVED với DateEnd biết trước sẵn trong DB — phải có CD duyệt trước khi chạy test
**Nhóm**: BS-02 Rule 2 Consecutive Days

**Tiền điều kiện**:
- Đăng nhập NV nữ
- [Setup thủ công] Đã có đơn E_APPROVED với DateStart={datafake.dates.approved_start}, DateEnd={datafake.dates.approved_end} (ví dụ: 02/06–04/06)
- IsRequireConsecutive = true

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.approved_end_plus_1}', ngayKetThuc: '{datafake.dates.approved_end_plus_1}', lyDo: '{datafake.menstrual.ly_do}' })`
   — approved_end_plus_1 = ngày kế tiếp sau approved_end (ví dụ: 05/06/2026)

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- ngayBatDau = LastApprovedDate + 1 → consecutive check pass
- Không có error message

---

## TC-013 — BS-02 Rule 2: Ngày đăng ký ≠ LastApprovedDate + 1 (tạo gap) → hard block

**Mục tiêu**: Ngày đăng ký tạo gap với đơn đã duyệt → hệ thống block và báo đúng ngày cần đăng ký
**Priority**: P1
**Loại**: 🖐 Manual
**Lý do loại**: Manual: cần đơn E_APPROVED sẵn trong DB để xác định LastApprovedDate (phải có CD duyệt trước)
**Nhóm**: BS-02 Rule 2 Consecutive Days

**Tiền điều kiện**:
- Đăng nhập NV nữ
- [Setup thủ công] Đã có đơn E_APPROVED: DateEnd = {datafake.dates.approved_end} (ví dụ: 04/06)
- IsRequireConsecutive = true

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. Gọi `leaveDayPage.fillCreateForm({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.gap_date}', ngayKetThuc: '{datafake.dates.gap_date}' })`
   — gap_date = ngày có gap (ví dụ: 06/06, bỏ qua 05/06 = LastApprovedDate+1)
4. Gọi `leaveDayPage.submitForm()`

**Kết quả mong đợi**:
- Hard block: "Ngày đăng ký phải là {datafake.dates.approved_end_plus_1}. Các ngày nghỉ {datafake.menstrual.ten_loai} phải liên tiếp nhau."
- Đơn không được tạo

---

## TC-014 — BS-02 Rule 2: IsRequireConsecutive = false → không validate consecutive

**Mục tiêu**: Loại nghỉ có IsRequireConsecutive=false → skip consecutive check, tự do đăng ký bất kỳ ngày
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: loại không có flag → submit bất kỳ ngày → verify pass, qua DOM
**Nhóm**: BS-02 Rule 2 Consecutive Days

**Tiền điều kiện**:
- Đăng nhập NV
- Loại nghỉ `{datafake.all_gender.ten_loai}` có IsRequireConsecutive = false

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.all_gender.ten_loai}', ngayBatDau: '{datafake.dates.ngay_bat_ky}', ngayKetThuc: '{datafake.dates.ngay_bat_ky}', lyDo: 'Test skip consecutive' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- IsRequireConsecutive = false → consecutive check bị skip hoàn toàn

---

## TC-015 — BS-02 Rule 2: Đơn E_CANCEL không tính vào LastApprovedDate

**Mục tiêu**: Đơn Hủy không ảnh hưởng LastApprovedDate → consecutive tính từ đơn E_APPROVED gần nhất
**Priority**: P1
**Loại**: 🖐 Manual
**Lý do loại**: Manual: cần tạo đơn rồi hủy + đơn approved trước đó — flow cancel yêu cầu CD; khó setup đủ điều kiện qua UI
**Nhóm**: BS-02 Rule 2 Consecutive Days

**Tiền điều kiện**:
- Đăng nhập NV nữ
- [Setup thủ công] Đơn E_APPROVED: DateEnd = 04/06 (LastApprovedDate = 04/06)
- [Setup thủ công] Đơn E_CANCEL: DateEnd = 08/06 (bị hủy, không tính)
- IsRequireConsecutive = true

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '05/06/2026', ngayKetThuc: '05/06/2026', lyDo: 'Test E_CANCEL không tính LastApprovedDate' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- Hệ thống lấy LastApprovedDate = 04/06 (đơn E_APPROVED gần nhất)
- Đơn E_CANCEL (DateEnd 08/06) không làm LastApprovedDate = 08/06
- 05/06 = 04/06 + 1 → consecutive pass

---

## TC-016 — BS-02 Rule 3: ApprovedCount < MaxConsecutiveDaysPerMonth → pass

**Mục tiêu**: Lần đầu đăng ký loại có MaxConsecutiveDaysPerMonth=3 → count=0 < 3 → pass
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: NV chưa có đơn nào → count=0 < max → create → verify toast
**Nhóm**: BS-02 Rule 3 Monthly Limit

**Tiền điều kiện**:
- Đăng nhập NV nữ
- Loại nghỉ `{datafake.menstrual.ten_loai}` có IsRequireConsecutive = true, MaxConsecutiveDaysPerMonth = 3
- NV chưa có đơn E_APPROVED nào cùng loại trong tháng

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}', lyDo: '{datafake.menstrual.ly_do}' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- ApprovedCount = 0 (chưa có approved) < MaxConsecutiveDaysPerMonth(3) → pass

---

## TC-017 — BS-02 Rule 3: ApprovedCount >= MaxConsecutiveDaysPerMonth → hard block

**Mục tiêu**: NV đã dùng đủ quota ngày/tháng → cố đăng ký thêm → hard block với message tháng
**Priority**: P1
**Loại**: 🖐 Manual
**Lý do loại**: Manual: cần ApprovedCount = MaxConsecutiveDaysPerMonth sẵn trong DB — phải có CD duyệt đủ N ngày trước
**Nhóm**: BS-02 Rule 3 Monthly Limit

**Tiền điều kiện**:
- Đăng nhập NV nữ
- [Setup thủ công] NV đã có đúng {datafake.menstrual.max_ngay_thang} ngày E_APPROVED cùng loại trong tháng {datafake.month}
- MaxConsecutiveDaysPerMonth = {datafake.menstrual.max_ngay_thang}

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. Gọi `leaveDayPage.fillCreateForm({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_tiep_theo}', ngayKetThuc: '{datafake.dates.ngay_tiep_theo}' })`
4. Gọi `leaveDayPage.submitForm()`

**Kết quả mong đợi**:
- Hard block: "Bạn đã đăng ký đủ {datafake.menstrual.max_ngay_thang} ngày {datafake.menstrual.ten_loai} trong tháng {datafake.month}."
- Đơn không được tạo

---

## TC-018 — BS-02 Rule 3: MaxConsecutiveDaysPerMonth = null → không validate monthly limit

**Mục tiêu**: IsRequireConsecutive=true nhưng MaxConsecutiveDaysPerMonth=null → Rule 3 bị skip
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: loại không có MaxConsecutiveDaysPerMonth → submit → verify pass, qua DOM
**Nhóm**: BS-02 Rule 3 Monthly Limit

**Tiền điều kiện**:
- Đăng nhập NV nữ
- Tồn tại loại nghỉ `{datafake.consecutive_no_limit.ten_loai}` có IsRequireConsecutive=true, MaxConsecutiveDaysPerMonth=null, ApplyGender=Female
- NV chưa có đơn cùng loại trong tháng

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.consecutive_no_limit.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}', lyDo: 'Test MaxConsecutiveDaysPerMonth null' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- MaxConsecutiveDaysPerMonth = null → Rule 3 skip, không check monthly limit

---

## TC-019 — BS-02 Rule 3: Đơn E_CANCEL / E_REJECT không tính vào ApprovedCount

**Mục tiêu**: Chỉ đơn E_APPROVED đếm vào ApprovedCount — đơn Hủy/Từ chối không làm quota tăng
**Priority**: P1
**Loại**: 🖐 Manual
**Lý do loại**: Manual: cần đơn E_CANCEL + E_REJECT sẵn trong DB — đòi hỏi flow hủy và reject qua nhiều bước/roles
**Nhóm**: BS-02 Rule 3 Monthly Limit

**Tiền điều kiện**:
- Đăng nhập NV nữ
- [Setup thủ công] MaxConsecutiveDaysPerMonth = 3; NV có 1 đơn E_APPROVED, 1 đơn E_CANCEL, 1 đơn E_REJECT cùng loại tháng này
- ApprovedCount thực tế = 1 (chỉ tính E_APPROVED)

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_tiep_theo}', ngayKetThuc: '{datafake.dates.ngay_tiep_theo}', lyDo: 'Test E_CANCEL/REJECT không đếm' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- ApprovedCount = 1 (E_CANCEL + E_REJECT không tính) < MaxConsecutiveDaysPerMonth(3) → pass
- Đơn mới xuất hiện với trạng thái "Chờ duyệt"

---

## TC-020 — BS-03: NV nữ → dropdown Loại ngày nghỉ có cả ApplyGender=Female và All

**Mục tiêu**: Portal/Web Main — dropdown loại nghỉ hiển thị cả loại Female và loại All khi NV là nữ
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: verify DOM — kiểm tra option trong combobox dropdown sau khi mở form
**Nhóm**: BS-03 Filter dropdown

**Tiền điều kiện**:
- Đăng nhập NV nữ (Gender = E_FEMALE)
- Tồn tại: loại `{datafake.menstrual.ten_loai}` (ApplyGender=Female) và loại `{datafake.all_gender.ten_loai}` (ApplyGender=All)

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. Click vào `leaveDayPage.loc.formLoaiNgayNghi` để mở dropdown
4. Lấy toàn bộ danh sách option trong dropdown list
5. Kiểm tra option `{datafake.menstrual.ten_loai}` tồn tại
6. Kiểm tra option `{datafake.all_gender.ten_loai}` tồn tại

**Kết quả mong đợi**:
- Dropdown chứa `{datafake.menstrual.ten_loai}` (ApplyGender=Female — visible với NV nữ)
- Dropdown chứa `{datafake.all_gender.ten_loai}` (ApplyGender=All — visible với tất cả)

---

## TC-021 — BS-03: NV nam → dropdown KHÔNG chứa loại ApplyGender=Female

**Mục tiêu**: NV nam không thấy loại nghỉ ApplyGender=Female trong dropdown
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: verify DOM — option không xuất hiện trong combobox list
**Nhóm**: BS-03 Filter dropdown

**Tiền điều kiện**:
- Đăng nhập NV nam (Gender ≠ E_FEMALE)

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. Click vào `leaveDayPage.loc.formLoaiNgayNghi` để mở dropdown
4. Tìm kiếm option `{datafake.menstrual.ten_loai}` trong danh sách

**Kết quả mong đợi**:
- Dropdown KHÔNG chứa `{datafake.menstrual.ten_loai}` (ApplyGender=Female bị filter ra)
- Dropdown vẫn chứa các loại ApplyGender=All

---

## TC-022 — BS-03: BPNS chọn NV nữ → dropdown reload có loại ApplyGender=Female

**Mục tiêu**: Web Main (ATT03.02) — sau khi BPNS chọn NV nữ, dropdown loại nghỉ include loại Female
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: BPNS Web Main URL testable, verify DOM sau khi trigger change NV
**Nhóm**: BS-03 Filter dropdown

**Tiền điều kiện**:
- Đăng nhập BPNS
- Tồn tại NV nữ `{datafake.employee_nu.name}`

**Bước thực hiện**:
// Page Object: AttLeaveDayPage (Web Main)
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. `inputCombobox(leaveDayPage.loc.formNhanVien, '{datafake.employee_nu.name}', 'Nhân viên')` — chọn NV nữ
4. Chờ dropdown reload (wait for network/DOM update)
5. Click vào `leaveDayPage.loc.formLoaiNgayNghi` → verify options

**Kết quả mong đợi**:
- Sau khi chọn NV nữ, dropdown loại nghỉ chứa `{datafake.menstrual.ten_loai}`
- Filter theo giới tính NV được chọn (không phải giới tính BPNS)

---

## TC-023 — BS-03: BPNS chọn NV nam → dropdown reload KHÔNG có loại ApplyGender=Female

**Mục tiêu**: Web Main (ATT03.02) — sau khi BPNS chọn NV nam, dropdown loại nghỉ không có loại Female
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Auto: BPNS Web Main URL testable, verify DOM absence
**Nhóm**: BS-03 Filter dropdown

**Tiền điều kiện**:
- Đăng nhập BPNS
- Tồn tại NV nam `{datafake.employee_nam.name}`

**Bước thực hiện**:
// Page Object: AttLeaveDayPage (Web Main)
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.openCreateForm()`
3. `inputCombobox(leaveDayPage.loc.formNhanVien, '{datafake.employee_nam.name}', 'Nhân viên')` — chọn NV nam
4. Chờ dropdown reload
5. Click vào `leaveDayPage.loc.formLoaiNgayNghi` → verify options

**Kết quả mong đợi**:
- Sau khi chọn NV nam, dropdown loại nghỉ KHÔNG chứa `{datafake.menstrual.ten_loai}`
- Chỉ có các loại ApplyGender=All

---

## TC-024 — Edge case: Monthly reset — tháng mới reset ApprovedCount về 0

**Mục tiêu**: ApprovedCount filter theo tháng dương lịch — tháng mới NV có thể đăng ký lại dù tháng trước đã đủ quota
**Priority**: P2
**Loại**: 🖐 Manual
**Lý do loại**: Manual: cần đơn tháng trước có ApprovedCount = max sẵn trong DB — cross-month scenario không thể simulate qua UI trong cùng tháng hiện tại
**Nhóm**: Edge case

**Tiền điều kiện**:
- Đăng nhập NV nữ
- [Setup thủ công] Tháng 5/2026: NV đã có đủ MaxConsecutiveDaysPerMonth ngày E_APPROVED cùng loại
- Thực hiện test vào tháng 6/2026 (tháng mới)

**Bước thực hiện**:
// Page Object: AttLeaveDayPage
1. Gọi `leaveDayPage.goto()`
2. Gọi `leaveDayPage.createRecord({ loaiNgayNghi: '{datafake.menstrual.ten_loai}', ngayBatDau: '{datafake.dates.ngay_hop_le_1}', ngayKetThuc: '{datafake.dates.ngay_hop_le_1}', lyDo: '{datafake.menstrual.ly_do}' })`

**Kết quả mong đợi**:
- Toast: "Lưu thành công"
- ApprovedCount filter theo tháng DL → tháng mới = 0 < MaxConsecutiveDaysPerMonth → pass
- Tháng cũ quota không carry over sang tháng mới

---

## TC-025 — Verify record kinh nguyệt trong Cat_LeaveDayType sau khi Admin cấu hình

**Mục tiêu**: Verify form Edit record kinh nguyệt hiển thị đúng tất cả 3 field mới sau khi tạo
**Priority**: P1
**Loại**: ✅ Auto
**Lý do loại**: Navigate → mở form Edit → verify field values, tất cả qua DOM
**Nhóm**: Edge case

**Tiền điều kiện**:
- Đã tạo xong record `{datafake.menstrual.ten_loai}` (từ TC-002)
- Đăng nhập Admin

**Bước thực hiện**:
// Page Object: CatLeaveDayTypePage
1. Gọi `catPage.goto()`
2. Tìm dòng `{datafake.menstrual.ten_loai}` trong grid → click mở form Edit
3. Verify ApplyGender = "Nữ" (Female)
4. Verify IsRequireConsecutive = checked
5. Verify MaxConsecutiveDaysPerMonth = `{datafake.menstrual.max_ngay_thang}`
6. Verify IsMenses = checked (`catPage.loc.quyPhepNghiDinh85`)

**Kết quả mong đợi**:
- Form Edit hiển thị đúng: ApplyGender = "Nữ", IsRequireConsecutive = checked, MaxConsecutiveDaysPerMonth = {datafake.menstrual.max_ngay_thang}
- IsMenses / quyPhepNghiDinh85 = checked
- Không có thay đổi nào so với lúc lưu (TC-002)

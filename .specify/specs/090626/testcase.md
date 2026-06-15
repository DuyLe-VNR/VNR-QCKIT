# Testcase — 090626 — Phép kinh nguyệt (Menstrual Leave)

> **Tính năng:** Thêm loại ngày nghỉ kinh nguyệt — Gender filter, Consecutive days, Monthly limit  
> **Group:** CAT + ATT  
> **Alias:** `cat_leave_day_type` (Admin), `att_leave_day` (Đăng ký)  
> **Nguồn PBI:** 090626  
> **Ngày tạo:** 2026-06-12  
> **Môi trường:** local — https://long-main.vnrlocal.com  
> **Tổng TC:** 17 · **Automation:** 10 · **Manual:** 7 · **Pass:** 2 · **Fail:** 2 · **Skipped:** 7

---

## 1. Phạm Vi Kiểm Thử

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Kiểm thử toàn bộ thay đổi của PBI 090626: (1) Admin tạo/cấu hình loại ngày nghỉ KN với 3 field mới, (2) Validate 3 rule khi NV/BPNS đăng ký ngày nghỉ KN |
| Trong phạm vi | BS-01: form Cat_LeaveDayType thêm 3 field mới; BS-02: validate gender / consecutive / monthly limit tại Att_LeaveDay (Web Main); BS-03: filter dropdown loại nghỉ theo giới tính |
| Ngoài phạm vi | Portal/App ATT03.01 (NV tự đăng ký qua portal); Email notification; Duyệt ngày nghỉ |
| Điều kiện bắt đầu | DB đã migrate script 20260611_01.sql; Có NV nữ và NV nam trong hệ thống; Có loại ngày nghỉ KN đã tạo với IsMenses=1, ApplyGender=Female, IsRequireConsecutive=1, MaxConsecutiveDaysPerMonth=3 |
| Điều kiện kết thúc | Tất cả TC Auto PASS; TC Manual được QC verify thủ công |
| Tài liệu tham chiếu | `.specify/specs/090626/spec.md`, `userflow-cat.md`, `userflow-att.md` |

---

## 2. Tiền Điều Kiện Chung

- User Admin có quyền vào `Cat_LeaveDayType`
- User BPNS/HR có quyền vào `Att_LeaveDay` để đăng ký hộ
- NV nữ test: `{datafake.nv_nu_code}` — `{datafake.nv_nu_name}`
- NV nam test: `{datafake.nv_nam_code}` — `{datafake.nv_nam_name}`
- Loại ngày nghỉ KN đã được tạo: `{datafake.ten_loai_kn}` (`{datafake.ma_loai_kn}`)
- Trạng thái hệ thống trước khi test: tháng test chưa có đơn KN nào được duyệt (E_APPROVED) cho NV nữ test

---

## 3. Test Data Chung

| Nhóm dữ liệu | Field | Giá trị mẫu | Ghi chú |
| --- | --- | --- | --- |
| Loại ngày nghỉ KN | LeaveDayTypeName | `Nghỉ kinh nguyệt` | |
| Loại ngày nghỉ KN | Code | `KN` | |
| Loại ngày nghỉ KN | IsMenses | `1` | checkbox bật |
| Loại ngày nghỉ KN | ApplyGender | `Female` | dropdown Nữ |
| Loại ngày nghỉ KN | IsRequireConsecutive | `1` | checkbox bật |
| Loại ngày nghỉ KN | MaxConsecutiveDaysPerMonth | `3` | số ngày tối đa/tháng |
| Loại ngày nghỉ KN | MaxPerTimes | `1` | số ngày/lần |
| NV nữ test | Code | `NV001` | Giới tính: Nữ |
| NV nữ test | Name | `Nguyễn Thị A` | |
| NV nam test | Code | `NV002` | Giới tính: Nam |
| NV nam test | Name | `Trần Văn B` | |
| Ngày nghỉ 1 | DateStart | `01/07/2026` | ngày hợp lệ đầu tiên trong tháng |
| Ngày nghỉ 2 | DateStart | `02/07/2026` | ngày liên tiếp hợp lệ |
| Ngày nghỉ lỗi | DateStart | `05/07/2026` | ngày KHÔNG liên tiếp (sau ngày 1/7 đã duyệt) |

---

## 4. Mục Lục Testcase

| TC ID | Tên testcase | Loại | Auto/Manual | Độ ưu tiên | ⭐ | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| [090626_CAT_CATLEAVEDAY_001](#tc-001) | Tạo loại ngày nghỉ KN với 3 field mới — happy path | Happy Path | Automation | Critical | | ❌ FAILED |
| [090626_CAT_CATLEAVEDAY_002](#tc-002) | Validate: IsRequireConsecutive=true bỏ trống MaxConsecutiveDaysPerMonth | Validation | Automation | High | | ❌ FAILED |
| [090626_CAT_CATLEAVEDAY_003](#tc-003) | Tạo loại ngày nghỉ thường (ApplyGender=All, IsRequireConsecutive=false) | Happy Path | Automation | High | | ✅ PASSED |
| [090626_CAT_CATLEAVEDAY_004](#tc-004) | Hiển thị MaxConsecutiveDaysPerMonth chỉ khi tick IsRequireConsecutive | UI Behavior | Automation | Medium | | ✅ PASSED |
| [090626_ATT_LEAVEDAY_001](#tc-005) | NV nữ đăng ký ngày nghỉ KN lần đầu tháng — PASS | Happy Path | Automation | Critical | | ⏭ SKIPPED |
| [090626_ATT_LEAVEDAY_002](#tc-006) | NV nữ đăng ký ngày KN liên tiếp (ngày 2) — PASS | Happy Path | Automation | Critical | | ⏭ SKIPPED |
| [090626_ATT_LEAVEDAY_003](#tc-007) | NV nam đăng ký loại nghỉ ApplyGender=Female — FAIL Rule 1 | Validation | Automation | Critical | | ⏭ SKIPPED |
| [090626_ATT_LEAVEDAY_004](#tc-008) | NV nữ đăng ký ngày KN không liên tiếp — FAIL Rule 2 | Validation | Automation | Critical | | ⏭ SKIPPED |
| [090626_ATT_LEAVEDAY_005](#tc-009) | NV nữ đăng ký vượt MaxConsecutiveDaysPerMonth — FAIL Rule 3 | Validation | Automation | Critical | | ⏭ SKIPPED |
| [090626_ATT_LEAVEDAY_006](#tc-010) | NV nữ đăng ký KN tháng mới (reset counter) — PASS | Business Rule | Automation | High | | ⏭ SKIPPED |
| [090626_ATT_LEAVEDAY_007](#tc-011) | Dropdown loại nghỉ ẩn loại Female khi chọn NV nam — BS-03 | Business Rule | Manual | High | | Chưa test |
| [090626_ATT_LEAVEDAY_008](#tc-012) | Đơn E_CANCEL không tính vào ApprovedCount | Business Rule | Manual | High | | Chưa test |
| [090626_ATT_LEAVEDAY_009](#tc-013) | Đơn E_REJECT không tính vào LastApprovedDate | Business Rule | Manual | High | | Chưa test |
| [090626_ATT_LEAVEDAY_010](#tc-014) | BPNS đăng ký hộ NV nữ — ATT03.02 bypass workflow nhưng vẫn validate | Business Rule | Manual | High | | Chưa test |
| [090626_ATT_LEAVEDAY_011](#tc-015) | BPNS đăng ký hộ NV nam với loại KN — FAIL Rule 1 ATT03.02 | Validation | Manual | High | | Chưa test |
| [090626_ATT_LEAVEDAY_012](#tc-016) | Loại nghỉ thường (ApplyGender=All) không bị chặn — Regression | Regression | Automation | Medium | | ⏭ SKIPPED |
| [090626_CAT_CATLEAVEDAY_005](#tc-017) | Sửa loại ngày nghỉ KN — thay đổi MaxConsecutiveDaysPerMonth | Happy Path | Manual | Medium | | Chưa test |

---

<a id="tc-001"></a>
## 090626_CAT_CATLEAVEDAY_001

**Tên:** Tạo loại ngày nghỉ KN với 3 field mới — happy path  
**Loại:** Happy Path  
**Group:** CAT | **Alias:** `cat_leave_day_type` | **Tính năng:** CATLEAVEDAY  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  
**Người thực hiện:**  
**Ngày thực hiện:**

### Tiền Điều Kiện

- Đăng nhập Admin
- Màn hình `cat_leave_day_type` accessible

### Test Data

| Field | Giá trị |
| --- | --- |
| LeaveDayTypeName | `Nghỉ kinh nguyệt` |
| Code | `KN` |
| IsMenses (Quỹ phép NĐ85) | `true` (bật) |
| ApplyGender | `Female` (Nữ) |
| IsRequireConsecutive | `true` (bật) |
| MaxConsecutiveDaysPerMonth | `3` |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở màn hình `cat_leave_day_type` |  | Màn hình DS Loại ngày nghỉ hiển thị |
| 2 | Click nút `Tạo mới` |  | Navigate sang /Cat_LeaveDayType/Create |
| 3 | Nhập `Loại ngày nghỉ` | `Nghỉ kinh nguyệt` | Field được điền |
| 4 | Nhập `Mã` | `KN` | Field được điền |
| 5 | Bật checkbox `Quỹ phép nghị định 85` (IsMenses) |  | Checkbox được tick |
| 6 | Chọn dropdown `Giới tính áp dụng` | `Female` | Dropdown hiển thị Nữ |
| 7 | Bật checkbox `Yêu cầu ngày liên tục` (IsRequireConsecutive) |  | Checkbox tick; field `Số ngày tối đa/tháng` hiển thị |
| 8 | Nhập `Số ngày tối đa/tháng` | `3` | Field được điền |
| 9 | Click `Lưu` |  | Toast: *"Lưu thành công"* → redirect danh sách |
| 10 | Kiểm tra record mới | Code=KN | Record `Nghỉ kinh nguyệt` xuất hiện trong grid |

### Kết Quả Thực Tế

*(chưa chạy)*

### Bằng Chứng

| Loại | Đường dẫn/Ghi chú |
| --- | --- |
| Screenshot |  |

### Ghi Chú

- 3 fields mới (ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth) là **field mới theo BS-01**, chưa có trong component_cat_leave_day_type.md → cần update Locator sau deploy

---

<a id="tc-002"></a>
## 090626_CAT_CATLEAVEDAY_002

**Tên:** Validate: IsRequireConsecutive=true bỏ trống MaxConsecutiveDaysPerMonth  
**Loại:** Validation  
**Group:** CAT | **Alias:** `cat_leave_day_type` | **Tính năng:** CATLEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- Đăng nhập Admin, vào /Cat_LeaveDayType/Create

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở màn hình /Cat_LeaveDayType/Create |  | Form hiển thị |
| 2 | Nhập Loại ngày nghỉ, Mã | `Test KN`, `TKNTEST` | Fields điền |
| 3 | Bật checkbox `IsRequireConsecutive` |  | Field `MaxConsecutiveDaysPerMonth` hiển thị |
| 4 | **Để trống** `MaxConsecutiveDaysPerMonth` | *(bỏ trống)* | |
| 5 | Click `Lưu` |  | Hệ thống KHÔNG lưu; Hiển thị: *"Vui lòng nhập số ngày tối đa/tháng"* |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-003"></a>
## 090626_CAT_CATLEAVEDAY_003

**Tên:** Tạo loại ngày nghỉ thường (ApplyGender=All, IsRequireConsecutive=false)  
**Loại:** Happy Path  
**Group:** CAT | **Alias:** `cat_leave_day_type` | **Tính năng:** CATLEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- Đăng nhập Admin

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở /Cat_LeaveDayType/Create |  | Form hiển thị |
| 2 | Nhập tên, mã | `Nghỉ phép thường`, `NPT` | Fields điền |
| 3 | Giữ `ApplyGender` = mặc định | `All` (Tất cả) | Dropdown hiển thị Tất cả |
| 4 | **Không** bật `IsRequireConsecutive` |  | Checkbox không tick; MaxConsecutiveDaysPerMonth ẩn |
| 5 | Click `Lưu` |  | Toast: *"Lưu thành công"* |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-004"></a>
## 090626_CAT_CATLEAVEDAY_004

**Tên:** Hiển thị MaxConsecutiveDaysPerMonth chỉ khi tick IsRequireConsecutive  
**Loại:** UI Behavior  
**Group:** CAT | **Alias:** `cat_leave_day_type` | **Tính năng:** CATLEAVEDAY  
**Độ ưu tiên:** Medium  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- Đăng nhập Admin, vào /Cat_LeaveDayType/Create

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở form Create |  | Field `MaxConsecutiveDaysPerMonth` **ẩn** |
| 2 | Bật checkbox `IsRequireConsecutive` |  | Field `MaxConsecutiveDaysPerMonth` **hiện** |
| 3 | Tắt checkbox `IsRequireConsecutive` |  | Field `MaxConsecutiveDaysPerMonth` **ẩn lại** |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- Verify bằng `isVisible()` trong Playwright

---

<a id="tc-005"></a>
## 090626_ATT_LEAVEDAY_001

**Tên:** NV nữ đăng ký ngày nghỉ KN lần đầu tháng — PASS (Rule 2: LastApprovedDate=null)  
**Loại:** Happy Path  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- Đăng nhập BPNS/HR
- Tháng 07/2026: NV nữ NV001 chưa có đơn KN E_APPROVED nào

### Test Data

| Field | Giá trị |
| --- | --- |
| Nhân viên | `NV001 — Nguyễn Thị A` (Nữ) |
| Loại ngày nghỉ | `Nghỉ kinh nguyệt (KN)` |
| Ngày bắt đầu | `01/07/2026` |
| Người duyệt đầu | *per datafake* |
| Người duyệt cuối | *per datafake* |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `att_leave_day` |  | Màn hình DS Ngày nghỉ hiển thị |
| 2 | Click `Tạo mới` |  | Form inline mở |
| 3 | Chọn nhân viên | NV001 (Nữ) | NV được chọn |
| 4 | Chọn `Loại ngày nghỉ` | `Nghỉ kinh nguyệt (KN)` | Dropdown hiển thị loại KN (Female visible với NV nữ) |
| 5 | Chọn `Ngày bắt đầu` | `01/07/2026` | Ngày được chọn |
| 6 | Chọn người duyệt | *per datafake* | Người duyệt được chọn |
| 7 | Click `Lưu và đóng` |  | Toast: *"Lưu thành công"*; Đơn xuất hiện trong danh sách |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-006"></a>
## 090626_ATT_LEAVEDAY_002

**Tên:** NV nữ đăng ký ngày KN liên tiếp (ngày 2) — PASS (Rule 2 consecutive OK)  
**Loại:** Happy Path  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- TC-005 đã chạy: NV001 có đơn KN ngày 01/07/2026 E_APPROVED

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo mới đơn ngày nghỉ KN cho NV001 | Ngày: `02/07/2026` | |
| 2 | Điền đầy đủ field bắt buộc, click `Lưu và đóng` |  | Toast: *"Lưu thành công"* — 02/07 = 01/07+1 → Rule 2 PASS |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-007"></a>
## 090626_ATT_LEAVEDAY_003

**Tên:** NV nam đăng ký loại nghỉ ApplyGender=Female — FAIL Rule 1 (Gender filter)  
**Loại:** Validation  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- NV nam NV002 tồn tại trong hệ thống

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo mới đơn ngày nghỉ, chọn NV002 (Nam) |  | NV nam được chọn |
| 2 | Mở dropdown `Loại ngày nghỉ` và kiểm tra |  | Loại `Nghỉ kinh nguyệt (ApplyGender=Female)` **không xuất hiện** trong dropdown |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Auto:** Dropdown filter theo giới tính NV — verify qua DOM (option không có trong combobox list)
- Nếu system có API bypass: message *"Loại ngày nghỉ Nghỉ kinh nguyệt chỉ áp dụng cho nhân viên nữ"*

---

<a id="tc-008"></a>
## 090626_ATT_LEAVEDAY_004

**Tên:** NV nữ đăng ký ngày KN không liên tiếp — FAIL Rule 2 (Consecutive days)  
**Loại:** Validation  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- NV001 đã có đơn KN ngày 01/07/2026 E_APPROVED

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo mới đơn KN cho NV001 | Ngày: `05/07/2026` (nhảy cách ngày 01/07) | |
| 2 | Click `Lưu và đóng` |  | BLOCK; Message: *"Ngày đăng ký phải là 02/07/2026. Các ngày nghỉ Nghỉ kinh nguyệt phải liên tiếp nhau."* |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-009"></a>
## 090626_ATT_LEAVEDAY_005

**Tên:** NV nữ đăng ký vượt MaxConsecutiveDaysPerMonth=3 — FAIL Rule 3  
**Loại:** Validation  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- NV001 đã có 3 đơn KN E_APPROVED: ngày 01/07, 02/07, 03/07/2026 (= MaxConsecutiveDaysPerMonth)

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo mới đơn KN cho NV001 | Ngày: `04/07/2026` (liên tiếp hợp lệ nhưng vượt limit) | |
| 2 | Click `Lưu và đóng` |  | BLOCK; Message: *"Bạn đã đăng ký đủ 3 ngày Nghỉ kinh nguyệt trong tháng 07/2026."* |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- Data setup: cần 3 đơn E_APPROVED trước (TC-005, TC-006, + 1 đơn nữa)

---

<a id="tc-010"></a>
## 090626_ATT_LEAVEDAY_006

**Tên:** NV nữ đăng ký KN tháng mới — counter reset implicit theo tháng dương lịch — PASS  
**Loại:** Business Rule  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- NV001 đã đạt limit 3 đơn KN E_APPROVED trong tháng 07/2026

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo đơn KN cho NV001 | Ngày: `01/08/2026` (tháng 8 — tháng mới) | |
| 2 | Click `Lưu và đóng` |  | Toast: *"Lưu thành công"* — tháng 8 counter=0, Rule 3 PASS |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-011"></a>
## 090626_ATT_LEAVEDAY_007

**Tên:** Dropdown loại nghỉ ẩn loại Female khi chọn NV nam — BS-03 filter  
**Loại:** Business Rule  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual  

### Tiền Điều Kiện

- NV nam NV002 và NV nữ NV001 tồn tại

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở form tạo mới ngày nghỉ |  | |
| 2 | Chọn NV nam NV002 |  | Dropdown loại ngày nghỉ cập nhật |
| 3 | Mở dropdown `Loại ngày nghỉ` |  | Loại `Nghỉ kinh nguyệt (ApplyGender=Female)` **không xuất hiện** |
| 4 | Chuyển sang chọn NV nữ NV001 |  | Dropdown cập nhật |
| 5 | Mở lại dropdown `Loại ngày nghỉ` |  | Loại `Nghỉ kinh nguyệt` **xuất hiện** |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Manual:** Kendo combobox động — cần verify trực quan danh sách option; API call filter theo NV được chọn

---

<a id="tc-012"></a>
## 090626_ATT_LEAVEDAY_008

**Tên:** Đơn E_CANCEL không tính vào ApprovedCount (Rule 3)  
**Loại:** Business Rule  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual  

### Tiền Điều Kiện

- NV001 có 2 đơn KN E_APPROVED + 1 đơn KN E_CANCEL trong tháng 07/2026

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo đơn KN thứ 3 cho NV001 | Ngày liên tiếp hợp lệ | |
| 2 | Click `Lưu` |  | Toast: *"Lưu thành công"* — E_CANCEL không tính, ApprovedCount=2 < 3 → PASS |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Manual:** Cần setup trực tiếp đơn E_CANCEL trong DB trước test; luồng hủy đơn qua UI đòi hỏi nhiều bước phức tạp

---

<a id="tc-013"></a>
## 090626_ATT_LEAVEDAY_009

**Tên:** Đơn E_REJECT không tính vào LastApprovedDate (Rule 2)  
**Loại:** Business Rule  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual  

### Tiền Điều Kiện

- NV001: đơn KN ngày 01/07 E_APPROVED; đơn ngày 03/07 E_REJECT; đang đăng ký 02/07

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo đơn KN cho NV001 | Ngày: `02/07/2026` | |
| 2 | Click `Lưu` |  | Toast: *"Lưu thành công"* — LastApprovedDate=01/07 (E_REJECT không tính); 02/07=01/07+1 → PASS Rule 2 |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Manual:** Cần đơn E_REJECT sẵn trong DB — khó tạo hoàn toàn qua UI test flow

---

<a id="tc-014"></a>
## 090626_ATT_LEAVEDAY_010

**Tên:** BPNS đăng ký hộ NV nữ — ATT03.02 bypass workflow nhưng vẫn apply 3 validate rules  
**Loại:** Business Rule  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual  

### Tiền Điều Kiện

- Đăng nhập BPNS; NV001 nữ chưa có đơn KN tháng test

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở form tạo mới tại `att_leave_day` (Web Main — BPNS) |  | |
| 2 | Chọn NV001, loại KN, ngày hợp lệ, người duyệt | | |
| 3 | Click `Lưu và đóng` |  | Toast: *"Lưu thành công"*; Đơn status = **E_APPROVED** trực tiếp |
| 4 | Verify status đơn trong danh sách |  | Status = E_APPROVED (không qua chờ duyệt) |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Manual:** ATT03.02 bypass workflow → cần verify trực quan status sau khi lưu; khác biệt với ATT03.01

---

<a id="tc-015"></a>
## 090626_ATT_LEAVEDAY_011

**Tên:** BPNS đăng ký hộ NV nam với loại KN — FAIL Rule 1 ATT03.02  
**Loại:** Validation  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual  

### Tiền Điều Kiện

- Đăng nhập BPNS; NV nam NV002 tồn tại

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở form, chọn NV nam NV002 |  | |
| 2 | Kiểm tra dropdown loại nghỉ |  | Loại KN **không xuất hiện** HOẶC nếu có và submit → BLOCK |
| 3 | Nếu bypass → Click Lưu |  | Message: *"Loại ngày nghỉ Nghỉ kinh nguyệt chỉ áp dụng cho nhân viên nữ"* |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Manual:** ATT03.02 BPNS — filter dropdown theo giới tính NV được chọn (không phải BPNS login); cần verify trực quan

---

<a id="tc-016"></a>
## 090626_ATT_LEAVEDAY_012

**Tên:** Loại nghỉ thường (ApplyGender=All) không bị chặn bởi gender rule — Regression  
**Loại:** Regression  
**Group:** ATT | **Alias:** `att_leave_day` | **Tính năng:** LEAVEDAY  
**Độ ưu tiên:** Medium  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  

### Tiền Điều Kiện

- Loại nghỉ `Nghỉ phép thường (NPT)` với ApplyGender=All đã tồn tại

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tạo đơn ngày nghỉ cho NV nam NV002 | Loại: `Nghỉ phép thường (NPT)` | |
| 2 | Click `Lưu và đóng` |  | Toast: *"Lưu thành công"* — không bị gender rule chặn |

### Kết Quả Thực Tế

*(chưa chạy)*

---

<a id="tc-017"></a>
## 090626_CAT_CATLEAVEDAY_005

**Tên:** Sửa loại ngày nghỉ KN — thay đổi MaxConsecutiveDaysPerMonth  
**Loại:** Happy Path  
**Group:** CAT | **Alias:** `cat_leave_day_type` | **Tính năng:** CATLEAVEDAY  
**Độ ưu tiên:** Medium  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual  

### Tiền Điều Kiện

- Loại ngày nghỉ KN đã tồn tại với MaxConsecutiveDaysPerMonth=3
- Đăng nhập Admin

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Tìm loại ngày nghỉ KN trong danh sách |  | |
| 2 | Click row để vào Edit |  | Navigate sang /Cat_LeaveDayType/Edit/{id}; 3 field mới điền sẵn |
| 3 | Thay đổi `MaxConsecutiveDaysPerMonth` | `5` | Field cập nhật |
| 4 | Click `Lưu` |  | Toast: *"Cập nhật thành công"* |
| 5 | Tạo đơn KN sau — verify Rule 3 áp dụng limit mới N=5 |  | Đơn KN thứ 4, 5 được chấp nhận |

### Kết Quả Thực Tế

*(chưa chạy)*

### Ghi Chú

- **Lý do Manual:** Cần verify end-to-end sau khi thay đổi config → tạo đơn nghỉ; cần setup nhiều đơn liên tiếp

---

## 5. Checklist Review

| Tiêu chí | Đạt/Không đạt | Ghi chú |
| --- | --- | --- |
| TC bao phủ happy path chính | Đạt | TC-001, TC-005, TC-006, TC-010 |
| TC bao phủ validation bắt buộc | Đạt | TC-002 (form admin), TC-007~009 (3 rules) |
| TC bao phủ negative/edge case | Đạt | TC-012, TC-013 (E_CANCEL/E_REJECT), TC-010 (reset tháng) |
| Test data đủ rõ để chạy lại | Đạt | datafake.json cung cấp đầy đủ |
| Expected result có thể assert được | Đạt | Message lỗi xác định rõ trong spec.md |
| Phân loại Automation/Manual hợp lý | Đạt | Manual: setup DB phức tạp; ATT03.02 bypass verify |

---

## 6. Quy Ước Placeholder

| Placeholder | Ý nghĩa |
| --- | --- |
| `{datafake.ten_loai_kn}` | Tên loại ngày nghỉ KN, ví dụ `Nghỉ kinh nguyệt` |
| `{datafake.ma_loai_kn}` | Mã loại KN, ví dụ `KN` |
| `{datafake.nv_nu_code}` | Mã NV nữ test, ví dụ `NV001` |
| `{datafake.nv_nu_name}` | Tên NV nữ test |
| `{datafake.nv_nam_code}` | Mã NV nam test, ví dụ `NV002` |
| `{datafake.nv_nam_name}` | Tên NV nam test |
| `{datafake.nguoi_duyet_dau}` | Người duyệt đầu |
| `{datafake.nguoi_duyet_cuoi}` | Người duyệt cuối |

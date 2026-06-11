# 02_business-solution.md

## I. Thông tin chung

| Mục | Nội dung |
|---|---|
| Tên yêu cầu | Thêm loại ngày nghỉ kinh nguyệt cho NV nữ: 1 ngày/lần, liên tục, tối đa N ngày/tháng, N cấu hình được |
| Loại yêu cầu | New Feature |
| Mục tiêu nghiệp vụ | Tuân thủ luật lao động quyền nghỉ kinh nguyệt; kiểm soát đăng ký đúng policy (liên tục, giới hạn tháng) |
| Tài liệu đầu vào | docs/work/menstrual-leave/01_requirement-review.md, 02_preliminary-solution.md |
| Ngày cập nhật | 2026-06-11 |

---

## II. Hiện trạng hệ thống

### 1. Màn hình liên quan

| Màn hình | Đường dẫn |
|---|---|
| Admin — Quản lý loại ngày nghỉ | Cat_LeaveDayType |
| Portal/App — Đăng ký ngày nghỉ (NV) | Attendance → DS Ngày nghỉ |
| Web Main — Đăng ký hộ (BPNS) | Attendance → DS Nghỉ phép |
| Portal/App — Duyệt ngày nghỉ (CD) | Attendance → Duyệt ngày nghỉ |

### File tham khảo

```text
docs/wiki/modules/Attendance/LeaveManagement/01-DataModel.md
docs/wiki/modules/Attendance/LeaveManagement/02-Rules.md
docs/wiki/modules/Attendance/LeaveManagement/03-Processes.md
```

---

### 2. Luồng thao tác hiện tại

**ATT03.01 — NV tự đăng ký:**
1. NV chọn loại nghỉ, ngày → hệ thống validate rule
2. Pass → Lưu tạm → Gửi yêu cầu → Chờ duyệt
3. CD duyệt → E_APPROVED / Từ chối → E_REJECT

**ATT03.02 — BPNS đăng ký hộ:**
1. BPNS chọn NV, loại nghỉ, ngày → hệ thống validate rule
2. Pass → Lưu trực tiếp trạng thái E_APPROVED (bypass workflow)

### Kết quả hiện tại

```text
Chưa có loại ngày nghỉ kinh nguyệt trong hệ thống.
Cat_LeaveDayType.MaxPerMonth đang có logic riêng — không dùng được cho yêu cầu này.
NotSelectedInPortal là global flag — không filter được theo giới tính.
Không có validate consecutive days trong ATT03.01.
```

---

### 3. Cấu hình liên quan

| Cấu hình | Giá trị hiện tại |
|---|---|
| Cat_LeaveDayType.MaxPerMonth | Có logic riêng — không dùng cho loại KN |
| Cat_LeaveDayType.NotSelectedInPortal | Global, không theo giới tính |
| Cat_LeaveDayType.IsMenses | Cờ phân loại phép nghị định 85 — sẽ dùng |

---

## III. Giải pháp đề xuất

### 1. Tóm tắt giải pháp

```text
Tạo mới 1 record loại ngày nghỉ kinh nguyệt trong Cat_LeaveDayType.
Bổ sung 3 field mới vào Cat_LeaveDayType:
  - ApplyGender: giới tính được phép đăng ký (Female / All)
  - IsRequireConsecutive: loại nghỉ có yêu cầu ngày liên tục (bit)
  - MaxConsecutiveDaysPerMonth: số ngày tối đa/tháng dương lịch (int)
Thêm 3 validate rule mới vào ATT03.01/ATT03.02: gender filter, consecutive days, monthly limit.
Admin cấu hình trực tiếp trong form Cat_LeaveDayType hiện có.
```

---

### 2. Phạm vi thay đổi

#### Chức năng ảnh hưởng

| Chức năng | Loại thay đổi |
|---|---|
| Cat_LeaveDayType — danh mục loại nghỉ | Modify — thêm 3 fields mới |
| ATT03.01/02 — validate rule khi đăng ký | Modify — thêm 3 validate rule mới (Portal/App ATT03.01 và Web Main ATT03.02) |
| Portal/App — dropdown loại nghỉ | Modify — filter theo giới tính NV |
| Web Main — dropdown loại nghỉ (BPNS) | Modify — filter theo giới tính NV được đăng ký hộ |

#### Màn hình ảnh hưởng

| Màn hình | Mức độ |
|---|---|
| Admin — Cat_LeaveDayType | Thêm fields: ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth |
| Portal/App — form đăng ký nghỉ (ATT03.01) | Filter dropdown loại nghỉ theo giới tính NV; validate 3 rule khi submit |
| Web Main — form đăng ký hộ (BPNS) (ATT03.02) | Filter dropdown theo giới tính NV được chọn; validate 3 rule trước khi lưu E_APPROVED |

---

## IV. Mô tả thay đổi chi tiết

### [BS-01] Bổ sung fields mới vào Cat_LeaveDayType

#### Màn hình

```text
Admin — Quản lý loại ngày nghỉ (Cat_LeaveDayType)
```

#### Yêu cầu thay đổi

##### Thêm mới

| Field | Mô tả | Giá trị mặc định |
|---|---|---|
| `ApplyGender` | Giới tính áp dụng: `Female` / `All` | `All` |
| `IsRequireConsecutive` | Loại nghỉ yêu cầu ngày liên tục | `0` (false) |
| `MaxConsecutiveDaysPerMonth` | Số ngày tối đa/tháng dương lịch (chỉ áp dụng khi IsRequireConsecutive = true) | null |

**Cấu hình record loại nghỉ kinh nguyệt:**

| Field | Giá trị |
|---|---|
| LeaveDayTypeName | (Admin đặt tên) |
| IsMenses | 1 |
| ApplyGender | Female |
| IsRequireConsecutive | 1 |
| MaxConsecutiveDaysPerMonth | N (Admin cấu hình, ví dụ: 3) |
| MaxPerTimes | 1 |

##### Sửa đổi

* Form Cat_LeaveDayType hiển thị thêm 3 field mới

##### Loại bỏ

* (không có)

#### Validate

| Điều kiện | Thông báo |
|---|---|
| `IsRequireConsecutive = true` AND `MaxConsecutiveDaysPerMonth` trống | *"Vui lòng nhập số ngày tối đa/tháng"* |

---

### [BS-02] Validate rule khi đăng ký nghỉ — loại có IsRequireConsecutive = true

#### Màn hình

| Màn hình | Luồng | Ghi chú |
|---|---|---|
| Portal/App — Form đăng ký ngày nghỉ | ATT03.01 — NV tự đăng ký | Validate tại Step 02 — System kiểm tra quy tắc |
| Web Main — Form đăng ký hộ (BPNS) | ATT03.02 — BPNS đăng ký hộ | Cùng validate rule, áp dụng tại bước lưu |

#### Yêu cầu thay đổi

##### Thêm mới

**Rule 1 — Gender Filter:**
Khi NV chọn loại nghỉ có `ApplyGender = Female`, kiểm tra giới tính NV.

| Luồng | Kiểm tra giới tính của |
|---|---|
| ATT03.01 (Portal/App — NV tự đăng ký) | NV đang đăng nhập |
| ATT03.02 (Web Main — BPNS đăng ký hộ) | NV được chọn đăng ký hộ (không phải BPNS) |

**Rule 2 — Consecutive Days:**
Chỉ áp dụng khi `IsRequireConsecutive = true`. Áp dụng cho cả ATT03.01 và ATT03.02.

```
LastApprovedDate = MAX(DateEnd) từ Att_LeaveDay
  WHERE ProfileID = NV (người được nghỉ), LeaveDayTypeID = loại KN
    AND tháng/năm = tháng/năm ngày đang đăng ký
    AND Status = E_APPROVED
```

- Nếu `LastApprovedDate = null` (lần đầu trong tháng): **Pass** — bất kỳ ngày nào
- Nếu ngày đăng ký = `LastApprovedDate + 1`: **Pass**
- Nếu ngày đăng ký ≠ `LastApprovedDate + 1`: **Fail**

**Rule 3 — Monthly Limit:**
Chỉ áp dụng khi `IsRequireConsecutive = true` và `MaxConsecutiveDaysPerMonth` không null. Áp dụng cho cả ATT03.01 và ATT03.02.

```
ApprovedCount = COUNT(ngày) từ Att_LeaveDay
  WHERE ProfileID = NV (người được nghỉ), LeaveDayTypeID = loại KN
    AND tháng/năm = tháng/năm ngày đang đăng ký
    AND Status = E_APPROVED
```

- Nếu `ApprovedCount < MaxConsecutiveDaysPerMonth`: **Pass**
- Nếu `ApprovedCount >= MaxConsecutiveDaysPerMonth`: **Fail**

**Lưu ý:**
- Đơn E_CANCEL / E_REJECT không tính vào `LastApprovedDate` và `ApprovedCount`
- Counter reset implicit theo tháng dương lịch (filter by month)
- ATT03.02: BPNS đăng ký hộ → kết quả E_APPROVED trực tiếp (bypass workflow) nhưng vẫn phải pass cả 3 rule trên trước khi lưu

##### Sửa đổi

* (không có — thêm rule mới, không sửa rule cũ)

##### Loại bỏ

* (không có)

#### Validate

| Điều kiện | Áp dụng cho | Thông báo lỗi |
|---|---|---|
| ApplyGender = Female AND giới tính NV ≠ Nữ | ATT03.01 và ATT03.02 | *"Loại ngày nghỉ [Tên loại] chỉ áp dụng cho nhân viên nữ"* |
| Ngày đăng ký ≠ LastApprovedDate + 1 (khi LastApprovedDate ≠ null) | ATT03.01 và ATT03.02 | *"Ngày đăng ký phải là [LastApprovedDate + 1]. Các ngày nghỉ [Tên loại] phải liên tiếp nhau."* |
| ApprovedCount >= MaxConsecutiveDaysPerMonth | ATT03.01 và ATT03.02 | *"Bạn đã đăng ký đủ [N] ngày [Tên loại] trong tháng [MM/YYYY]."* |

---

### [BS-03] Filter hiển thị loại nghỉ theo giới tính trên Portal/App và Web Main

#### Màn hình

```text
Portal/App — Form đăng ký ngày nghỉ (dropdown loại nghỉ)
Web Main — Form đăng ký hộ (dropdown loại nghỉ)
```

#### Yêu cầu thay đổi

##### Thêm mới

| Điều kiện | Hiển thị trong dropdown |
|---|---|
| `ApplyGender = All` | Tất cả NV |
| `ApplyGender = Female` AND NV là Nữ | Có |
| `ApplyGender = Female` AND NV là Nam | Không hiển thị |

Web Main (BPNS): filter theo giới tính của NV được chọn đăng ký hộ, không theo giới tính BPNS.

##### Sửa đổi

* Logic lấy danh sách loại nghỉ cho dropdown: thêm filter `ApplyGender`

##### Loại bỏ

* (không có)

#### Validate

| Điều kiện | Thông báo |
|---|---|
| NV nam bypass UI chọn loại Female | Xử lý bởi BS-02 Rule 1 |

---

## V. Giao diện

### Có cần thiết kế UI/Prototype không?

* [ ] Không
* [x] Có

| Màn hình | Ghi chú |
|---|---|
| Admin — Cat_LeaveDayType | Thêm 3 fields mới vào form (ApplyGender dropdown, IsRequireConsecutive checkbox, MaxConsecutiveDaysPerMonth input number) |
| Portal/App — form đăng ký | Không thay đổi layout — chỉ filter dropdown |
| Web Main — form đăng ký hộ | Không thay đổi layout — chỉ filter dropdown theo NV được chọn |

### Mockup mô tả

```text
Admin — Cat_LeaveDayType form (thêm mới / chỉnh sửa):
  ...các field hiện tại...
  [Giới tính áp dụng]    : dropdown [Tất cả / Nữ]
  [Yêu cầu ngày liên tục]: checkbox
  [Số ngày tối đa/tháng] : input number (hiển thị khi "Yêu cầu ngày liên tục" được chọn)
```

---

## VI. Vùng ảnh hưởng

### Chức năng liên quan

| Chức năng | Mức độ ảnh hưởng |
|---|---|
| Đăng ký ngày nghỉ ATT03.01 | Cao — thêm validate rule |
| Đăng ký hộ ATT03.02 | Cao — thêm validate rule |
| Danh mục loại ngày nghỉ | Trung bình — thêm fields |
| Duyệt ngày nghỉ | Thấp — không thay đổi flow duyệt |
| Email notification | Thấp — không thay đổi template |

### Dữ liệu liên quan

| Đối tượng dữ liệu | Tác động |
|---|---|
| `Cat_LeaveDayType` | Thêm 3 fields mới: ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth |
| `Att_LeaveDay` | Chỉ đọc — query để validate consecutive và monthly count |
| `Hre_Profile` | Chỉ đọc — lấy giới tính NV để filter |

### Quy trình nghiệp vụ liên quan

* ATT03.01 — NV tự đăng ký (Portal/App): thêm 3 validate rule tại Step 02
* ATT03.02 — BPNS đăng ký hộ (Web Main): thêm 3 validate rule tương tự trước khi lưu E_APPROVED
* Email notification: giữ nguyên — không thay đổi

**Permission:**

| Actor | Xem loại KN | Đăng ký KN | Cấu hình |
|---|---|---|---|
| NV nữ | ✓ | ✓ | ✗ |
| NV nam | ✗ | ✗ | ✗ |
| BPNS/HR | ✓ (hộ NV nữ) | ✓ (hộ NV nữ) | ✗ |
| Admin/HR quản trị | ✓ | ✓ | ✓ |
| CD (duyệt) | ✓ (trong DS duyệt) | ✗ | ✗ |

---

## VII. Checklist hoàn thành

### Hiện trạng

* [x] Đã xác định màn hình hiện tại
* [x] Đã mô tả luồng thao tác hiện tại
* [x] Đã xác định cấu hình liên quan

### Giải pháp

* [x] Đã mô tả đầy đủ thay đổi nghiệp vụ (BS-01 → BS-03)
* [x] Đã xác định màn hình ảnh hưởng
* [x] Đã liệt kê validate + thông báo lỗi cụ thể

### Chất lượng

* [x] Đã đánh giá vùng ảnh hưởng
* [x] Đã có tiêu chí nghiệm thu (TC-01 → TC-12 trong 02_preliminary-solution.md)
* [x] Không còn blocker nghiệp vụ
* [x] Sẵn sàng chuyển sang Phase 3

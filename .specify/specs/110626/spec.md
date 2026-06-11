# spec.md

## I. Thông tin chung

| Mục | Nội dung |
| --- | --- |
| **Tên yêu cầu** | Xây dựng module Quản lý kế hoạch đi công tác (module mới) |
| **Loại yêu cầu** | New Feature |
| **Mục tiêu nghiệp vụ** | Kiểm soát thông tin kế hoạch công tác tập trung, rõ đầu mối Trưởng đoàn, hỗ trợ báo cáo theo thời gian / trưởng đoàn / trạng thái |
| **Tài liệu đầu vào** | 01_requirement-review.md · 01_research.md · 02_preliminary-solution.md |
| **Người phân tích** | BA/PE |
| **Ngày cập nhật** | 2026-06-11 |

---

## II. Hiện trạng hệ thống

> Module Công tác (BusinessTrip / TripPlan) là **module hoàn toàn mới** — chưa tồn tại trong HRM9. Phần Hiện trạng mô tả context hệ thống liên quan, không phải màn hình cần thay đổi.

## 1. Màn hình liên quan

| Màn hình | Đường dẫn |
| --- | --- |
| Danh sách nhân viên đang làm việc (nguồn Trưởng đoàn) | `/Hre_Profile/Index` (alias: `hre_profile`) |
| Cơ cấu tổ chức phòng ban (nguồn Phòng ban phụ trách) | `/Cat_OrgStructure/Index` (alias: `cat_org_structure`) |
| Danh sách tỉnh/thành phố (nguồn Địa điểm công tác) | `/Cat_Province/Index` (alias: `cat_province`) |
| DS Đi công tác cá nhân — ATT module (tham chiếu, không thay đổi) | `/Att_BussinessTravel/Index` (alias: `att_bussiness_travel`) |
| DS Ngày nghỉ loại Công tác — ATT module (tham chiếu, không thay đổi) | `/Att_LeavedayBusinessTravel/Index` (alias: `att_leaveday_business_travel`) |

> **Lưu ý:** Hai màn hình ATT (`att_bussiness_travel`, `att_leaveday_business_travel`) quản lý ở cấp nhân viên cá nhân (employee-level tracking). Module mới quản lý ở cấp kế hoạch đợt (plan-level). Hai module độc lập, không conflict.

### File tham khảo

```text
docs/wiki/modules/HumanResource/EmployeeProfile/01-DataModel.md
docs/wiki/modules/HumanResource/OrgStructure/01-DataModel.md
docs/wiki/_Foundation/URLAliases.md
docs/wiki/_Foundation/HRMMainComponents.md
```

---

## 2. Luồng thao tác hiện tại

### Các bước thực hiện

> Không có luồng hiện tại — module mới hoàn toàn.

HRM9 hiện tại không có chức năng quản lý kế hoạch đợt công tác ở cấp plan-level. Nhu cầu này được quản lý ngoài hệ thống (Excel, email, v.v.).

### Kết quả hiện tại

```text
Không có — module chưa tồn tại.
```

---

## 3. Cấu hình liên quan (nếu có)

| Cấu hình nghiệp vụ | Giá trị hiện tại | Ý nghĩa / Ảnh hưởng nghiệp vụ | Nguồn xác nhận |
| --- | --- | --- | --- |
| Danh mục địa điểm công tác | Reuse danh mục Tỉnh/Thành phố có sẵn (Cat_Province) | Người dùng chọn tỉnh/thành làm địa điểm công tác. Không cần tạo danh mục mới. | BA confirmed — Q-P2-002 |
| Danh mục tiền tệ cho Ngân sách dự kiến | Chưa xác định — cần Phase 3 research | Ảnh hưởng đến field Tiền tệ trong form tạo/sửa. | Unknown — Phase 3 |
| Cấu hình người duyệt | Permission-based: ai được cấp quyền "Duyệt kế hoạch công tác" thì thấy button và duyệt được | Không cần cấu hình riêng — quản lý qua phân quyền Sys_Group / Sys_ManagePermission | BA confirmed — Q-P2-001 |
| Phân quyền xem/tạo/sửa/submit | HR và Quản lý: xem all, tạo, sửa, submit — không giới hạn đơn vị | BR-007 — không có row-level security theo đơn vị cho module này | Customer confirmed |

---

## III. Giải pháp đề xuất

## 1. Tóm tắt giải pháp

```text
Xây dựng module mới "Quản lý kế hoạch đi công tác" trong HRM9 gồm 2 màn hình:
(1) Màn hình danh sách — tìm kiếm, lọc, xem, và thao tác trên danh sách đợt công tác.
(2) Màn hình tạo mới / chỉnh sửa — form nhập 11 fields với approval workflow 1 bước.

Vòng đời đợt công tác: Draft → Chờ duyệt → Đã duyệt → Đang thực hiện → Hoàn thành (hoặc Hủy từ bất kỳ trạng thái).
Người duyệt: bất kỳ user được cấp quyền "Duyệt kế hoạch công tác" — thấy button Duyệt/Từ chối là thao tác được.
Reject → hồ sơ giữ nguyên Chờ duyệt; HR/QL dùng thao tác "Thu hồi" để về Draft.
Trưởng đoàn bắt buộc; phòng ban phụ trách auto-fill từ phòng ban chính của Trưởng đoàn tại thời điểm chọn.
Hỗ trợ xuất Excel và lọc đa tiêu chí.
```

---

## 2. Phạm vi thay đổi

### Chức năng ảnh hưởng

| Chức năng | Loại thay đổi |
| --- | --- |
| Quản lý kế hoạch đi công tác — Danh sách | New |
| Quản lý kế hoạch đi công tác — Tạo mới / Chỉnh sửa | New |
| Phân quyền — nhóm quyền Công tác | New |

### Màn hình ảnh hưởng

| Màn hình | Mức độ |
| --- | --- |
| `[Màn hình mới]` Danh sách kế hoạch đi công tác | New — tạo mới hoàn toàn |
| `[Màn hình mới]` Form tạo mới / chỉnh sửa kế hoạch đi công tác | New — tạo mới hoàn toàn |
| `Att_BussinessTravel`, `Att_LeavedayBusinessTravel` | Không thay đổi — tham chiếu context |

---

## 3. Mô tả thay đổi chi tiết

### [BS-01] Tạo mới hồ sơ kế hoạch đi công tác

#### Màn hình

```text
Form tạo mới kế hoạch đi công tác (trang riêng — Pattern B)
```

#### Yêu cầu thay đổi

##### Thêm mới

**Form fields (11 fields):**

| # | Tên field | Loại control | Bắt buộc | Mô tả / Hành vi |
|---|---|---|---|---|
| 1 | Mã đợt công tác | Textbox | Có | Nhập tự do, không validate unique. |
| 2 | Tên đợt công tác | Textbox | Có | Tên mô tả chuyến đi. |
| 3 | Địa điểm | DropDownList | Không | Nguồn: danh mục Tỉnh/Thành phố (Cat_Province). |
| 4 | Từ ngày | DatePicker | Có | Phải ≤ Đến ngày. |
| 5 | Đến ngày | DatePicker | Có | Phải ≥ Từ ngày. |
| 6 | Mục tiêu | Textarea | Không | Mô tả mục tiêu chuyến đi. |
| 7 | Ngân sách dự kiến | Numeric | Không | Tùy chọn. Giá trị số. |
| 8 | Tiền tệ | DropDownList | Không | Áp dụng khi có giá trị Ngân sách. Nguồn: danh mục tiền tệ (Phase 3 xác định nguồn). |
| 9 | Trưởng đoàn | ComboBox | Có | Chọn từ nhân viên đang làm việc (active). Khi chọn → auto-fill Phòng ban phụ trách. |
| 10 | Phòng ban phụ trách | Readonly | Auto | Tự động hiển thị phòng ban chính của Trưởng đoàn tại thời điểm chọn. Không cho sửa trực tiếp. |
| 11 | Ghi chú | Textarea | Không | Ghi chú nội bộ. |

**Trạng thái khởi tạo:** Khi nhấn Lưu → hồ sơ được lưu ở trạng thái **Draft**.

**Hành vi auto-fill Phòng ban:**
- Khi user chọn Trưởng đoàn → hệ thống tự động lấy phòng ban chính hiện tại của người đó và hiển thị vào field Phòng ban phụ trách.
- Nếu Trưởng đoàn sau này chuyển phòng ban, field Phòng ban phụ trách trên hồ sơ **không tự cập nhật** (snapshot tại thời điểm tạo/sửa).

#### Validate

| Điều kiện | Thông báo |
| --- | --- |
| Mã đợt công tác bỏ trống | "Mã đợt công tác là bắt buộc" |
| Tên đợt công tác bỏ trống | "Tên đợt công tác là bắt buộc" |
| Từ ngày bỏ trống | "Từ ngày là bắt buộc" |
| Đến ngày bỏ trống | "Đến ngày là bắt buộc" |
| Từ ngày > Đến ngày | "Từ ngày phải nhỏ hơn hoặc bằng Đến ngày" |
| Trưởng đoàn bỏ trống | "Trưởng đoàn là bắt buộc" |

---

### [BS-02] Xem và tìm kiếm danh sách kế hoạch đi công tác

#### Màn hình

```text
Danh sách kế hoạch đi công tác (trang Index — Pattern B)
```

#### Yêu cầu thay đổi

##### Thêm mới

**Search panel — bộ lọc:**

| Filter | Loại control | Mô tả |
|---|---|---|
| Từ ngày — Đến ngày | DatePicker (từ/đến) | Lọc theo khoảng thời gian công tác |
| Trưởng đoàn | ComboBox | Tìm kiếm theo tên/mã nhân viên |
| Địa điểm | DropDownList | Lọc theo tỉnh/thành |
| Trạng thái | DropDownList | Lọc theo trạng thái (Draft / Chờ duyệt / Đã duyệt / Đang thực hiện / Hoàn thành / Hủy) |

**Toolbar — các nút thao tác:**

| Nút | Hiển thị khi | Mô tả |
|---|---|---|
| Tạo mới | Luôn hiển thị (theo quyền Create) | Mở form tạo mới đợt công tác |
| Tìm kiếm | Luôn hiển thị | Thực thi filter |
| Xuất Excel | Luôn hiển thị (theo quyền Export) | Xuất danh sách theo filter hiện tại |
| Xóa | Chọn ≥1 dòng (theo quyền Delete) | Xóa hồ sơ — chỉ xóa được trạng thái Draft |

**Grid — danh sách kết quả:**

| Cột | Mô tả |
|---|---|
| Mã đợt công tác | |
| Tên đợt công tác | |
| Địa điểm | Tên tỉnh/thành |
| Từ ngày | |
| Đến ngày | |
| Trưởng đoàn | Tên nhân viên |
| Phòng ban phụ trách | Tên phòng ban |
| Ngân sách dự kiến | Số + tên tiền tệ |
| Trạng thái | Hiển thị màu theo trạng thái [Gợi ý — BA xác nhận màu] |
| Thao tác | Nút Sửa / Xem chi tiết |

**Xuất Excel:** Xuất toàn bộ dữ liệu theo filter đang áp dụng. Các cột tương tự grid.

#### Validate

| Điều kiện | Thông báo |
| --- | --- |
| Nhấn Xóa khi hồ sơ không ở trạng thái Draft | "Chỉ được xóa hồ sơ ở trạng thái Draft" |
| Nhấn Xóa chưa chọn dòng | "Vui lòng chọn hồ sơ cần xóa" |

---

### [BS-03] Approval workflow — Submit và Duyệt/Từ chối

#### Màn hình

```text
Danh sách kế hoạch đi công tác (toolbar) + Form chỉnh sửa
```

#### Yêu cầu thay đổi

##### Thêm mới

**Vòng đời đợt công tác (state machine):**

```
Tạo mới
    ↓ Lưu
  [Draft]
    ↓ Submit (Gửi duyệt)
  [Chờ duyệt]
    ↓ Approve (Duyệt)          ↓ Reject (Từ chối) → giữ [Chờ duyệt] + ghi nhận lý do
  [Đã duyệt]
    ↓ Bắt đầu thực hiện (thủ công)
  [Đang thực hiện]
    ↓ Hoàn thành (thủ công)
  [Hoàn thành]

  [Hủy] ← từ bất kỳ trạng thái (thủ công, qua dialog xác nhận)
  [Draft] ← từ [Chờ duyệt] khi HR/QL dùng "Thu hồi"
```

**Các nút thao tác trên form / toolbar (hiển thị theo trạng thái + quyền):**

| Nút | Điều kiện hiển thị | Kết quả |
|---|---|---|
| **Gửi duyệt** | Trạng thái = Draft; quyền Submit | Hồ sơ → Chờ duyệt; notification gửi tới user có quyền Duyệt |
| **Thu hồi** | Trạng thái = Chờ duyệt; quyền Submit | Hồ sơ → Draft |
| **Duyệt** | Trạng thái = Chờ duyệt; quyền Approve | Hồ sơ → Đã duyệt |
| **Từ chối** | Trạng thái = Chờ duyệt; quyền Approve | Hồ sơ giữ Chờ duyệt + ghi nhận lý do từ chối; notification thông báo về cho người tạo |
| **Bắt đầu thực hiện** | Trạng thái = Đã duyệt; quyền ChangeStatus | Hồ sơ → Đang thực hiện |
| **Hoàn thành** | Trạng thái = Đang thực hiện; quyền ChangeStatus | Hồ sơ → Hoàn thành; hiện dialog xác nhận trước khi thực hiện |
| **Hủy** | Bất kỳ trạng thái; quyền Cancel | Hồ sơ → Hủy; hiện dialog xác nhận + nhập lý do hủy |

**Notification:**
- Khi Submit: notification gửi tới tất cả user có quyền "Duyệt kế hoạch công tác".
- Khi Từ chối: notification gửi về cho người tạo hồ sơ.
- Khi Duyệt: notification gửi về cho người tạo hồ sơ.

**Cảnh báo khi sửa hồ sơ Hoàn thành / Hủy:**
- Khi user mở form sửa hồ sơ đang ở trạng thái Hoàn thành hoặc Hủy → hiển thị dialog cảnh báo: *"Hồ sơ đã [Hoàn thành / Hủy]. Bạn có chắc muốn chỉnh sửa không?"*
- Nếu xác nhận → cho phép sửa bình thường.
- Không khóa cứng.

#### Validate

| Điều kiện | Thông báo |
| --- | --- |
| Nhấn Gửi duyệt khi hồ sơ không ở Draft | "Chỉ được gửi duyệt hồ sơ ở trạng thái Draft" |
| Nhấn Duyệt / Từ chối khi hồ sơ không ở Chờ duyệt | "Hồ sơ không ở trạng thái Chờ duyệt" |
| Nhấn Từ chối mà không nhập lý do | "Vui lòng nhập lý do từ chối" |
| Nhấn Hủy mà không nhập lý do | "Vui lòng nhập lý do hủy" |

---

### [BS-04] Chỉnh sửa hồ sơ theo trạng thái

#### Màn hình

```text
Form chỉnh sửa kế hoạch đi công tác
```

#### Yêu cầu thay đổi

##### Thêm mới

**Quy tắc chỉnh sửa theo trạng thái:**

| Trạng thái | Được sửa? | Ghi chú |
|---|---|---|
| Draft | Có — tự do | Không cảnh báo |
| Chờ duyệt | Không | Hồ sơ đang chờ duyệt — nếu muốn sửa cần Thu hồi về Draft trước |
| Đã duyệt | Có | Không cảnh báo |
| Đang thực hiện | Không | [Gợi ý — BA xác nhận] |
| Hoàn thành | Có — nhưng cảnh báo | Dialog xác nhận trước khi cho sửa |
| Hủy | Có — nhưng cảnh báo | Dialog xác nhận trước khi cho sửa |

#### Validate

| Điều kiện | Thông báo |
| --- | --- |
| Sửa hồ sơ Chờ duyệt | Nút Sửa bị vô hiệu hóa hoặc ẩn; toast "Hồ sơ đang chờ duyệt, không thể chỉnh sửa" |

---

## IV. Giao diện

## Có cần thiết kế UI/Prototype không?

* [ ] Không
* [x] Có — cần wireframe cho 2 màn hình mới

### Nếu có

| Màn hình | Link thiết kế |
| --- | --- |
| Danh sách kế hoạch đi công tác | Chưa có — Phase 3 |
| Form tạo mới / chỉnh sửa | Chưa có — Phase 3 |

### Mockup mô tả

**Màn hình Danh sách (Pattern B):**
```
[Search Panel]
  Từ ngày [__/__/____]  Đến ngày [__/__/____]
  Trưởng đoàn [__________▼]  Địa điểm [__▼]  Trạng thái [__▼]
  [Tìm kiếm]

[Toolbar]
  [Tạo mới]  [Xuất Excel]  [Xóa]

[Grid]
  Mã | Tên | Địa điểm | Từ ngày | Đến ngày | Trưởng đoàn | Phòng ban | Ngân sách | Trạng thái | Thao tác
  ...
```

**Màn hình Form Tạo mới / Chỉnh sửa (Pattern B — trang riêng):**
```
[Mã đợt công tác *]      [Tên đợt công tác *]
[Địa điểm ▼]             [Từ ngày * — Đến ngày *]
[Trưởng đoàn * (ComboBox)] [Phòng ban phụ trách (readonly, auto-fill)]
[Mục tiêu (textarea)]
[Ngân sách dự kiến (numeric)]  [Tiền tệ ▼]
[Ghi chú (textarea)]

[Lưu]  [Gửi duyệt / Thu hồi / Duyệt / Từ chối / Bắt đầu thực hiện / Hoàn thành / Hủy]
(Nút hiển thị theo trạng thái + quyền)
```

---

## V. Vùng ảnh hưởng

## Chức năng liên quan

| Chức năng | Mức độ ảnh hưởng |
| --- | --- |
| Phân quyền (Sys_Group / Sys_ManagePermission) | Cao — cần tạo nhóm quyền mới cho module Công tác |
| Danh mục Tỉnh/Thành phố (Cat_Province) | Thấp — đọc dữ liệu, không thay đổi |
| Hồ sơ nhân viên (Hre_Profile) | Thấp — đọc dữ liệu, không thay đổi |
| Cơ cấu tổ chức (Cat_OrgStructure) | Thấp — đọc dữ liệu, không thay đổi |
| ATT: Đi công tác cá nhân | Không ảnh hưởng — module độc lập |
| Danh mục tiền tệ | Trung bình — cần Phase 3 xác định nguồn và seed data |

---

## Dữ liệu liên quan

| Đối tượng dữ liệu | Tác động |
| --- | --- |
| Hồ sơ kế hoạch đợt công tác | Tạo mới — entity mới hoàn toàn |
| Hre_Profile (nhân viên) | Đọc — lấy danh sách Trưởng đoàn và phòng ban |
| Cat_OrgStructure (phòng ban) | Đọc — auto-fill Phòng ban phụ trách |
| Cat_Province (tỉnh/thành) | Đọc — dropdown Địa điểm |
| Danh mục tiền tệ | Đọc — dropdown Tiền tệ (Phase 3 xác định) |
| Lịch sử trạng thái / Từ chối / Hủy | Tạo mới — cần lưu lý do và thời điểm thay đổi trạng thái |

---

## Quy trình nghiệp vụ liên quan

* HR/Quản lý lập kế hoạch đi công tác → gửi duyệt → Đã duyệt → Bắt đầu thực hiện → Hoàn thành.
* Kế hoạch công tác có thể bị Hủy từ bất kỳ giai đoạn nào với lý do hủy.
* Phòng ban phụ trách và Trưởng đoàn là thông tin cốt lõi phục vụ báo cáo sau này.

---

## VI. Checklist hoàn thành

## Hiện trạng

* [x] Đã xác định màn hình hiện tại (module mới — không có màn hình cũ)
* [x] Đã mô tả context hệ thống liên quan (HRE, ATT, Cat)
* [x] Đã xác định cấu hình liên quan (permission-based approver, Cat_Province, tiền tệ Phase 3)

## Giải pháp

* [x] Đã mô tả đầy đủ thay đổi nghiệp vụ (BS-01..BS-04)
* [x] Đã xác định màn hình ảnh hưởng (2 màn hình mới)
* [x] Đã liệt kê validate theo từng BS
* [x] Đã mô tả state machine đầy đủ 5 trạng thái + vòng đời
* [x] Đã mô tả approval workflow 1 bước (permission-based)
* [x] Đã mô tả notification trigger

## Chất lượng

* [x] Đã đánh giá vùng ảnh hưởng
* [x] Đã ghi nhận override BR-008 (bỏ validate unique Mã đợt) — confirmed bởi BA/PE
* [ ] Danh mục tiền tệ — nguồn chưa xác định (Phase 3 action)
* [ ] Màu trạng thái trên grid — cần BA xác nhận (ghi [Gợi ý])
* [ ] Quy tắc sửa trạng thái "Đang thực hiện" — cần BA xác nhận (ghi [Gợi ý])
* [x] Không còn blocker nghiệp vụ trước Phase 3
* [x] Sẵn sàng chuyển sang Phase 3

---

## Ghi chú Override Phase 1

| ID | Rule gốc Phase 1 | Thay đổi | Xác nhận bởi |
|---|---|---|---|
| BR-008 / REQ-002 | Mã đợt công tác: user nhập, validate unique | **Override:** Bỏ validate unique — nhập tự do, không ràng buộc. | BA/PE — Q-P2-004 (2026-06-11) |

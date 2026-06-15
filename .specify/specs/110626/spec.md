# spec.md

## I. Thông tin chung

| Mục | Nội dung |
|---|---|
| **Tên yêu cầu** | Bổ sung trường Ghi chú đánh giá ngân hàng vào màn hình Ngân hàng |
| **Loại yêu cầu** | Modify |
| **Mục tiêu nghiệp vụ** | Cho phép người dùng nội bộ lưu nhận xét đánh giá (ưu/nhược điểm, lưu ý, trải nghiệm) cho từng ngân hàng ngay trên màn hình quản lý danh mục ngân hàng |
| **Tài liệu đầu vào** | 01_requirement-review.md, 01_research.md, 02_preliminary-solution.md |
| **Người phân tích** | BA/PE |
| **Ngày cập nhật** | 2026-06-11 |

---

## II. Hiện trạng hệ thống

> Bắt buộc đối với yêu cầu Modify/Bug

## 1. Màn hình liên quan

| Màn hình | Đường dẫn |
|---|---|
| Danh mục > Ngân hàng | `/Cat_Bank/Index` (alias: `cat_bank`) |
| Danh mục > Ngân hàng (form Tạo mới) | `/Cat_Bank/Create` |
| Danh mục > Ngân hàng (form Cập nhật) | `/Cat_Bank/Edit` |

### File tham khảo

```text
docs/raw/url-aliases.md
docs/raw/task-mantis/VnR.SystemDesign.HRMPro8.Task.HRE.20180508.md
docs/wiki/_Foundation/HRMMainComponents.md
docs/wiki/_Foundation/URLAliases.md
```

---

## 2. Luồng thao tác hiện tại

### Các bước thực hiện

1. Người dùng vào **Trang chủ → Danh mục → Ngân hàng** (`/Cat_Bank/Index`)
2. Hệ thống hiển thị danh sách ngân hàng dạng lưới (Kendo Grid)
3. Người dùng nhấn **Tạo mới** → Hệ thống mở form Tạo mới ngân hàng (trang riêng — Pattern B)
4. Người dùng nhập thông tin: Mã ngân hàng, Tên ngân hàng và các trường hiện có
5. Người dùng nhấn **Lưu** → Hệ thống lưu bản ghi và redirect về danh sách
6. Khi cập nhật: Người dùng chọn dòng → nhấn **Chỉnh sửa** → form Cập nhật mở với giá trị hiện có → Lưu → redirect về danh sách

### Kết quả hiện tại

```text
Bản ghi ngân hàng được lưu với các trường hiện có (Mã, Tên, ...).
Không có trường ghi chú đánh giá nội bộ trên form UI.
```

---

## 3. Cấu hình liên quan (nếu có)

| Cấu hình nghiệp vụ | Giá trị hiện tại | Ý nghĩa / Ảnh hưởng nghiệp vụ | Nguồn xác nhận |
|---|---|---|---|
| Phân quyền truy cập màn hình Ngân hàng | Không thay đổi | Ai có quyền vào màn hình thì xem và sửa được field Ghi chú đánh giá | BA/User confirmed |

---

## III. Giải pháp đề xuất

## 1. Tóm tắt giải pháp

```text
Bổ sung trường Ghi chú đánh giá ngân hàng (ô nhập nhiều dòng, không bắt buộc, tối đa 1000 ký tự)
vào form Tạo mới và form Cập nhật trên màn hình Danh mục > Ngân hàng.
Trường này cho phép người dùng lưu nhận xét nội bộ về từng ngân hàng.
Không thay đổi luồng nghiệp vụ hiện tại.
```

---

## 2. Phạm vi thay đổi

### Chức năng ảnh hưởng

| Chức năng | Loại thay đổi |
|---|---|
| Tạo mới ngân hàng | Modify |
| Cập nhật ngân hàng | Modify |

### Màn hình ảnh hưởng

| Màn hình | Mức độ |
|---|---|
| Danh mục > Ngân hàng — form Tạo mới | Trực tiếp |
| Danh mục > Ngân hàng — form Cập nhật | Trực tiếp |
| Danh mục > Ngân hàng — danh sách (Index) | Không ảnh hưởng |
| Danh mục > Ngân hàng (Excel Grid) | Ngoài phạm vi |

---

## 3. Mô tả thay đổi chi tiết

### [BS-01] Bổ sung trường Ghi chú đánh giá ngân hàng trên form Tạo mới và Cập nhật

#### Màn hình

```text
Danh mục > Ngân hàng — form Tạo mới (/Cat_Bank/Create)
Danh mục > Ngân hàng — form Cập nhật (/Cat_Bank/Edit)
```

#### Yêu cầu thay đổi

##### Thêm mới

* Thêm trường **Ghi chú đánh giá ngân hàng** vào form Tạo mới và form Cập nhật
  * Loại control: Ô nhập nhiều dòng (Textarea)
  * Vị trí đặt: Sau các trường thông tin chính của ngân hàng (Mã, Tên, ...), trước phần File đính kèm nếu có — theo pattern danh mục hiện tại
  * Bắt buộc nhập: Không
  * Nội dung: Text tự do, cho phép ký tự đặc biệt và xuống dòng
  * Giới hạn: Tối đa 1000 ký tự
  * Trạng thái mặc định: Rỗng khi tạo mới; hiển thị nội dung đã lưu khi cập nhật
  * Hiển thị với: Tất cả người dùng có quyền truy cập màn hình

##### Sửa đổi

* Không có thay đổi trên các trường hiện có

##### Loại bỏ

* Không có

#### Validate

| Điều kiện | Thông báo |
|---|---|
| Người dùng nhập vượt 1000 ký tự | Thông báo lỗi: "Ghi chú đánh giá không được vượt quá 1000 ký tự" (hoặc theo chuẩn thông báo hiện tại của hệ thống) |
| Không nhập (để trống) | Không có lỗi — trường không bắt buộc |

---

## IV. Giao diện

## Có cần thiết kế UI/Prototype không?

* [x] Không — bổ sung thêm một Textarea field theo đúng pattern danh mục hiện có, không cần thiết kế UI riêng

---

## V. Vùng ảnh hưởng

## Chức năng liên quan

| Chức năng | Mức độ ảnh hưởng |
|---|---|
| Tạo mới ngân hàng | Cao |
| Cập nhật ngân hàng | Cao |
| Xem danh sách ngân hàng | Thấp (không thay đổi) |
| Xuất hợp đồng lao động (contract export enum `<BankNote>`) | Thấp — cần Phase 3 verify tính tương thích |

---

## Dữ liệu liên quan

| Đối tượng dữ liệu | Tác động |
|---|---|
| Bản ghi ngân hàng | Lưu thêm nội dung Ghi chú đánh giá |
| Thông tin lương nhân viên (tham chiếu ngân hàng) | Không ảnh hưởng trực tiếp |

---

## Quy trình nghiệp vụ liên quan

* Quy trình tạo mới/cập nhật danh mục ngân hàng — bổ sung bước nhập ghi chú (tùy chọn)
* Không ảnh hưởng các quy trình phê duyệt, tính lương, quản lý nhân sự

---

## VI. Checklist hoàn thành

## Hiện trạng

* [x] Đã xác định màn hình hiện tại
* [x] Đã mô tả luồng thao tác hiện tại
* [x] Đã xác định cấu hình liên quan

## Giải pháp

* [x] Đã mô tả đầy đủ thay đổi nghiệp vụ
* [x] Đã xác định màn hình ảnh hưởng
* [x] Đã liệt kê validate

## Chất lượng

* [x] Đã đánh giá vùng ảnh hưởng
* [x] Đã có tiêu chí nghiệm thu (validate rõ ràng, scope rõ ràng)
* [x] Không còn blocker nghiệp vụ
* [x] Sẵn sàng chuyển sang Phase 3

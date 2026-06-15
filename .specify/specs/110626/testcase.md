# Testcase Template - 110626 - BANKNOTE

> **Tính năng:** Bổ sung trường Ghi chú đánh giá ngân hàng (BankNote)
> **Group:** CAT
> **Alias:** cat_bank
> **Nguồn PBI/User Story:** 110626
> **Người tạo:** /qc_generate
> **Ngày tạo:** 2026-06-12
> **Môi trường:** local — https://pehn02.vnresource.net:4406
> **Tổng TC:** 8 · **Automation:** 7 · **Manual:** 1 · **Chưa test:** 1 · **Pass:** 7 · **Fail:** 0

---

## 1. Phạm Vi Kiểm Thử

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | Kiểm tra chức năng thêm/sửa/xóa trường Ghi chú đánh giá ngân hàng (BankNote) trên form Tạo mới và Cập nhật của màn hình Danh mục > Ngân hàng |
| Trong phạm vi | Form Tạo mới (`/Cat_Bank/Create`), Form Cập nhật (`/Cat_Bank/Edit`); validation maxlength 1000 ký tự; lưu & hiển thị lại giá trị BankNote |
| Ngoài phạm vi | Màn hình danh sách Index (không thay đổi); Excel Grid (`/Cat_BankExcelGrid`); xuất hợp đồng lao động enum `<BankNote>`; phân quyền (kế thừa, không thay đổi) |
| Điều kiện bắt đầu | Ứng dụng HRM9 đã chạy, DB đã có column `BankNote NVARCHAR(1000) NULL`, SP `hrm_cat_sp_get_BankById` đã trả về `BankNote`, user đã đăng nhập với quyền truy cập màn hình Cat_Bank |
| Điều kiện kết thúc | Tất cả TC Auto pass; TC Manual được ghi nhận kết quả thủ công |
| Tài liệu tham chiếu | `.specify/specs/110626/spec.md`, `.specify/specs/110626/plan.md`, `.specify/memory/userflow-cat.md` |

---

## 2. Tiền Điều Kiện Chung

- User có quyền truy cập: `Danh mục > Ngân hàng` (View + Create + Modify)
- Alias màn hình: `cat_bank` → `/Cat_Bank/Index`, `/Cat_Bank/Create`, `/Cat_Bank/Edit/{id}`
- Dữ liệu nền đã tồn tại: Ít nhất 1 bản ghi ngân hàng active trong hệ thống (ví dụ: `BIDV` — `NGÂN HÀNG ĐẦU TƯ VÀ PHÁT TRIỂN VIỆT NAM`)
- Trạng thái hệ thống trước khi test: DB migration đã chạy (`ALTER TABLE Cat_Bank ADD BankNote NVARCHAR(1000) NULL`), SP mới đã deploy, FIELD_INFO.XML đã có entry `BankNote`, label `LANG_VN.XML` hiển thị "Ghi chú đánh giá ngân hàng"

---

## 3. Test Data Chung

| Nhóm dữ liệu | Field | Giá trị mẫu | Ghi chú |
| --- | --- | --- | --- |
| Ngân hàng mới có BankNote | BankName | `NGÂN HÀNG KIỂM THỬ AUTO` | Dùng cho TC001 |
| Ngân hàng mới có BankNote | BankCode | `KTA001` | Unique cho môi trường test |
| Ngân hàng mới có BankNote | BankNote | `Ngân hàng uy tín, lãi suất cạnh tranh. Ưu điểm: phí thấp. Nhược điểm: ít chi nhánh.` | ~88 ký tự |
| Ngân hàng mới không BankNote | BankName | `NGÂN HÀNG KIỂM THỬ TRỐNG GHI CHÚ` | Dùng cho TC002 |
| Ngân hàng mới không BankNote | BankCode | `KTA002` | |
| Ngân hàng hiện có | BankCode | `BIDV` | Dùng cho TC003/TC004 — tham chiếu data-catalog/bank.json |
| Validation 1000 ký tự | BankNote | `[datafake.json → validation.max_length_exact.bank_note_1000chars]` | Đúng boundary — phải lưu thành công |
| Edge case ký tự đặc biệt | BankNote | `O'Brien & <Công ty> -- Lưu ý: ₫ € $ ¥ @#%` + xuống dòng | Multiline + special chars |

---

## 4. Mục Lục Testcase

| TC ID | Tên testcase | Loại | Auto/Manual | Độ ưu tiên | ⭐ | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| [110626_CAT_BANKNOTE_001](#tc-001) | Tạo mới ngân hàng với BankNote có nội dung | Happy Path | Automation | Critical | | ✅ PASSED |
| [110626_CAT_BANKNOTE_002](#tc-002) | Tạo mới ngân hàng, BankNote để trống | Happy Path | Automation | Critical | | ✅ PASSED |
| [110626_CAT_BANKNOTE_003](#tc-003) | Cập nhật ngân hàng — thêm BankNote vào record hiện có | Happy Path | Automation | Critical | | ✅ PASSED |
| [110626_CAT_BANKNOTE_004](#tc-004) | Cập nhật ngân hàng — xóa nội dung BankNote | Happy Path | Automation | High | | ✅ PASSED |
| [110626_CAT_BANKNOTE_005](#tc-005) | Validation: BankNote đúng 1000 ký tự (boundary valid) | Validation | Automation | High | | ✅ PASSED |
| [110626_CAT_BANKNOTE_006](#tc-006) | Validation: BankNote vượt 1000 ký tự — kiểm tra thông báo lỗi | Validation | Manual | High | | ⬜ Chưa test |
| [110626_CAT_BANKNOTE_007](#tc-007) | Edge Case: BankNote chứa ký tự đặc biệt và xuống dòng | Negative / Edge Case | Automation | Medium | | ✅ PASSED |
| [110626_CAT_BANKNOTE_008](#tc-008) | Regression: Danh sách Index không bị ảnh hưởng | Negative / Edge Case | Automation | Medium | | ✅ PASSED |

---

<a id="tc-001"></a>
## 110626_CAT_BANKNOTE_001

**Tên:** Tạo mới ngân hàng với BankNote có nội dung
**Loại:** Happy Path
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** Critical
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Toàn bộ steps thực hiện qua Web browser; verify qua DOM (toast, field value sau reload); không cần data setup đặc biệt.
**Người thực hiện:**
**Ngày thực hiện:**

### Tiền Điều Kiện

- Đã đăng nhập với quyền Create/Modify trên màn hình Cat_Bank
- Mã ngân hàng `KTA001` chưa tồn tại trong DB (hoặc test trên DB sạch)

### Test Data

| Field | Giá trị |
| --- | --- |
| BankName | `NGÂN HÀNG KIỂM THỬ AUTO` |
| BankCode | `KTA001` |
| BankNote | `Ngân hàng uy tín, lãi suất cạnh tranh. Ưu điểm: phí thấp, dịch vụ tốt. Nhược điểm: ít chi nhánh vùng nông thôn.` |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến màn hình `Danh mục > Ngân hàng` qua alias `cat_bank` (`/Cat_Bank/Index`) | | Trang danh sách ngân hàng hiển thị, toolbar có nút **Tạo mới** |
| 2 | Click nút **Tạo mới** | | Navigate sang `/Cat_Bank/Create`; form tạo mới ngân hàng hiển thị với các field: Tên ngân hàng, Mã ngân hàng, Mã SWIFT, **Ghi chú đánh giá ngân hàng** (textarea) |
| 3 | Verify label và control field BankNote hiển thị đúng | | Label "Ghi chú đánh giá ngân hàng" hiển thị; control là textarea (không phải textbox 1 dòng) |
| 4 | Nhập **Tên ngân hàng** | `NGÂN HÀNG KIỂM THỬ AUTO` | Giá trị được nhập vào field |
| 5 | Nhập **Mã ngân hàng** | `KTA001` | Giá trị được nhập vào field |
| 6 | Nhập **Ghi chú đánh giá ngân hàng** | `Ngân hàng uy tín, lãi suất cạnh tranh. Ưu điểm: phí thấp, dịch vụ tốt. Nhược điểm: ít chi nhánh vùng nông thôn.` | Văn bản được nhập vào textarea |
| 7 | Click **Lưu** | | Hệ thống hiển thị toast: **"Lưu thành công"** và redirect về danh sách `cat_bank` |
| 8 | Tìm kiếm record vừa tạo theo mã `KTA001` trong danh sách | | Record `NGÂN HÀNG KIỂM THỬ AUTO` xuất hiện trong grid |
| 9 | Click vào record `KTA001` để mở form Edit (`/Cat_Bank/Edit/{id}`) | | Form Cập nhật mở; field **Ghi chú đánh giá ngân hàng** hiển thị đúng giá trị: `"Ngân hàng uy tín, lãi suất cạnh tranh. Ưu điểm: phí thấp, dịch vụ tốt. Nhược điểm: ít chi nhánh vùng nông thôn."` |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

### Bằng Chứng

| Loại | Đường dẫn/Ghi chú |
| --- | --- |
| Screenshot | |
| Video | |
| Log | |

### Ghi Chú

TC này đồng thời verify: (1) field BankNote hiển thị đúng trên form Create, (2) giá trị lưu được vào DB và hiển thị lại đúng trên form Edit.

---

<a id="tc-002"></a>
## 110626_CAT_BANKNOTE_002

**Tên:** Tạo mới ngân hàng, BankNote để trống — field không bắt buộc
**Loại:** Happy Path
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** Critical
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Verify field optional — toàn bộ thực hiện qua browser; expected result là toast success và không có lỗi validation.

### Tiền Điều Kiện

- Đã đăng nhập với quyền Create trên màn hình Cat_Bank
- Mã ngân hàng `KTA002` chưa tồn tại

### Test Data

| Field | Giá trị |
| --- | --- |
| BankName | `NGÂN HÀNG KIỂM THỬ TRỐNG GHI CHÚ` |
| BankCode | `KTA002` |
| BankNote | _(để trống)_ |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` → Click **Tạo mới** | | Form Tạo mới ngân hàng hiển thị |
| 2 | Nhập **Tên ngân hàng** | `NGÂN HÀNG KIỂM THỬ TRỐNG GHI CHÚ` | Giá trị được nhập |
| 3 | Nhập **Mã ngân hàng** | `KTA002` | Giá trị được nhập |
| 4 | Để trống hoàn toàn field **Ghi chú đánh giá ngân hàng** | _(không nhập gì)_ | Field ở trạng thái rỗng, không hiện validation error |
| 5 | Click **Lưu** | | Hệ thống hiển thị toast: **"Lưu thành công"** — không có thông báo lỗi required field |
| 6 | Mở lại record `KTA002` qua Edit | | Field **Ghi chú đánh giá ngân hàng** hiển thị trống (empty) |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

---

<a id="tc-003"></a>
## 110626_CAT_BANKNOTE_003

**Tên:** Cập nhật ngân hàng hiện có — thêm BankNote
**Loại:** Happy Path
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** Critical
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Navigate đến Edit, nhập BankNote, Lưu, verify toast và reload — tất cả qua browser DOM.

### Tiền Điều Kiện

- Record ngân hàng `BIDV` (BankCode: `BIDV`) tồn tại trong hệ thống (tham chiếu data-catalog/bank.json)
- BankNote của record này hiện đang trống (hoặc sẽ bị ghi đè)

### Test Data

| Field | Giá trị |
| --- | --- |
| BankCode (search) | `BIDV` |
| BankNote (thêm mới) | `Ngân hàng nhà nước uy tín, mạng lưới rộng khắp toàn quốc. Phù hợp cho giao dịch lớn trong nước và quốc tế.` |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` (`/Cat_Bank/Index`) | | Danh sách ngân hàng hiển thị |
| 2 | Tìm kiếm ngân hàng `BIDV` bằng chức năng Tìm kiếm | `BIDV` | Record `NGÂN HÀNG ĐẦU TƯ VÀ PHÁT TRIỂN VIỆT NAM` xuất hiện trong grid |
| 3 | Click vào record BIDV → form Edit mở tại `/Cat_Bank/Edit/{id}` | | Form Cập nhật mở với các field đã điền sẵn; field **Ghi chú đánh giá ngân hàng** hiển thị (có thể trống) |
| 4 | Nhập nội dung vào field **Ghi chú đánh giá ngân hàng** | `Ngân hàng nhà nước uy tín, mạng lưới rộng khắp toàn quốc. Phù hợp cho giao dịch lớn trong nước và quốc tế.` | Văn bản được nhập vào textarea |
| 5 | Click **Lưu** | | Toast: **"Cập nhật thành công"** |
| 6 | Click Edit lại vào cùng record BIDV | | Form Edit mở; field **Ghi chú đánh giá ngân hàng** hiển thị đúng: `"Ngân hàng nhà nước uy tín, mạng lưới rộng khắp toàn quốc. Phù hợp cho giao dịch lớn trong nước và quốc tế."` |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

---

<a id="tc-004"></a>
## 110626_CAT_BANKNOTE_004

**Tên:** Cập nhật ngân hàng — xóa nội dung BankNote (set về trống)
**Loại:** Happy Path
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** High
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Clear textarea → Lưu → Reload → verify trống. Toàn bộ thực hiện qua browser DOM.

### Tiền Điều Kiện

- Record `BIDV` đã có BankNote sau khi chạy TC003 (hoặc tạo mới record có BankNote trước khi chạy TC này)

### Test Data

| Field | Giá trị |
| --- | --- |
| BankCode (search) | `BIDV` |
| BankNote (xóa về) | _(clear — để trống)_ |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` → Tìm và mở form Edit của record `BIDV` | | Form Edit mở; field **Ghi chú đánh giá ngân hàng** có nội dung từ TC003 |
| 2 | Xóa toàn bộ nội dung trong field **Ghi chú đánh giá ngân hàng** (select all → delete) | _(xóa hết)_ | Textarea trở về trống |
| 3 | Click **Lưu** | | Toast: **"Cập nhật thành công"** |
| 4 | Click Edit lại cùng record `BIDV` | | Form Edit mở; field **Ghi chú đánh giá ngân hàng** hiển thị trống |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

---

<a id="tc-005"></a>
## 110626_CAT_BANKNOTE_005

**Tên:** Validation: BankNote đúng 1000 ký tự — boundary valid, phải lưu thành công
**Loại:** Validation
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** High
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Nhập đúng 1000 ký tự (boundary hợp lệ) → Lưu → toast success. Message kỳ vọng là "Lưu thành công" (không phải error message). Verify được qua DOM.

### Tiền Điều Kiện

- Đã đăng nhập với quyền Create
- Mã `KTA005` chưa tồn tại

### Test Data

| Field | Giá trị |
| --- | --- |
| BankName | `NGÂN HÀNG KIỂM THỬ BOUNDARY` |
| BankCode | `KTA005` |
| BankNote | `[datafake.json → validation.max_length_exact.bank_note_1000chars]` — chuỗi đúng 1000 ký tự |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` → Click **Tạo mới** | | Form Create mở |
| 2 | Nhập **Tên ngân hàng** | `NGÂN HÀNG KIỂM THỬ BOUNDARY` | |
| 3 | Nhập **Mã ngân hàng** | `KTA005` | |
| 4 | Nhập **Ghi chú đánh giá ngân hàng** với chuỗi đúng 1000 ký tự | `bank_note_1000chars` từ datafake.json | Textarea nhận đúng 1000 ký tự (không bị cắt, không báo lỗi) |
| 5 | Verify độ dài chuỗi trong textarea bằng JS | `textarea.value.length === 1000` | Console trả về `true` |
| 6 | Click **Lưu** | | Toast: **"Lưu thành công"** — hệ thống không từ chối dữ liệu đúng boundary |
| 7 | Mở Edit record `KTA005` → verify BankNote được lưu đầy đủ 1000 ký tự | | Field BankNote hiển thị đúng 1000 ký tự không mất dữ liệu |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

---

<a id="tc-006"></a>
## 110626_CAT_BANKNOTE_006

**Tên:** Validation: BankNote vượt 1000 ký tự — kiểm tra thông báo lỗi server-side
**Loại:** Validation
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** High
**Trạng thái:** Chưa test
**Cờ thực thi:** Manual
**Lý do Manual:** [TODO: Xác nhận message lỗi chính xác] — Spec ghi "Thông báo lỗi: 'Ghi chú đánh giá không được vượt quá 1000 ký tự' (hoặc theo chuẩn thông báo hiện tại của hệ thống)". Plan chưa xác định `ErrorMessageResourceName` (để là `"..."`). Message thực tế phụ thuộc vào giá trị trong `ConstantMessages` — cần confirm với dev/BA trước khi tự động hóa TC này.

### Tiền Điều Kiện

- Đã đăng nhập với quyền Create
- Mã `KTA006` chưa tồn tại

### Test Data

| Field | Giá trị |
| --- | --- |
| BankName | `NGÂN HÀNG KIỂM THỬ OVER LIMIT` |
| BankCode | `KTA006` |
| BankNote | `[datafake.json → validation.max_length_over.bank_note_1001chars]` — chuỗi 1001 ký tự (bypass maxlength HTML bằng browser devtools hoặc JS injection) |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` → Click **Tạo mới** | | Form Create mở |
| 2 | Nhập BankName, BankCode | `NGÂN HÀNG KIỂM THỬ OVER LIMIT`, `KTA006` | |
| 3 | **Bypass maxlength** HTML bằng Browser DevTools: chọn textarea BankNote, gán `element.removeAttribute('maxlength')`, sau đó paste chuỗi 1001 ký tự | `bank_note_1001chars` từ datafake.json | Textarea chứa 1001 ký tự |
| 4 | Click **Lưu** | | Hệ thống **từ chối lưu** và hiển thị thông báo lỗi validation |
| 5 | Verify nội dung thông báo lỗi | | [TODO: Xác nhận message — dự kiến: `"Ghi chú đánh giá không được vượt quá 1000 ký tự"` hoặc theo chuẩn ConstantMessages của hệ thống — cần confirm với BA/Dev trước khi tự động hóa] |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

### Ghi Chú

**TODO cần clarify:** Xác nhận message lỗi chính xác khi nhập >1000 ký tự. Plan chưa điền `ErrorMessageResourceName` (xem `plan.md` Phase 3, CatBankModel). Sau khi confirm message → có thể chuyển TC này sang Automation.

---

<a id="tc-007"></a>
## 110626_CAT_BANKNOTE_007

**Tên:** Edge Case: BankNote chứa ký tự đặc biệt và xuống dòng — lưu và hiển thị đúng
**Loại:** Negative / Edge Case
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** Medium
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Spec cho phép ký tự đặc biệt và xuống dòng; verify qua DOM sau reload; không cần data DB đặc biệt.

### Tiền Điều Kiện

- Đã đăng nhập với quyền Create
- Mã `KTA007` chưa tồn tại

### Test Data

| Field | Giá trị |
| --- | --- |
| BankName | `NGÂN HÀNG KIỂM THỬ ĐẶC BIỆT` |
| BankCode | `KTA007` |
| BankNote | `O'Brien & <Công ty> -- Lưu ý: ₫ € $ ¥ @#%^*()\nDòng 2: Đặc biệt "nháy kép" 'nháy đơn'\nDòng 3: Mũi tên → ← ↑ ↓` |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` → Click **Tạo mới** | | Form Create mở |
| 2 | Nhập BankName, BankCode | `NGÂN HÀNG KIỂM THỬ ĐẶC BIỆT`, `KTA007` | |
| 3 | Nhập BankNote với ký tự đặc biệt và xuống dòng | `O'Brien & <Công ty> -- Lưu ý: ₫ € $ ¥ @#%^*()\nDòng 2: Đặc biệt "nháy kép" 'nháy đơn'\nDòng 3: Mũi tên → ← ↑ ↓` | Ký tự đặc biệt và xuống dòng được nhập vào textarea |
| 4 | Click **Lưu** | | Toast: **"Lưu thành công"** — hệ thống không bị lỗi XSS sanitization hoặc encoding |
| 5 | Mở Edit record `KTA007` | | Field **Ghi chú đánh giá ngân hàng** hiển thị đúng toàn bộ nội dung bao gồm ký tự đặc biệt, dấu nháy, và xuống dòng được giữ nguyên |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

---

<a id="tc-008"></a>
## 110626_CAT_BANKNOTE_008

**Tên:** Regression: Màn hình danh sách Index không bị ảnh hưởng bởi thay đổi
**Loại:** Negative / Edge Case
**Group:** CAT | **Alias:** cat_bank | **Tính năng:** BANKNOTE
**Độ ưu tiên:** Medium
**Trạng thái:** Chưa test
**Cờ thực thi:** Automation
**Lý do Automation:** Verify các toolbar actions tải đúng, không có cột BankNote trong grid Index (spec: Index không ảnh hưởng). Toàn bộ verify qua DOM.

### Tiền Điều Kiện

- Đã đăng nhập với quyền View/Create/Modify màn hình Cat_Bank

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Navigate đến `cat_bank` (`/Cat_Bank/Index`) | | Trang danh sách ngân hàng tải thành công; không có lỗi JS console |
| 2 | Verify grid danh sách tải dữ liệu ngân hàng | | Grid hiển thị danh sách các ngân hàng (có các cột: Tên ngân hàng, Mã ngân hàng, ...); **cột BankNote không xuất hiện** trong grid |
| 3 | Verify các nút toolbar hoạt động đúng | | Nút **Tạo mới**, **Tìm kiếm**, **Xuất excel**, **Đổi cột** hiển thị; nút **Xóa** disabled khi chưa chọn record |
| 4 | Click **Tìm kiếm** với điều kiện trống → lọc | | Danh sách tải lại bình thường, không lỗi |
| 5 | Chọn 1 record trong grid → Verify nút **Xóa** được enable | | Nút Xóa chuyển sang enabled khi có record được chọn |

### Kết Quả Thực Tế

_(Điền sau khi chạy test)_

---

## 5. Checklist Review

| Tiêu chí | Đạt/Không đạt | Ghi chú |
| --- | --- | --- |
| TC bao phủ happy path chính | Đạt | TC001–TC004: Create với BankNote, Create không BankNote, Update thêm, Update xóa |
| TC bao phủ validation bắt buộc | Đạt | TC005 (boundary valid), TC006 (over limit — Manual pending TODO) |
| TC bao phủ negative/edge case | Đạt | TC007 (special chars + multiline), TC008 (regression Index) |
| Test data đủ rõ để chạy lại | Đạt | Tham chiếu datafake.json với key cụ thể; BankCode unique cho từng TC |
| Expected result có thể assert được | Đạt (trừ TC006) | TC006 chờ clarify message lỗi |
| Phân loại Automation/Manual hợp lý | Đạt | TC006 Manual vì message lỗi chưa xác nhận chính xác |

---

## 6. Quy Ước Placeholder

| Placeholder | Ý nghĩa |
| --- | --- |
| `110626` | Mã PBI/User Story |
| `CAT` | Nhóm chức năng Danh mục (Category) |
| `cat_bank` | Alias màn hình trong `url-aliases.md` — `/Cat_Bank/Index` |
| `BANKNOTE` | Mã tính năng — bổ sung trường BankNote (Ghi chú đánh giá ngân hàng) |
| `Bổ sung trường Ghi chú đánh giá ngân hàng` | Tên tính năng đầy đủ bằng tiếng Việt |
| `bank_note_1000chars` | Key trong datafake.json — chuỗi đúng 1000 ký tự |
| `bank_note_1001chars` | Key trong datafake.json — chuỗi 1001 ký tự (bypass maxlength) |
| `KTA001`–`KTA007` | BankCode dành riêng cho test automation — không xung đột với data thật |

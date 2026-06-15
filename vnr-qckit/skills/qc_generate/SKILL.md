---
description: "Sinh bộ automation test từ spec PBI — tạo testcase.md (danh sách test case), datafake.json (dữ liệu giả có nghĩa nghiệp vụ) và knowledge/*.md (screen-summary, field-catalog). Đọc spec.md, plan.md, flow file, UI mockup, domain knowledge. Dùng khi viết E2E test cho màn hình mới. Yêu cầu: .specify/specs/{PBI_ID}/spec.md và .specify/specs/{PBI_ID}/plan.md phải tồn tại."
argument-hint: "<PBI_ID>"
---

# /qc_generate

S .

---

## User Input

`PBI_ID` = giá trị sau `/qc_generate` (ví dụ: `123`, `PBI-456`). Bắt buộc.

---

## BƯỚC 1 — ĐỌC TÀI LIỆU (song song)

Đọc tất cả đồng thời, không chờ tuần tự:

### INPUT bắt buộc

| File | Ghi chú |
| --- | --- |
| `.specify/specs/{PBI_ID}/spec.md` | **BẮT BUỘC** — thiếu → **DỪNG** |
| `.specify/specs/{PBI_ID}/plan.md` | **BẮT BUỘC** — thiếu → **DỪNG** |
| `.specify/memory/userflow-{group}.md` (ví dụ: `userflow-cat.md`) | **BẮT BUỘC** — thiếu → **DỪNG**, hỏi group màn hình |

### INPUT tùy chọn (đọc nếu có)

| File | Ghi chú |
| --- | --- |
| `.specify/templates/testcase_template.md` | Template chuẩn cho testcase — **đọc trước, ưu tiên dùng cấu trúc này khi sinh testcase.md** |
| `.specify/memory/constitution.md` | Quy tắc dự án |
| `.specify/memory/domain-knowledge.md` | Business domain |
| `.specify/specs/{PBI_ID}/assets/*.png`, `*.jpg` | UI mockup — đọc bằng vision |
| `.specify/tests/data-catalog/categories/` | vendors, customers, units, … |
| Figma link (nếu có trong spec.md) | Đọc qua browser/MCP nếu có thể |

### ĐIỀU KIỆN DỪNG

- `spec.md` không có → DỪNG ngay: ⛔ Không tìm thấy `.specify/specs/{PBI_ID}/spec.md` → Tạo spec trước khi chạy /qc_generate.
- `plan.md` không có → DỪNG ngay: ⛔ Không tìm thấy `.specify/specs/{PBI_ID}/plan.md` → Tạo plan trước khi chạy /qc_generate.
- `userflow` file không có → DỪNG, hỏi user: ⚠️ Không tìm thấy `.specify/memory/userflow-{group}.md` — Group của màn hình là gì? (ví dụ: cat, att, hrm, sal)

---

## BƯỚC 2 — PHÂN TÍCH SPEC

Từ tài liệu đã đọc, trích xuất:

### 2.1 Thông tin màn hình

- **Tên màn hình** và alias URL (từ `url-aliases.md` nếu có)
- **Luồng chính** (happy path): các bước người dùng thực hiện
- **Luồng phụ / ngoại lệ**: validation, empty state, error state
- **Business rules** quan trọng ảnh hưởng đến test

### 2.2 Trường dữ liệu

Từ spec + plan, liệt kê tất cả field:

| Field | Loại | Bắt buộc | Validation | Ghi chú |
| --- | --- | --- | --- | --- |
| tên_field | textbox/combobox/checkbox/date/… | có/không | min/max/pattern | … |

### 2.3 Nhóm test case

Phân loại theo priority:

| Nhóm | Mô tả | Priority |
| --- | --- | --- |
| Luồng chính (happy path) | CRUD cơ bản | P1 |
| Validation | Required fields, format, boundary | P1 |
| Business rule | Logic nghiệp vụ đặc thù | P1 |
| Edge case | Empty state, error response, timeout | P2 |
| Permission | Phân quyền theo role | P2 |

### 2.4 Phân loại Auto / Manual cho từng TC

Với **mỗi test case**, xác định loại thực thi dựa theo tiêu chí sau:

#### ✅ AUTO — Playwright E2E có thể tự động hoàn toàn

Đủ **tất cả** điều kiện:
- Toàn bộ steps thực hiện được qua **Web browser** (navigate, click, input, submit)
- Kết quả verify được qua **DOM** (toast text, element state, grid row, field value)
- Data setup thực hiện được qua **UI steps** hoặc **API** trước khi test
- Selector xác định được từ label, placeholder, hoặc field name (`inputTextbox`, `inputCombobox`, `inputCheckbox`)
- Message lỗi kỳ vọng đã được **xác định rõ** (không phải `[TODO]`)

#### 🖐 MANUAL — Phải thực hiện thủ công

Có **ít nhất 1** điều kiện:
- Platform **không phải Web** (App mobile, Portal Angular nếu không có URL test, màn hình print)
- Yêu cầu **visual inspection** (layout, responsive, color, animation)
- Steps yêu cầu **thiết bị vật lý** (quét thẻ, GPS, camera)
- Logic **không trigger được qua UI** mà chỉ qua backend/API trực tiếp
- **Message lỗi chưa xác định** (open item / `[TODO]`) — không thể verify
- Data setup yêu cầu **trạng thái DB cụ thể** không tạo được qua UI (ví dụ: cần đơn Hủy/Từ chối sẵn, cần N đơn active chính xác)
- Một phần kết quả cần **verify thủ công** (ví dụ: check DB trực tiếp, kiểm tra email gửi đi)
- TC test **cross-platform consistency** (so sánh kết quả Web vs App vs Portal)

#### Bảng tham chiếu nhanh

| Tình huống | Loại |
| --- | --- |
| Navigate → input → click → verify toast | Auto |
| Verify field value sau khi lưu | Auto |
| Hard block với message text đã biết | Auto |
| Hard block với message text chưa biết (TODO) | Manual |
| Cần tạo N đơn active sẵn trong DB | Manual |
| Cần đơn Hủy/Từ chối sẵn — khó tạo qua UI | Manual |
| Verify trạng thái đơn cũ không bị ảnh hưởng | Auto (nếu verify được qua DOM) |
| App mobile | Manual |
| Portal Angular (URL khác) | Manual (nếu không có test URL) |
| So sánh kết quả Web vs App | Manual |
| Visual / responsive check | Manual |

---

## BƯỚC 3 — SINH testcase.md

Ghi vào `.specify/specs/{PBI_ID}/testcase.md`:

> ⚠️ **Tên file bắt buộc**: `testcase.md` — viết thường toàn bộ, không phải `testCase.md` hay `TestCase.md`.
> Nếu file đã tồn tại với tên khác (ví dụ `testCase.md`) → đọc nội dung cũ, ghi đè vào đúng tên `testcase.md`, xóa file cũ nếu cần.

### 3.0 Ưu tiên dùng testcase_template.md

Nếu `.specify/templates/testcase_template.md` **tồn tại** (đã đọc ở Bước 1):

- **Dùng cấu trúc của template** làm khung sinh testcase.md — bao gồm tất cả sections (Phạm Vi Kiểm Thử, Tiền Điều Kiện Chung, Test Data Chung, Mục Lục Testcase, từng TC với bảng bước, Checklist Review)
- Thay thế tất cả placeholder `{{...}}` bằng giá trị thực từ spec/plan/domain-knowledge
- **TC ID format** lấy từ template: `{PBI_ID}_{GROUP}_{FEATURE_CODE}_{NNN}` (ví dụ: `15552_CAT_CHUYENKHO_001`)
- **Bảng bước** dùng format 4 cột: `# | Hành động | Test Data | Kết quả mong đợi`
- Giữ nguyên **Section 5 - Checklist Review** và **Section 6 - Quy Ước Placeholder** từ template

Nếu template **không tồn tại** → dùng Format testcase chuẩn bên dưới.

### Format testcase chuẩn (fallback khi không có template)

**Tiêu đề file:**

> # Test Cases — {Tên màn hình}
> PBI: {PBI_ID} | Sinh bởi /qc_generate — {ISO_DATE} | Spec: `.specify/specs/{PBI_ID}/spec.md`

**Bảng tóm tắt:**

| Nhóm | Auto | Manual | Tổng | Priority |
| --- | --- | --- | --- | --- |
| Happy path | n | n | n | P1 |
| Validation | n | n | n | P1 |
| Business rule | n | n | n | P1 |
| Edge case | n | n | n | P2 |
| **Tổng** | **n** | **n** | **n** | — |

**Mỗi TC:**

**TC-001 — {Tên test case}**

**Mục tiêu**: {Mô tả ngắn gọn}
**Priority**: P1 / P2
**Loại**: ✅ Auto / 🖐 Manual
**Lý do loại**: {1 dòng giải thích}
**Nhóm**: Happy path / Validation / Business rule / Edge case

**Tiền điều kiện**:
- Đã đăng nhập với role {role}

**Bước thực hiện**:
1. Điều hướng đến {URL alias}
2. {Hành động cụ thể}
3. …

**Kết quả mong đợi**:
- {Kết quả có thể đo được}
- Toast: "{nội dung thông báo}"

### Quy tắc viết test case (áp dụng cả hai format)

- Mỗi step mô tả hành động cụ thể: navigate, click, input, submit
- Kết quả mong đợi phải **đo được** — không dùng "thành công" chung chung
- Tham chiếu data từ `datafake.json` bằng key: `{datafake.ten_nhan_su}`
- Với table: mô tả rõ số dòng, từng cột và giá trị
- Với validation: ghi rõ message lỗi kỳ vọng (từ spec hoặc domain-knowledge)
- **Loại TC phải có `Lý do loại`** — 1 dòng giải thích ngắn, đủ để reviewer hiểu tại sao không phải Auto
- **Mặc định là Auto** — chỉ chuyển Semi-Auto/Manual khi có lý do cụ thể theo tiêu chí Bước 2.4

> 💡 **TC ID**: Khi dùng template chuẩn (Section 3.0), đặt TC ID theo format `{PBI_ID}_{GROUP}_{FEATURE_CODE}_{NNN}`.
> Khi không có template → dùng `TC-NNN` như fallback.

#### Ví dụ gán loại TC

- **Auto**: TC-001 navigate → input → click Lưu → verify toast; TC-008 hard block với message text đã biết
- **Manual**: TC-014 cần đơn Hủy sẵn trong DB; TC-017 cần đơn Đã duyệt sẵn trước khi Admin đổi config; TC-019 message lỗi chưa xác định [TODO]; TC-020 App mobile; TC-021 cross-platform Web vs Portal vs App

---

## BƯỚC 4 — SINH datafake.json

Ghi vào `.specify/tests/playwright/{PBI_ID}/datafake.json` với cấu trúc:

- `_meta`: pbi, generated, screen
- `happy_path`: các field với giá trị hợp lệ điển hình
- `validation.required_empty`: field để trống
- `validation.max_length`: chuỗi vượt max+1 ký tự
- `validation.invalid_format`: giá trị sai format (email, phone…)
- `edge_cases.special_chars`: ký tự đặc biệt như `O'Brien & <Co>`

### Nguồn dữ liệu ưu tiên

1. **data-catalog** (`.specify/tests/data-catalog/categories/`) — dùng record thực tế nếu có
2. **domain-knowledge** — dùng giá trị phù hợp nghiệp vụ (không dùng "test123")
3. **Sinh theo type** — email, phone, date, number theo đúng format VN nếu không có catalog

---

## BƯỚC 5 — SINH knowledge/*.md

Ghi vào `.specify/tests/knowledge/{PBI_ID}/`:

### 5.1 screen-summary.md

Ghi các mục: Tên màn hình, PBI, Sinh ngày, Mục đích (1-2 câu), Bảng URL (Alias / Path / Mô tả), Luồng chính (danh sách bước), Business rules quan trọng (BR-01…), Các màn hình liên quan.

### 5.2 field-catalog.md

Bảng gồm các cột: Field | Selector hint | Loại | Bắt buộc | Validation | Ghi chú

---

## BƯỚC 6 — CẬP NHẬT _IMPACT_INDEX.json

Luôn thực hiện bước này — tạo mới nếu chưa có, cập nhật nếu đã có.

### 6.1 Tạo mới nếu chưa tồn tại

Nếu `.specify/tests/knowledge/_IMPACT_INDEX.json` **chưa tồn tại**:

- Tạo thư mục `.specify/tests/knowledge/` nếu chưa có
- Ghi file với cấu trúc: `_meta` (description, created, updated) và mảng `entries` (pbi, screen, knowledge_path, generated)

### 6.2 Cập nhật nếu đã tồn tại

Nếu file **đã tồn tại**:

- Đọc nội dung hiện tại
- Nếu đã có entry với `pbi == {PBI_ID}` → **cập nhật** `generated` và `screen`
- Nếu chưa có → **append** entry mới vào mảng `entries`
- Cập nhật `_meta.updated` thành ISO date hiện tại

---

## BÁO CÁO KẾT QUẢ

In ra sau khi hoàn thành, bao gồm:

**OUTPUT:**
- `testcase.md`: tổng số TC, số Auto (P1/P2), số Manual (P1/P2)
- `datafake.json`: số datasets
- `knowledge/`: screen-summary.md, field-catalog.md
- `_IMPACT_INDEX.json`: created hoặc updated

**Tài liệu đã đọc:** spec.md ✅, plan.md ✅, constitution.md [v/−], domain-knowledge.md [v/−], userflow-{group}.md [v/−], assets/ [v/−], data-catalog [v/−]

**TC cần chú ý:** danh sách TC Manual kèm lý do ngắn

**Đề xuất làm rõ** (nếu có TC chứa [TODO]): từng TC-ID → điểm chưa rõ → câu hỏi cụ thể cần hỏi BA/PO

**Bước tiếp theo:**
- Chạy `/vnr-qckit:qc_auto_test {PBI_ID}` để tự động hóa các TC Auto
- Chuẩn bị data setup cho TC Manual
- Clarify các TC có [TODO] trước khi chạy test

---

## QUY TẮC

- **`spec.md` và `plan.md` đều bắt buộc** — thiếu một trong hai → DỪNG ngay, không sinh output.
- **`testcase_template.md` có → ưu tiên dùng cấu trúc template** (Bước 3.0): TC ID `{PBI_ID}_{GROUP}_{FEATURE_CODE}_{NNN}`, bảng bước 4 cột, đủ section Phạm Vi/Tiền ĐK/Test Data/Mục Lục/Checklist. Template không có → dùng format fallback `TC-NNN`.
- **`_IMPACT_INDEX.json` luôn được tạo/cập nhật** ở Bước 6 — không cần tạo thủ công trước.
- Không tự sửa `spec.md`, `plan.md` hay bất kỳ file INPUT nào.
- Nếu thiếu thông tin để sinh test case chính xác → ghi `[TODO: cần clarify]` vào test case đó, không bỏ qua.
- **Mỗi TC có `[TODO]` phải được liệt kê trong mục "Đề xuất làm rõ"** của báo cáo kết quả — ghi rõ điểm chưa rõ và câu hỏi cụ thể cần hỏi BA/PO.
- Data fake phải có ý nghĩa nghiệp vụ — không dùng `foo`, `bar`, `test123`.
- **Mỗi TC phải có field `Loại` và `Lý do loại`** — không được bỏ trống.
- **Mặc định là Auto** — chỉ chuyển Manual khi có lý do cụ thể theo tiêu chí Bước 2.4.
- Nếu TC có thể chia nhỏ thành phần Auto + phần Manual → tách thành 2 TC riêng thay vì gán Manual toàn bộ.
- TC có `[TODO]` trong message lỗi → gán **Manual** (không thể verify tự động khi chưa có text).

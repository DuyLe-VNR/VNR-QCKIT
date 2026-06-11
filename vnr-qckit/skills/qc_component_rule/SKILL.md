---
description: "Đọc các file component_*.md trong .specify/memory/components/, tổng hợp component types mới chưa có rule, tra cứu DOM HTML mẫu và cập nhật định nghĩa selector vào .specify/rules/component-rule.md."
argument-hint: ""
---

# /qc_component_rule

Đọc toàn bộ folder `.specify/memory/components/`, tổng hợp các component types mới từ files `component_*.md` (sinh bởi `/qc_detect_component`), đối chiếu với `component-rule.md` hiện tại, rồi **chỉ thêm/cập nhật** các component chưa có hoặc cần cập nhật rule vào file: `.specify/rules/component-rule.md`.

---

## BƯỚC 0 — Quét folder `.specify/memory/components/`

### 0.1 Phân loại files trong folder

| File pattern | Mục đích |
| --- | --- |
| `component_*.md` | Danh sách component types phát hiện theo từng screen (sinh bởi qc_detect_component) |

### 0.2 Điều kiện dừng

Nếu **không tìm thấy bất kỳ file `component_*.md` nào** trong folder → dừng và báo:

```
⛔ Không tìm thấy file component_*.md trong folder:
  .specify/memory/components/

Chạy /qc_detect_component trước để sinh các file component_*.md cho từng screen.
```

---

## BƯỚC 1 — Đọc file đích hiện tại và reference DOM

Đọc đồng thời:

| File | Mục đích |
| --- | --- |
| `.specify/rules/component-rule.md` | File đích — đọc để biết component nào **đã có rule** |
| `{PLUGIN_DIR}/templates/template-component-rule.md` | Template chuẩn để hiểu format output (nếu tồn tại) |
| `{PLUGIN_DIR}/detected_components/components.md` | DOM HTML reference cho Angular components (nếu tồn tại) |
| `{PLUGIN_DIR}/components_core.md` | DOM HTML reference cho Kendo/legacy components (nếu tồn tại) |

Nếu file `.specify/rules/component-rule.md` chưa tồn tại → sẽ tạo mới ở Bước 4.

---

## BƯỚC 2 — Tổng hợp component types mới từ tất cả `component_*.md`

### 2.1 Đọc từng file `component_*.md` trong `.specify/memory/components/`

Với mỗi file, trích xuất tên section headers có pattern:
```
## {COMPONENT_TYPE} — {mô tả} ({n} fields/buttons)
```
hoặc dạng rút gọn:
```
## {COMPONENT_TYPE} ({n} fields)
```

Ví dụ ánh xạ:
- `## k-textbox — input text (4 fields)` → `COMPONENT_TYPE = k-textbox`
- `## k-combobox — dropdown (3 fields)` → `COMPONENT_TYPE = k-combobox`
- `## checkbox — input checkbox (27 fields)` → `COMPONENT_TYPE = checkbox`
- `## k-button — Kendo Button (4 buttons)` → `COMPONENT_TYPE = k-button`
- `## k-datepicker — Kendo DatePicker (8 fields)` → `COMPONENT_TYPE = k-datepicker`
- `## k-timepicker — Kendo TimePicker (2 fields)` → `COMPONENT_TYPE = k-timepicker`
- `## k-select — Kendo DropDownList` → `COMPONENT_TYPE = k-select`
- `## textarea (4 fields)` → `COMPONENT_TYPE = textarea`
- `## numeric — input số (3 fields)` → `COMPONENT_TYPE = numeric`
- `## text-formula (1 fields)` → `COMPONENT_TYPE = text-formula`
- `## vnr-input`, `## vnr-combobox`, `## vnr-button` → tương tự

### 2.2 Deduplicate — danh sách unique component types

Thu thập tất cả COMPONENT_TYPE từ mọi file, loại bỏ trùng lặp. Kết quả là danh sách ứng viên.

### 2.3 Lọc component **chưa có** hoặc **cần cập nhật** trong `component-rule.md`

So sánh danh sách ứng viên với entries hiện có trong `.specify/rules/component-rule.md`:

| Trạng thái | Hành động |
| --- | --- |
| Chưa có entry `## {COMPONENT_TYPE}` | → Đưa vào danh sách **NEW** — sẽ thêm mới |
| Đã có entry nhưng có `[TODO: cần clarify selector]` | → Đưa vào danh sách **INCOMPLETE** — hỏi user có muốn cập nhật không |
| Đã có entry đầy đủ | → Đưa vào danh sách **SKIP** — không xử lý |

**Nếu tất cả component đều đã có rule đầy đủ**, báo và dừng:

```
✅ Tất cả component types trong .specify/memory/components/ đều đã có rule đầy đủ.

Không có gì cần cập nhật trong .specify/rules/component-rule.md.

Nếu muốn ghi đè rule cụ thể, chạy lại với tham số tên component:
  /qc_component_rule k-textbox
```

### 2.4 Xử lý tham số đầu vào (optional)

Nếu user truyền tham số tên component (ví dụ: `/qc_component_rule k-textbox`):
- Chỉ xử lý component đó, bỏ qua bước 2.3 (force update ngay cả khi đã có rule)
- Áp dụng Bước 3–4 chỉ cho component được chỉ định

---

## BƯỚC 3 — Phân tích DOM cho từng component NEW / INCOMPLETE

### 3.1 Tìm DOM HTML mẫu

Với mỗi COMPONENT_TYPE cần xử lý, tìm DOM HTML mẫu theo thứ tự ưu tiên:

| Ưu tiên | Nguồn | Cách tìm |
| --- | --- | --- |
| 1 | `.specify/memory/components/components.md` (nếu có) | Tìm block chứa `controll {COMPONENT_TYPE}` hoặc `component {COMPONENT_TYPE}` |
| 2 | `{PLUGIN_DIR}/detected_components/components.md` | Tìm block tương tự |
| 3 | `{PLUGIN_DIR}/components_core.md` | Tìm block tương tự |
| 4 | Không tìm thấy | Đánh dấu `[NO_DOM]` |

Nếu tìm thấy DOM HTML → tiếp tục phân tích theo Bước 3.2 – 3.4.
Nếu `[NO_DOM]` → sinh entry skeleton với `[TODO: cần clarify selector]`.

### 3.2 Trích xuất các trường từ DOM block

| Trường | Pattern tìm kiếm | Ví dụ |
| --- | --- | --- |
| `COMPONENT_NAME` | `controll {NAME}` hoặc tên section `## {NAME}` | `k-textbox` |
| `CONTAINER` | `container là tag "{VALUE}"` hoặc `container là "{VALUE}"` | `div` |
| `LABEL_SELECTOR` | `label là "{VALUE}"` | `div.FieldTitle label` |
| `INPUT_SELECTOR` | `input là "{VALUE}"` | `div.FieldValue input` |
| `DOM_HTML` | Chuỗi HTML dài cuối block (bắt đầu bằng `<`) | `<div id="div2">...</div>` |

> **Lưu ý:** Một số component (ví dụ `checkbox`, `k-button`) có thể không có `input` riêng biệt — trường INPUT_SELECTOR sẽ là chính element đó.

### 3.3 Bổ sung selector động từ phân tích DOM

Phân tích cấu trúc DOM để tìm thêm:

| Loại | Tìm trong DOM | Ghi chú |
| --- | --- | --- |
| Placeholder | `input[placeholder]` hoặc `nz-select-placeholder` | Nếu tồn tại trong HTML |
| Count suffix | `.vnr-input-show-count-suffix` | Chỉ có ở vnr-input |
| Validate area | `.validate-area` | Nếu tồn tại |
| Icon | `span.anticon`, `span[nz-icon]` | Nếu tồn tại |
| Search input (select) | `nz-select-search input` | Chỉ có ở vnr-combobox/select |
| Date input | `input.k-input` | Kendo DatePicker |
| Time input | `input.k-input` | Kendo TimePicker |

### 3.4 Quy tắc phân tích DOM

- Bỏ qua attribute động: `_ngcontent-*`, `ng-tns-*`, `id`, `style`, class sinh bởi Angular
- Chỉ giữ class **tĩnh, có nghĩa ngữ nghĩa** (ví dụ `ant-btn`, `vnr-btn-title`, `k-textbox`, `FieldTitle`)
- Selector phải là **CSS path ngắn nhất** từ container đến target
- Không dùng `id` làm selector vì Angular/Kendo thường tạo id dynamic

---

## BƯỚC 4 — Xác nhận trước khi ghi

### 4.1 Hiển thị preview danh sách thay đổi

Trước khi ghi vào file, hiển thị tóm tắt:

```
📋 Thay đổi sẽ được ghi vào .specify/rules/component-rule.md:

  + NEW       : {COMPONENT_NAME_1}  ({n} selectors)
  + NEW       : {COMPONENT_NAME_2}  ({n} selectors — skeleton, [TODO])
  ~ UPDATE    : {COMPONENT_NAME_3}  (thay thế entry [TODO] bằng selector thực)

Tổng: {n_new} thêm mới, {n_update} cập nhật, {n_skip} bỏ qua

Xác nhận ghi? (y / n):
```

Nếu user nhập `n` → dừng, không ghi gì.

### 4.2 Xử lý component INCOMPLETE (đã có [TODO])

Nếu một entry đã tồn tại nhưng chứa `[TODO: cần clarify selector]` và bây giờ có thể sinh selector thực:
- Xóa entry cũ trong file
- Thêm entry mới với selector đầy đủ ở cuối file (hoặc vị trí cũ nếu muốn giữ thứ tự)

---

## BƯỚC 5 — Ghi `.specify/rules/component-rule.md`

### 5.1 Tạo thư mục nếu chưa có

```powershell
$dir = ".specify\rules"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
```

### 5.2 Format entry chuẩn — ghi append vào cuối file

```markdown
---

## {COMPONENT_NAME}

Container: tag {COMPONENT_NAME}

Input selector: {input_selector}

Label của control: {label_selector}

/* Container */
{container_selector}

/* Truy cập input */
{container_selector} {input_selector}

/* Label gắn với control */
{container_selector} {label_selector}

/* Gợi ý lấy label text */
{container_selector} {label_selector}
```

Nếu có selector bổ sung từ phân tích DOM, thêm ngay sau:

```markdown
/* Placeholder */
{container_selector} {input_selector}[placeholder]

/* Suffix / Count */
{container_selector} {suffix_selector}
```

**Entry skeleton cho component `[NO_DOM]`:**
```markdown
---

## {COMPONENT_NAME}

Container: tag {COMPONENT_NAME}

Input selector: [TODO: cần clarify selector]

Label của control: [TODO: cần clarify selector]

/* Container */
{COMPONENT_NAME}

/* Truy cập input */
[TODO: cần clarify selector]

/* Label gắn với control */
[TODO: cần clarify selector]
```

### 5.3 Ví dụ output hoàn chỉnh theo loại

**vnr-input:**
```markdown
---

## vnr-input

Container: tag vnr-input

Input selector: nz-input-group input

Label của control: nz-form-label label

/* Container */
vnr-input

/* Truy cập input */
vnr-input nz-input-group input

/* Label gắn với control */
vnr-input nz-form-label label

/* Gợi ý lấy label text */
vnr-input nz-form-label label

/* Placeholder */
vnr-input nz-input-group input[placeholder]

/* Count suffix */
vnr-input .vnr-input-show-count-suffix
```

**vnr-combobox:**
```markdown
---

## vnr-combobox

Container: tag vnr-combobox

Input selector: nz-form-control nz-select

Label của control: nz-form-label label

/* Container */
vnr-combobox

/* Truy cập input (select control) */
vnr-combobox nz-form-control nz-select

/* Input search bên trong select */
vnr-combobox nz-select-search input

/* Label gắn với control */
vnr-combobox nz-form-label label

/* Gợi ý lấy label text */
vnr-combobox nz-form-label label

/* Placeholder */
vnr-combobox nz-select-placeholder
```

**k-textbox (Kendo MVC):**
```markdown
---

## k-textbox

Container: div chứa div.FieldTitle và div.FieldValue

Input selector: div.FieldValue input.k-textbox

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Truy cập input */
div.FieldValue input.k-textbox

/* Label gắn với control */
div.FieldTitle label

/* Gợi ý lấy label text */
div.FieldTitle label
```

**k-combobox (Kendo):**
```markdown
---

## k-combobox

Container: span.k-widget.k-combobox

Input selector: input.k-input

Label của control: [TODO: tùy context — thường là label liền trước]

/* Container */
span.k-combobox

/* Truy cập input */
span.k-combobox input.k-input

/* Dropdown button */
span.k-combobox span.k-select
```

**k-button (Kendo):**
```markdown
---

## k-button

Container: a.k-button hoặc button.k-button

Input selector: (chính element)

Label của control: text content của element

/* Container */
a.k-button

/* Button với icon */
a.k-button span.k-icon

/* Text label */
a.k-button
```

**checkbox (native Kendo MVC):**
```markdown
---

## checkbox

Container: div chứa div.FieldTitle150 và div.FieldValue

Input selector: div.FieldValue input[type="checkbox"]

Label của control: div.FieldTitle150 label

/* Container */
div:has(div.FieldTitle150)

/* Input checkbox */
div.FieldValue input[type="checkbox"]

/* Label */
div.FieldTitle150 label
```

**k-datepicker:**
```markdown
---

## k-datepicker

Container: span.k-widget.k-datepicker

Input selector: input.k-input

Label của control: [TODO: tùy context]

/* Container */
span.k-datepicker

/* Input ngày */
span.k-datepicker input.k-input

/* Nút mở calendar */
span.k-datepicker span.k-select
```

**k-timepicker:**
```markdown
---

## k-timepicker

Container: span.k-widget.k-timepicker

Input selector: input.k-input

Label của control: [TODO: tùy context]

/* Container */
span.k-timepicker

/* Input giờ */
span.k-timepicker input.k-input

/* Nút mở time picker */
span.k-timepicker span.k-select
```

**k-select (Kendo DropDownList):**
```markdown
---

## k-select

Container: span.k-widget.k-dropdown

Input selector: span.k-input

Label của control: [TODO: tùy context]

/* Container */
span.k-dropdown

/* Giá trị hiển thị */
span.k-dropdown span.k-input

/* Nút mở dropdown */
span.k-dropdown span.k-select
```

**textarea:**
```markdown
---

## textarea

Container: div chứa div.FieldTitle và div.FieldValue

Input selector: div.FieldValue textarea

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Textarea */
div.FieldValue textarea

/* Label */
div.FieldTitle label
```

**numeric:**
```markdown
---

## numeric

Container: div chứa div.FieldTitle và div.FieldValue (input type="number" hoặc k-numerictextbox)

Input selector: div.FieldValue input[type="number"]

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Input số */
div.FieldValue input[type="number"]

/* Hoặc Kendo NumericTextBox */
span.k-numerictextbox input.k-input

/* Label */
div.FieldTitle label
```

**text-formula:**
```markdown
---

## text-formula

Container: div chứa div.FieldTitle và div.FieldValue (input công thức / expression editor)

Input selector: div.FieldValue input[type="text"]

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Input công thức */
div.FieldValue input[type="text"]

/* Label */
div.FieldTitle label
```

---

## BƯỚC 6 — Cập nhật metadata header trong `component-rule.md`

Sau khi ghi xong, cập nhật dòng metadata ở đầu file:

```markdown
> Sinh bởi: /qc_component_rule — {YYYY-MM-DD}
> Nguồn: .specify/memory/components/ ({n} files: {file1}.md, {file2}.md, ...)
```

---

## BƯỚC 7 — Báo cáo tổng hợp

```text
[v] qc_component_rule hoàn thành

Nguồn    : .specify/memory/components/ ({n} files component_*.md)
File đích: .specify/rules/component-rule.md

Screens đã quét:
  → component_{screen1}.md ({n} component types)
  → component_{screen2}.md ({n} component types)
  ...

Kết quả xử lý:
  ✔ {COMPONENT_NAME_1}  → CREATED   ({n} selectors)
  ✔ {COMPONENT_NAME_2}  → UPDATED   (thay thế [TODO] bằng selector thực)
  - {COMPONENT_NAME_3}  → SKIPPED   (đã có rule đầy đủ)
  ? {COMPONENT_NAME_4}  → TODO      (không tìm thấy DOM HTML mẫu)

Tổng: {total} component — {created} tạo mới, {updated} cập nhật, {skipped} bỏ qua, {todo} cần bổ sung DOM

Bước tiếp theo:
  → Dùng selector trong Page Object khi viết test
  → Với các entry [TODO]: cung cấp DOM HTML mẫu rồi chạy lại /qc_component_rule {COMPONENT_NAME}
  → Chạy /qc_map_flow để tạo Page Object tham chiếu các selector này
  → Chạy /qc_generate để sinh test case tham chiếu các component này
```

---

## QUY TẮC

- **Nguồn dữ liệu duy nhất**: luôn đọc từ `.specify/memory/components/` — đây là output của `/qc_detect_component`, khác với `{PLUGIN_DIR}/detected_components/` dùng bởi `/qc_init_component`.
- **File đích**: luôn ghi vào `.specify/rules/component-rule.md` (đường dẫn tương đối từ project root).
- **Chỉ thêm/cập nhật rule mới** — không xóa hay thay đổi các entry đã có và đầy đủ, trừ khi user chỉ định tên component cụ thể hoặc chọn ghi đè.
- **Dedup theo type**: nếu một component type xuất hiện trong nhiều `component_*.md` → chỉ sinh **một entry duy nhất** trong `component-rule.md`.
- **Luôn xác nhận trước khi ghi** (Bước 4.1) — không tự động ghi đè mà không có sự đồng ý của user.
- Selector phải **test được ngay** bằng `document.querySelector(selector)` trong DevTools.
- Nếu DOM quá phức tạp, không xác định được selector → ghi `[TODO: cần clarify selector]` và báo user.
- Không dùng `id` làm selector vì id Angular/Kendo thường là dynamic.
- Xử lý **tuần tự từng component type** đã tổng hợp — không bỏ sót loại nào.

---

## SO SÁNH VỚI `/qc_init_component`

| Tiêu chí | `/qc_init_component` | `/qc_component_rule` |
| --- | --- | --- |
| Nguồn đọc | `{PLUGIN_DIR}/detected_components/` | `.specify/memory/components/` |
| File pattern | `component_temp_*.md` | `component_*.md` |
| Đường dẫn file đích | Hard-coded `D:\SourceCode\...` | Tương đối `.specify/rules/` |
| Hành vi với rule cũ | Hỏi ghi đè từng cái | Chỉ xử lý NEW + INCOMPLETE |
| Xác nhận trước khi ghi | Từng component | Một lần cho toàn bộ batch |
| Hỗ trợ tham số component | Không | Có (`/qc_component_rule k-textbox`) |
| Cập nhật metadata header | Không | Có |

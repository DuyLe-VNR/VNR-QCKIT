---
description: "Đọc url-page-map.md, sinh sub-system-map.json (mapping màn hình → group) lưu tại .specify/memory. Dùng để kiểm tra Group / Màn hình khi sinh testcase.md."
argument-hint: ""
---

# /qc_sub-system-map

Đọc `.specify/tests/pages/url-page-map.md`, trích xuất danh sách màn hình đã có Page Object, ánh xạ từng màn hình sang `group` và `ma_man_hinh`, rồi sinh file `.specify/memory/sub-system-map.json`.

---

## BƯỚC 0 — Kiểm tra điều kiện

Kiểm tra file bắt buộc:

| File | Mục đích |
| --- | --- |
| `.specify/tests/pages/url-page-map.md` | Nguồn dữ liệu duy nhất |

Nếu **không tồn tại** → **DỪNG ngay**:
```
⛔ Không tìm thấy .specify/tests/pages/url-page-map.md
   → Chạy /qc_url_page_map trước để sinh file này.
```

Nếu tồn tại → tiếp tục BƯỚC 1.

---

## BƯỚC 1 — Đọc bảng "Đã có Page Object"

Đọc toàn bộ nội dung `.specify/tests/pages/url-page-map.md`.

Tìm section **"## Đã có Page Object"** — đây là bảng duy nhất cần xử lý.

Bảng có cấu trúc:
```markdown
| Alias | URL Path | Mô tả | Page Class | Page File | Locator Class | Locator File |
| --- | --- | --- | --- | --- | --- | --- |
| att_leave_day | /Att_LeaveDay/Index | DS Ngày nghỉ | AttLeaveDayPage | att/att_leave_day/AttLeaveDayPage.ts | AttLeaveDayLocator | att/AttLeaveDayLocator.ts |
```

Thu thập mỗi dòng dữ liệu (bỏ qua header và separator `| --- |`):
```
rows_raw = [
  {
    alias:         "att_leave_day",
    url_path:      "/Att_LeaveDay/Index",
    mo_ta:         "DS Ngày nghỉ",
    page_class:    "AttLeaveDayPage",
    page_file:     "att/att_leave_day/AttLeaveDayPage.ts",
    locator_class: "AttLeaveDayLocator",
    locator_file:  "att/AttLeaveDayLocator.ts"
  },
  ...
]
```

> Chỉ lấy dòng trong section "Đã có Page Object". Dừng đọc khi gặp `---` hoặc section `##` tiếp theo.

---

## BƯỚC 2 — Trích xuất `group` và `ma_man_hinh` từ cột Page File

Với **mỗi row**, áp dụng hai quy tắc lên giá trị cột **Page File** (đường dẫn tương đối từ `.specify/tests/pages/`):

### Quy tắc lấy `group`
Lấy **segment đầu tiên** của đường dẫn (phân cách bằng `/`).

| Page File | group |
| --- | --- |
| `att/att_leave_day/AttLeaveDayPage.ts` | `att` |
| `cat/cat_leave_day_type/CatLeaveDayTypePage.ts` | `cat` |
| `CA/CAProcess/CAProcessPage.ts` | `CA` |
| `hre/HreProfilePage.ts` | `hre` |

> Giữ nguyên casing của segment (không tự động uppercase hay lowercase).

### Quy tắc lấy `ma_man_hinh`
Lấy **segment thứ hai** của đường dẫn, nếu có.  
Nếu chỉ có 1 segment (file nằm thẳng dưới root pages/) → dùng tên file bỏ suffix `Page.ts`.

| Page File | Segment thứ 2 | ma_man_hinh |
| --- | --- | --- |
| `att/att_leave_day/AttLeaveDayPage.ts` | `att_leave_day` | `att_leave_day` |
| `cat/cat_leave_day_type/CatLeaveDayTypePage.ts` | `cat_leave_day_type` | `cat_leave_day_type` |
| `CA/CAProcess/CAProcessPage.ts` | `CAProcess` | `CAProcess` |
| `hre/HreProfilePage.ts` | *(không có)* | `HreProfile` |

> Ưu tiên segment thứ 2 của đường dẫn. Nếu không có → fallback lấy tên file bỏ `.ts` và suffix `Page`.

### Lấy `ten_man_hinh`
Lấy từ cột **Mô tả** (`mo_ta`) trong bảng url-page-map.md.

### Xây dựng đường dẫn đầy đủ `pageObject` và `locator`

Từ `page_file` và `locator_file` (đường dẫn tương đối từ `.specify/tests/pages/`), tạo đường dẫn đầy đủ:

```
pageObject = ".specify/tests/pages/" + page_file
locator    = ".specify/tests/pages/" + locator_file
```

| page_file | locator_file | pageObject | locator |
| --- | --- | --- | --- |
| `att/att_leave_day/AttLeaveDayPage.ts` | `att/AttLeaveDayLocator.ts` | `.specify/tests/pages/att/att_leave_day/AttLeaveDayPage.ts` | `.specify/tests/pages/att/AttLeaveDayLocator.ts` |

Mỗi `alias` trong `rows_raw` giữ nguyên tất cả thông tin này để sinh block `screens` ở BƯỚC 4.

---

## BƯỚC 3 — Deduplicate theo `page_file` (chỉ áp dụng cho `data.rows`)

Vì nhiều alias có thể dùng chung một Page File (ví dụ: `att_leave_day`, `att_leave_day_analyze`, `att_leave_day_payback` đều trỏ về `att/att_leave_day/AttLeaveDayPage.ts`), chỉ giữ **một bản ghi** cho mỗi `page_file` trong mảng `data.rows`.

Quy tắc:
- Group các row theo `page_file` (khóa duy nhất).
- Trong mỗi group, lấy row **đầu tiên** theo thứ tự xuất hiện trong file.
- `ten_man_hinh` = `mo_ta` của alias đầu tiên trong group.

> **Lưu ý**: block `screens` ở BƯỚC 4 **không** deduplicate — mỗi `alias` đều có một entry riêng, kể cả khi nhiều alias cùng trỏ về một Page File.

---

## BƯỚC 4 — Sinh file sub-system-map.json

Tạo thư mục `.specify/memory/` nếu chưa tồn tại.

Ghi file `.specify/memory/sub-system-map.json` với cấu trúc:

```json
{
  "success": true,
  "generated_at": "2026-06-09T10:00:00.000Z",
  "source": ".specify/tests/pages/url-page-map.md",
  "total": 2,
  "screens": {
    "att_leave_day": {
      "group": "att",
      "url": "/Att_LeaveDay/Index",
      "pageObject": ".specify/tests/pages/att/att_leave_day/AttLeaveDayPage.ts",
      "locator": ".specify/tests/pages/att/AttLeaveDayLocator.ts"
    },
    "cat_leave_day_type": {
      "group": "cat",
      "url": "/Cat_LeaveDayType/Index",
      "pageObject": ".specify/tests/pages/cat/cat_leave_day_type/CatLeaveDayTypePage.ts",
      "locator": ".specify/tests/pages/cat/CatLeaveDayTypeLocator.ts"
    }
  },
  "data": {
    "rows": [
      {
        "ma_man_hinh": "att_leave_day",
        "ten_man_hinh": "DS Ngày nghỉ",
        "group": "att"
      },
      {
        "ma_man_hinh": "cat_leave_day_type",
        "ten_man_hinh": "DS Loại ngày nghỉ",
        "group": "cat"
      }
    ]
  }
}
```

### Quy tắc ghi:
- `"total"` = số phần tử trong `data.rows` (sau deduplicate).
- `"generated_at"` = ngày giờ hiện tại ISO 8601.
- `"source"` = đường dẫn file nguồn (cố định như trên).
- **`"screens"`** = object keyed by `alias` (từ `rows_raw`, **không** deduplicate), mỗi entry gồm:
  - `"group"` — segment đầu tiên của `page_file`.
  - `"url"` — URL path lấy từ cột **URL Path** trong bảng url-page-map.md.
  - `"pageObject"` — `".specify/tests/pages/" + page_file`.
  - `"locator"` — `".specify/tests/pages/" + locator_file`.
- `"data.rows"` — mảng sau deduplicate theo `page_file`, chỉ gồm ba trường `ma_man_hinh`, `ten_man_hinh`, `group`.
- Sắp xếp `data.rows` theo `group` ASC, rồi `ma_man_hinh` ASC.
- Sắp xếp key của `screens` theo `alias` ASC.
- Nếu file đã tồn tại → **ghi đè** (luôn là snapshot mới nhất).
- Encoding UTF-8, indent 2 spaces.

---

## BƯỚC 5 — Báo cáo kết quả

```
[✓] qc_sub-system-map hoàn thành

Nguồn   : .specify/tests/pages/url-page-map.md
Output  : .specify/memory/sub-system-map.json

Thống kê:
  Dòng trong url-page-map (Đã có PO)  : {total_rows_before_dedup}
  Màn hình duy nhất (sau deduplicate)  : {total}

Group tìm thấy:
  {group_1} : {count} màn hình
  {group_2} : {count} màn hình
  ...

Bước tiếp theo:
  → Dùng sub-system-map.json khi sinh testcase.md để kiểm tra Group / Màn hình.
  → Chạy lại /qc_sub-system-map bất cứ khi nào url-page-map.md được cập nhật.
```

---

## QUY TẮC

- **Bắt buộc** có `.specify/tests/pages/url-page-map.md` — không có thì dừng, không tự tạo dữ liệu giả.
- **Chỉ đọc** `url-page-map.md` — không sửa file này hay bất kỳ `*Page.ts` / `*Locator.ts` nào.
- Chỉ lấy dữ liệu từ section **"Đã có Page Object"** — bỏ qua "Chưa có Page Object" và "Thống kê".
- Mỗi `page_file` chỉ xuất hiện **một lần** trong `data.rows` (deduplicate theo page_file).
- Block `screens` **không** deduplicate — mỗi `alias` đều có entry riêng.
- `group` = segment **đầu tiên** của `page_file` — **không** dùng section name từ url-aliases.md.
- `ma_man_hinh` = segment **thứ hai** của `page_file` (nếu có), fallback tên class bỏ `Page` — **không** dùng alias hay URL path.
- `url` trong `screens` = cột **URL Path** lấy trực tiếp từ bảng url-page-map.md (không tự suy diễn).
- `pageObject` = `".specify/tests/pages/" + page_file` (đường dẫn đầy đủ từ gốc project).
- `locator` = `".specify/tests/pages/" + locator_file` (đường dẫn đầy đủ từ gốc project).
- Mỗi row trong `data.rows` chỉ chứa đúng ba trường: `ma_man_hinh`, `ten_man_hinh`, `group` — không thêm bất kỳ trường nào khác.
- Output duy nhất là `.specify/memory/sub-system-map.json`.

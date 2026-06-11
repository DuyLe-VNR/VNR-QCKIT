---
description: "Crawl user flow từ ứng dụng đang chạy — dùng playwright-mcp tools trực tiếp (navigate, snapshot, evaluate, click) để khám phá luồng thực tế, sinh ASCII flow diagram theo phân cấp Group → Alias → Feature → Screen → Action, ghi userflow-{group}.md và cập nhật flow-index.md (thời gian + trạng thái URL). Yêu cầu: user.json hợp lệ, APP_URL accessible."
argument-hint: "[alias1 alias2 ...] | [group-code1 group-code2 ...] | --all"
allowed-tools:
  - mcp__playwright__*
  - Bash(playwright-cli:*)
  - Bash(npx playwright *)
  - Read
  - Write
  - Edit
---

# /qc_user_flow

Dùng **playwright-mcp tools** (gọi trực tiếp, không subprocess) để khám phá luồng thực tế — xuất ra **ASCII flow diagram** theo phân cấp `Group → Alias → Feature → Screen → Action`, ghi `userflow-{group}.md` và cập nhật `flow-index.md`.

> **Công cụ sử dụng:**
> - `mcp__playwright__*` — gọi trực tiếp qua MCP (ưu tiên, không cần subprocess)
> - `/playwright-cli` skill — sinh `.spec.ts` tái sử dụng sau khi crawl xong
> - `Bash(npx playwright ...)` — chạy test spec đã sinh (fallback)

---

## User Input

```text
$ARGUMENTS
```

### Các chế độ gọi

| Cú pháp | Hành vi |
| --- | --- |
| _(không có argument)_ hoặc `--all` | Crawl **tất cả** alias trong `url-aliases.md` |
| `alias1 alias2 ...` | Crawl **từng alias cụ thể** theo tên alias (cột 1 của bảng) |
| `group-code1 group-code2 ...` | Crawl **tất cả alias thuộc section** có group code khớp |
| Kết hợp | `alias1 group-code2` → crawl alias1 lẻ + toàn bộ section group-code2 |

**Alias name** là giá trị ở cột `Alias` trong bảng url-aliases.md (ví dụ: `cat_leave_day_type`, `att_leave_day`).

**Group code** là mã trong ngoặc đơn ở header section (ví dụ: `ATT`, `HRE`, `SAL`).  
Section không có group code (ví dụ `## Dashboard`) → group code ngầm định là `dashboard`.

**Group code hợp lệ theo url-aliases.md:**

| Group Code | Tên section | Ví dụ alias |
| --- | --- | --- |
| `dashboard` | Dashboard / Dashboard Profile / Dashboard by Org | `dash_board`, `dash_board_profile` |
| `HRE` | Ho so nhan su | `hre_profile`, `hre_contract` |
| `ATT` | Cham cong | `att_leave_day`, `att_overtime` |
| `SAL` | Luong | `sal_compute_payroll`, `sal_basic_salary` |
| `REC` | Tuyen dung | `rec_candidate`, `rec_interview` |
| `TRA` | Dao tao | `tra_course`, `tra_class` |
| `EVA` | Danh gia | `eva_performance`, `eva_kpibuilding` |
| `INS` | Bao hiem | `ins_analyze_insurance`, `ins_insurance_info` |
| `FIN` | Tai chinh | `fin_approved_claim` |
| `CAN` | Canteen | `can_meal_record`, `can_meal_bill` |
| `MED` | Y te | `med_annual_health`, `med_prenatal` |
| `TAL` | Talent | `tal_career_path_period` |
| `KAI` | Kaizen | `kai_kaizen_data` |
| `SUR` | Survey | `sur_survey_employee` |
| `SYS` | He thong | `sys_user`, `sys_group` |
| `CAT` | Danh muc | `cat_leave_day_type`, `cat_org_structure` |

Ví dụ:
```
/qc_user_flow cat_leave_day_type              → chỉ crawl alias "cat_leave_day_type"
/qc_user_flow ATT                             → crawl toàn bộ section ATT
/qc_user_flow HRE SAL                         → crawl 2 section HRE + SAL
/qc_user_flow cat_leave_day_type ATT          → crawl 1 alias lẻ + toàn bộ section ATT
/qc_user_flow --all                           → crawl toàn bộ
```

---

## BƯỚC 0 — Kiểm tra điều kiện tiên quyết

### 0.1 Đọc môi trường

Đọc `.specify/tests/.env` lấy `ENV`, sau đó đọc `.specify/tests/.env.{ENV}` lấy:
- `APP_URL` — bắt buộc (ví dụ: `https://pehn02.vnresource.net:4406`)
- `AUTH_USERNAME`, `AUTH_PASSWORD` — để tự động login nếu session hết hạn

Nếu `APP_URL` không có → **DỪNG**:
```
⛔ APP_URL chưa cấu hình trong .specify/tests/.env.{ENV}
→ Thiết lập APP_URL trước khi chạy /qc_user_flow
```

### 0.2 Kiểm tra url-aliases.md

Đọc file `.specify/tests/url-aliases.md`.

Nếu không tồn tại → **DỪNG**:
```
⛔ url-aliases.md chưa tồn tại
→ Chạy /qc_pre trước để crawl navigation và sinh url-aliases.md
```

### 0.3 Kiểm tra session và nạp vào playwright-mcp

Kiểm tra `.specify/tests/user.json`:

**A. Session còn hợp lệ** — nạp storage state vào playwright-mcp:
```
mcp__playwright__browser_navigate: {url: "{APP_URL}"}
→ Nếu không bị redirect về /auth → session OK, tiếp tục
```

**B. Session hết hạn hoặc thiếu** — tự đăng nhập qua playwright-mcp:
```
mcp__playwright__browser_navigate:      {url: "{APP_URL}/auth/login"}
mcp__playwright__browser_snapshot                        ← đọc form login
mcp__playwright__browser_type:          {selector: "css=#username", text: "{AUTH_USERNAME}"}
mcp__playwright__browser_type:          {selector: "css=#password", text: "{AUTH_PASSWORD}"}
mcp__playwright__browser_click:         {selector: "role=button[name='Đăng nhập']"}
mcp__playwright__browser_wait_for_url:  {pattern: "**/DashBoard/**", timeout: 15000}
mcp__playwright__browser_save_storage_state: {path: ".specify/tests/user.json"}
```

Nếu login thất bại (URL vẫn ở `/auth`) → **DỪNG** với thông báo kiểm tra credentials.

> **Lưu ý:** playwright-mcp giữ session trong suốt session Claude — không cần re-load `user.json` giữa các alias.

### 0.4 Kiểm tra/tạo flow-index.md

Kiểm tra `.specify/memory/flow-index.md`:
- **Chưa có** → tạo mới với cấu trúc bảng rỗng (xem BƯỚC 6)
- **Đã có** → sẽ cập nhật thêm dòng mới / overwrite dòng đã có sau khi crawl

---

## BƯỚC 1 — Parse url-aliases.md và xác định danh sách alias cần crawl

### 1.1 Cấu trúc file url-aliases.md

File có dạng:
```
## Tên section (group-code)

| Alias | Path (local) | Path (full) | Mo ta |
| --- | --- | --- | --- |
| alias_1 | /path/1 | /Hrm_Main_Web/path/1 | Mô tả 1 |
| alias_2 | /path/2 | /Hrm_Main_Web/path/2 | Mô tả 2 |
```

- Path để điều hướng: dùng `{APP_URL}{Path (local)}` (không dùng Path (full))
- Section không có group code → group code = `dashboard`
- Header `## Hướng dẫn cập nhật` và các section phụ → **bỏ qua**

### 1.2 Phân loại token trong $ARGUMENTS

Với mỗi token, **auto-detect** theo thứ tự:

1. **Alias exact match**: tìm trong cột `Alias` → alias lẻ
2. **Group code match**: tìm trong header `## ... (token)` → lấy toàn bộ alias trong section
3. **Không khớp** → báo lỗi (xem 1.3)

### 1.3 Xử lý không tìm thấy

```
⛔ Không tìm thấy "{token}" trong url-aliases.md

"{token}" không phải alias name cũng không phải group code.

Group code hợp lệ: ATT, HRE, SAL, REC, TRA, EVA, INS, FIN, CAN, MED, TAL, KAI, SUR, SYS, CAT, dashboard
```

### 1.4 Loại bỏ alias không crawl được

Bỏ qua alias có path:
- `/` hoặc `/#/`
- `/#/auth/*` (màn hình đăng nhập)
- Các path chỉ là redirect không có UI thực sự

### 1.5 Nhận dạng Feature từ alias name

Với mỗi alias, **suy luận Feature** từ prefix sau group prefix:

| Pattern alias | Feature suy luận |
| --- | --- |
| `{group}_approved_*`, `{group}_waiting_approve_*` | **Phê duyệt** |
| `{group}_report_*`, `{group}_rpt_*` | **Báo cáo** |
| `{group}_import_*` | **Nhập dữ liệu** |
| `{group}_cat_*`, `cat_*` | **Danh mục** |
| `att_roster*`, `att_schedule*` | **Quản lý ca** |
| `att_leave_*`, `att_annual_*`, `att_pregnancy*` | **Ngày nghỉ** |
| `att_overtime*`, `att_compute_overtime*` | **Tăng ca** |
| `att_tam*`, `att_tamscan*` | **Dữ liệu chấm công** |
| `att_config_*`, `att_cut_off_*`, `att_grade*` | **Cấu hình công** |
| `hre_profile*`, `hre_candidate*` | **Hồ sơ nhân viên** |
| `hre_contract*`, `hre_appendix*` | **Hợp đồng** |
| `hre_work_history*`, `hre_rotation*` | **Điều chuyển** |
| `hre_reward*`, `hre_discipline*` | **Khen thưởng - Kỷ luật** |
| `hre_stop_working*`, `hre_profile_quit*` | **Nghỉ việc** |
| `sal_compute_*`, `sal_re_compute_*` | **Tính lương** |
| `sal_report_*` | **Báo cáo lương** |
| `sal_tax*`, `sal_pit*`, `sal_declare_tax*` | **Thuế** |
| `sal_insurance*`, `sal_analyze_insurance*` | **Bảo hiểm lương** |
| _(không khớp pattern nào)_ | **Khác** |

Các alias cùng Feature → gom vào 1 nhóm trong sơ đồ.

### 1.6 In preview danh sách

```
Sẽ crawl {n} alias thuộc {m} group, phân thành {k} feature:

GROUP: ATT (Cham cong)
  [Feature: Phê duyệt]
    • att_approved_roster        → Ca làm việc đang chờ duyệt
    • att_approved_leaveday      → Ngày nghỉ đang chờ duyệt
  [Feature: Ngày nghỉ]
    • att_leave_day              → DS Ngày nghỉ
    • att_annual_leave           → DS Phép năm đầu kỳ
  ...
```

---

## BƯỚC 2 — Thao tác trực tiếp với browser qua playwright-mcp

Dùng **playwright-mcp tools** gọi trực tiếp — không viết TypeScript temp file, không subprocess.

### 2.0 Thứ tự ưu tiên công cụ

```
1. mcp__playwright__*     → gọi trực tiếp, nhanh nhất, không overhead
2. /playwright-cli skill  → khi cần sinh .spec.ts tái sử dụng sau khi crawl
3. Bash(npx playwright …) → chỉ dùng để chạy spec đã sinh (không crawl)
```

### 2.1 Navigate đến màn hình

```
mcp__playwright__browser_navigate:
  url: "{APP_URL}{path_local}"
```

Chờ load xong — playwright-mcp mặc định đợi `networkidle`.

**Ghi nhận sau navigate:**
```
mcp__playwright__browser_evaluate:
  expression: |
    JSON.stringify({
      url:    window.location.href,
      title:  document.title,
      status: document.readyState,
      redirected: window.location.href.includes('/auth')
    })
```

| Kết quả | Trạng thái |
| --- | --- |
| `readyState: "complete"`, không chứa `/auth` | ✅ OK |
| URL chứa `/auth` | Session hết hạn → dừng, re-login |
| Timeout | ⏱️ TIMEOUT → tiếp tục alias kế |
| HTTP 403/404 (đọc từ title hoặc DOM) | ❌ FORBIDDEN / NOT_FOUND |

### 2.2 Snapshot DOM — nhận diện loại màn hình

```
mcp__playwright__browser_snapshot
```

Đọc accessibility tree để nhận diện loại màn hình:

| Dấu hiệu trong snapshot | Loại màn hình |
| --- | --- |
| `grid`, `table`, `treegrid` + toolbar buttons | **List screen** |
| Nhiều `textbox`, `combobox` ngoài dialog | **Form screen** |
| `tablist` + `tab` roles | **Tab screen** |
| `img[role]`, `figure`, ít interactive element | **Dashboard screen** |
| `input[type=file]` hoặc upload widget | **Import screen** |

### 2.3 Crawl toolbar actions

**Bước 1** — Lấy danh sách buttons từ snapshot (không cần evaluate):
```
mcp__playwright__browser_snapshot
→ Đọc tất cả node có role=button trong kết quả snapshot
→ Ghi nhận: name, disabled state
```

**Bước 2** — Click thử từng button AN TOÀN:

| Button text | Hành động |
| --- | --- |
| Thêm mới / Tạo mới / Add | ✅ Click → snapshot → ghi nhận dialog/panel |
| Sửa / Edit | ✅ Click trên record đầu → snapshot |
| Tìm kiếm / Lọc / Filter | ✅ Click → snapshot |
| Xóa / Delete / Duyệt / Từ chối / Xuất Excel | ❌ Ghi nhận label, **không click** |

```
mcp__playwright__browser_click:
  element: "role=button[name='Thêm mới']"

mcp__playwright__browser_snapshot   ← đọc kết quả sau click
```

**Bước 3** — Phân loại kết quả click:
```
mcp__playwright__browser_evaluate:
  expression: |
    JSON.stringify({
      hasDialog:  !!document.querySelector('.k-dialog, [role="dialog"]'),
      hasPanel:   !!document.querySelector('.k-drawer, .side-panel'),
      urlChanged: window.location.href
    })
```

| Kết quả | Loại action |
| --- | --- |
| `hasDialog: true` | `open-dialog` |
| `hasPanel: true` | `open-panel` |
| `urlChanged` khác URL gốc | `navigate` |
| Không đổi gì | `other` |

### 2.4 Crawl dialog / panel (sau khi mở)

Sau khi click "Thêm mới" / "Sửa" và dialog xuất hiện — dùng snapshot để đọc fields:

```
mcp__playwright__browser_snapshot
→ Đọc tất cả node input/combobox/checkbox/date trong vùng dialog/panel
```

Sau đó extract chi tiết bằng evaluate:

```
mcp__playwright__browser_evaluate:
  expression: |
    Array.from(
      document.querySelectorAll(
        '[role="dialog"] input, [role="dialog"] select, [role="dialog"] textarea, ' +
        '.k-dialog input, .k-dialog select, .k-dialog textarea'
      )
    ).map(el => ({
      label:       el.closest('[data-field]')?.dataset.field
                || el.labels?.[0]?.innerText?.trim()
                || el.placeholder
                || el.name
                || 'unknown',
      type:        el.type || el.tagName.toLowerCase(),
      required:    el.required || !!el.closest('[class*="required"]'),
      maxlength:   el.maxLength > 0 ? el.maxLength : null,
      placeholder: el.placeholder || null
    }))
```

Với combobox — lấy options:
```
mcp__playwright__browser_click:
  element: "role=combobox[name='{label}']"   ← mở dropdown

mcp__playwright__browser_evaluate:
  expression: |
    Array.from(document.querySelectorAll(
      '.k-list-item, [role="option"]'
    )).slice(0,10).map(el => el.innerText.trim())
```

Sau khi lấy xong — **đóng dialog** để không ảnh hưởng màn hình tiếp theo:
```
mcp__playwright__browser_press_key:  {key: "Escape"}
mcp__playwright__browser_snapshot                       ← confirm dialog đã đóng
```

### 2.5 Crawl tabs (màn hình Tab screen)

```
mcp__playwright__browser_evaluate:
  expression: |
    Array.from(document.querySelectorAll('[role="tab"]'))
      .map(t => ({ name: t.innerText.trim(), selected: t.getAttribute('aria-selected') }))
```

Với mỗi tab:
```
mcp__playwright__browser_click:
  element: "role=tab[name='{tabName}']"

mcp__playwright__browser_snapshot   ← đọc nội dung tab
```

Thu thập toolbar + fields riêng cho từng tab (lặp lại bước 2.3–2.4 cho từng tab).

### 2.6 Crawl search / filter

```
mcp__playwright__browser_evaluate:
  expression: |
    JSON.stringify({
      searchPlaceholder: document.querySelector(
        'input[placeholder*="tìm"], input[placeholder*="search"], input[placeholder*="Tìm"]'
      )?.placeholder,
      hasPager: !!document.querySelector('.k-pager, .pagination'),
      filterFields: Array.from(document.querySelectorAll(
        '.filter-panel input, .filter-panel select'
      )).map(el => el.placeholder || el.name || 'unknown')
    })
```

### 2.7 Xử lý lỗi và timeout

| Tình huống | playwright-mcp action |
| --- | --- |
| Navigate timeout | Ghi `⏱️ TIMEOUT`, gọi `browser_navigate` alias tiếp |
| Session hết hạn | `browser_evaluate` kiểm tra URL → dừng toàn bộ, thông báo re-login |
| Dialog không xuất hiện sau 5s | Snapshot lại → ghi `[TODO: dialog không mở]` |
| 403/404 | Đọc title/h1 từ snapshot → ghi `❌ FORBIDDEN` / `❌ NOT_FOUND` |
| Element không tìm thấy | Thử selector khác từ snapshot; ghi `[TODO: selector not found]` |

---

## BƯỚC 3 — Phân tích và chuẩn hoá dữ liệu crawl

### 3.1 Suy luận happy path từ actions đã crawl

```
List screen:
  1. Navigate đến alias → danh sách hiển thị
  2. Click "Thêm mới" → dialog/panel mở
  3. Nhập fields bắt buộc
  4. Click "Lưu" → toast thành công → record trong danh sách

Edit flow:
  1. Navigate đến alias → danh sách
  2. Click record → chọn
  3. Click "Sửa" → form điền sẵn
  4. Thay đổi → Click "Lưu" → toast thành công

Approve flow:
  1. Navigate đến alias → danh sách chờ duyệt
  2. Chọn record(s)
  3. Click "Duyệt" / "Từ chối" → confirm → toast
```

### 3.2 Xây dựng navigation graph

Từ actions đã crawl:

```
node: alias
edge: (from_alias) --[action]--> (to_alias | dialog_name | external)
```

### 3.3 Map field_type sang BasePage method

| field_type | BasePage method |
| --- | --- |
| textbox | `inputTextbox` / `verifyTextbox` |
| combobox | `inputCombobox` |
| checkbox | `inputCheckbox` / `verifyCheckbox` |
| date | `inputTextbox` (date picker) |
| table-input | `inputTable` |
| textarea | `inputTextbox` |
| number | `inputTextbox` |

---

## BƯỚC 4 — Vẽ sơ đồ ASCII User Flow (phân cấp 5 tầng)

Sơ đồ theo phân cấp bắt buộc:

```
GROUP → ALIAS → FEATURE → SCREEN → ACTION
```

### 4.1 Giải thích 5 tầng

| Tầng | Khái niệm | Ví dụ |
| --- | --- | --- |
| **Tầng 1 — GROUP** | Phân hệ nghiệp vụ (từ header section url-aliases.md) | `ATT — Cham cong` |
| **Tầng 2 — ALIAS** | Định danh màn hình (từ cột Alias url-aliases.md) | `att_leave_day` |
| **Tầng 3 — FEATURE** | Tính năng / nghiệp vụ trong alias | `Tạo mới`, `Chỉnh sửa`, `Xóa`, `Danh sách` |
| **Tầng 4 — SCREEN** | UI element xuất hiện khi dùng feature | `(Dialog: Tạo ngày nghỉ)`, `(Panel: Sửa)`, `List screen` |
| **Tầng 5 — ACTION** | Thao tác cụ thể người dùng thực hiện | `--[Lưu]-->`, `--[Hủy]-->`, fill fields |

### 4.2 Cấu trúc sơ đồ chuẩn

```
GROUP: {GROUP_CODE} — {Tên section}
│
├── [{alias_1}] {Mô tả màn hình}
│     URL: {path_local}  |  Loại: {List|Form|Tab|Dashboard|Import}
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Xuất Excel]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo {tên})
│     │       Nhập: {field1}*, {field2}*, {field3}
│     │       --[Lưu]-->   ✓ toast: "Lưu thành công"   --> [{alias_1}]
│     │       --[Hủy]-->   [{alias_1}]
│     │
│     ├── FEATURE: Chỉnh sửa
│     │     SCREEN: (Dialog: Sửa {tên})
│     │       Nhập: {field1}, {field2}
│     │       --[Lưu]-->   ✓ toast: "Cập nhật thành công"   --> [{alias_1}]
│     │       --[Hủy]-->   [{alias_1}]
│     │
│     └── FEATURE: Xóa
│           SCREEN: (Confirm: Xác nhận xóa?)
│             --[Đồng ý]--> ✓ toast: "Xóa thành công"   --> [{alias_1}]
│             --[Hủy]-->    [{alias_1}]
│
├── [{alias_2}] {Mô tả màn hình}
│     URL: {path_local}  |  Loại: Tab screen
│     │
│     ├── FEATURE: Tab {Tab 1}
│     │     SCREEN: tab {Tab 1} — List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       ├── FEATURE: Tạo mới (trong tab)
│     │       │     SCREEN: (Dialog: Tạo mới)
│     │       │       Nhập: {field1}*, {field2}*
│     │       │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │       └── FEATURE: Phê duyệt (trong tab)
│     │             SCREEN: (Confirm: Xác nhận duyệt?)
│     │               --[Đồng ý]--> ✓ toast: "Duyệt thành công"
│     │               --[Từ chối]--> ✓ toast: "Từ chối thành công"
│     │
│     └── FEATURE: Tab {Tab 2}
│           SCREEN: tab {Tab 2} — readonly
│             (Không có action — chỉ xem)
│
└── [{alias_3}] {Mô tả}
      URL: {path_local}  |  Loại: Form screen
      │
      └── FEATURE: Xem báo cáo
            SCREEN: Form điều kiện + kết quả
              Nhập điều kiện: {field1}, {field2}
              --[Xem]-->        hiển thị kết quả (inline)
              --[Xuất Excel]--> tải file .xlsx
```

### 4.3 Ký hiệu chuẩn

| Ký hiệu | Tầng | Ý nghĩa |
| --- | --- | --- |
| `GROUP: ATT — Cham cong` | Tầng 1 | Phân hệ nghiệp vụ |
| `[att_leave_day] DS Ngày nghỉ` | Tầng 2 | Alias + mô tả màn hình |
| `FEATURE: Tạo mới` | Tầng 3 | Tính năng trong màn hình |
| `SCREEN: (Dialog: ...)` | Tầng 4 | UI element cụ thể |
| `--[Lưu]-->` | Tầng 5 | Action người dùng |
| `✓ toast: "..."` | Tầng 5 | Kết quả thành công |
| `✗ toast: "..."` | Tầng 5 | Kết quả thất bại / lỗi |
| `{field}*` | Tầng 5 | Field bắt buộc (trong Nhập:) |
| `[TIMEOUT]` | — | Màn hình không load được |
| `[FORBIDDEN]` | — | Không có quyền truy cập |
| `[TODO: ...]` | — | Cần kiểm tra thủ công |

### 4.4 Quy tắc vẽ

- **GROUP** = block lớn nhất, bắt đầu bằng `GROUP: {CODE} — {Tên}`
- **ALIAS** = thụt 0 space so với group, dùng `├── [{alias}]`
- **FEATURE** = thụt 6 space + `├── FEATURE:`
- **SCREEN** = thụt 10 space + `SCREEN:` (trên 1 dòng riêng)
- **ACTION** = thụt 12 space + `--[action]-->`
- Toast kết quả: viết **inline** cùng dòng với action Submit (`--[Lưu]--> ✓ toast: "..."`)
- Field bắt buộc: dùng dấu `*` ngay sau tên field (`Tên loại*`)
- Màn hình `[TIMEOUT]` / `[FORBIDDEN]`: ghi 1 dòng, không mở FEATURE bên trong
- Màn hình **Tab screen**: mỗi tab là 1 FEATURE riêng, SCREEN là nội dung bên trong tab
- Action **Tìm kiếm** và **Xuất Excel**: ghi gọn dưới SCREEN danh sách, không tạo FEATURE riêng
- Sắp xếp FEATURE theo thứ tự ưu tiên: Danh sách → Tạo mới → Chỉnh sửa → Xóa → Phê duyệt → Báo cáo → Khác

---

## BƯỚC 5 — Ghi file userflow-{group}.md

### 5.1 Quy tắc đặt tên file output

| Input | File output |
| --- | --- |
| `--all` hoặc không có argument | `.specify/memory/userflow-all.md` |
| 1 group code (ví dụ `ATT`) | `.specify/memory/userflow-att.md` |
| Nhiều group code (ví dụ `ATT HRE`) | `.specify/memory/userflow-att-hre.md` |
| 1 alias lẻ (ví dụ `cat_leave_day_type`) | `.specify/memory/userflow-cat_leave_day_type.md` |
| Nhiều alias lẻ | `.specify/memory/userflow-{alias1}-{alias2}.md` |
| Kết hợp alias + group | `.specify/memory/userflow-{alias}-{group-lower}.md` |

> Tên file: lowercase, phân cách bằng `-`, alias giữ nguyên ký tự `_`.

### 5.2 Cấu trúc file userflow-{group}.md

```markdown
# User Flow — {Group Name / Alias List}

> Sinh bởi /qc_user_flow — {ISO_DATETIME}
> Input: {$ARGUMENTS} | ENV: {ENV} | APP_URL: {APP_URL}
> Crawl: {n} màn hình | {m} thành công | {k} thất bại

---

## Sơ đồ luồng

{ASCII flow diagram đầy đủ theo phân cấp Group → Alias → Feature → Screen → Action}

---

## Chi tiết từng màn hình

### [{alias}] — {Mô tả}

> URL: `{APP_URL}{path_local}`
> Loại: List screen | Form screen | Tab screen | Dashboard | Import screen
> Feature: {tên feature nhận diện}
> Trạng thái crawl: ✅ Thành công | ❌ Thất bại | ⏱️ Timeout
> Thời gian: {ISO_DATETIME}

#### Toolbar Actions

| Action | Loại | Trạng thái | Kết quả |
| --- | --- | --- | --- |
| Thêm mới | open-dialog | enabled | Mở dialog tạo mới |
| Xuất Excel | export | enabled | Tải file .xlsx |
| Xóa | delete | disabled | (khi chưa chọn record) |

#### Feature: Tạo mới

**Screen**: (Dialog: Tạo {tên})

Happy Path:
1. Navigate đến `[{alias}]` → màn hình danh sách
2. Click **Thêm mới** → dialog mở
3. Nhập: {field1} (bắt buộc), {field2} (bắt buộc), {field3}
4. Click **Lưu**
5. Kết quả: toast `"Lưu thành công"` → record xuất hiện trong danh sách

Form Fields:

| Field | Loại | Bắt buộc | Validation | BasePage Method |
| --- | --- | --- | --- | --- |
| {label} | textbox | ✓ | maxLength={n} | `inputTextbox` |
| {label} | combobox | ✓ | — | `inputCombobox` |
| {label} | date | — | — | `inputTextbox` |

#### Feature: Tab {Tên tab} (nếu có)

**Screen**: tab {Tên tab}

| Field | Loại | Bắt buộc | BasePage Method |
| --- | --- | --- | --- |
| {label} | textbox | ✓ | `inputTextbox` |
```

---

## BƯỚC 6 — Cập nhật flow-index.md

### 6.1 Vị trí file

`.specify/memory/flow-index.md`

### 6.2 Cấu trúc file flow-index.md

```markdown
# Flow Index

> Cập nhật lần cuối: {ISO_DATETIME}
> Tổng alias đã crawl: {n} | Thành công: {m} | Thất bại: {k} | Chưa crawl: {j}

## Bảng trạng thái URL

| Group | Alias | Mô tả | URL (local) | Trạng thái | Thời gian crawl | File userflow |
| --- | --- | --- | --- | --- | --- | --- |
| ATT | att_leave_day | DS Ngày nghỉ | /Att_LeaveDay/Index | ✅ OK | 2026-06-11 10:30:15 | userflow-att.md |
| ATT | att_overtime | DS Tăng ca | /Att_Overtime/Index | ✅ OK | 2026-06-11 10:31:02 | userflow-att.md |
| ATT | att_import_leaveday_import | Tải dữ liệu ngày nghỉ | /Att_ImportLeaveday/Import_List | ⏱️ TIMEOUT | 2026-06-11 10:32:00 | userflow-att.md |
| HRE | hre_profile | Nhân viên đang làm việc | /Hre_Profile/Index | ✅ OK | 2026-06-11 10:45:10 | userflow-hre.md |
| HRE | hre_org_charts | Sơ đồ tổ chức | /Hre_OrgCharts/Index | ❌ FORBIDDEN | 2026-06-11 10:46:00 | userflow-hre.md |
```

### 6.3 Logic cập nhật flow-index.md

- **Alias chưa có** trong file → **thêm dòng mới**
- **Alias đã có** → **ghi đè** toàn bộ dòng (cập nhật trạng thái + thời gian mới nhất)
- Giữ nguyên các alias **không thuộc batch crawl hiện tại** (không xóa history)
- Sắp xếp theo: Group code (A-Z) → Alias (A-Z)

### 6.4 Mã trạng thái

| Mã | Ý nghĩa |
| --- | --- |
| `✅ OK` | Navigate thành công, DOM render được |
| `❌ FORBIDDEN` | 403 hoặc redirect về màn hình khác (không có quyền) |
| `❌ NOT_FOUND` | 404 |
| `⏱️ TIMEOUT` | Không load được trong 15 giây |
| `⚠️ NO_DATA` | Load được nhưng không có dữ liệu để crawl |
| `🔄 CHƯA CRAWL` | Alias tồn tại trong url-aliases.md nhưng chưa bao giờ crawl |

---

## BƯỚC 7 — Cập nhật url-aliases.md nếu phát hiện bất thường

- Alias không truy cập được → thêm comment `<!-- [warn: unreachable] -->` bên cạnh dòng
- Tuyệt đối **không thay đổi** nội dung bảng chính của url-aliases.md
- Ghi log cảnh báo trong báo cáo kết quả

---

## BÁO CÁO KẾT QUẢ (hiển thị sau khi hoàn thành)

```
╔══════════════════════════════════════════════════════════════╗
║            /qc_user_flow — Kết quả crawl                    ║
╚══════════════════════════════════════════════════════════════╝

Input    : {$ARGUMENTS}
ENV      : {ENV}  |  APP_URL: {APP_URL}
Thời gian: {START_TIME} → {END_TIME}  ({duration}s)

THỐNG KÊ CRAWL:
  Group crawl        : {n} group
  Alias crawl        : {total} alias
  ✅ Thành công      : {ok} alias
  ⏱️ Timeout         : {timeout} alias
  ❌ Thất bại        : {fail} alias
  Features nhận diện : {k} features

CHI TIẾT THEO GROUP:
  ┌─────────────────────────────────────────────────────────────┐
  │ GROUP: ATT (Cham cong)                                      │
  │   ✅ att_leave_day       → DS Ngày nghỉ      (3 feat, 4 fields) │
  │   ✅ att_overtime        → DS Tăng ca        (4 feat, 6 fields) │
  │   ⏱️ att_compute_work_day → [TIMEOUT]                       │
  │   ❌ att_import_leaveday_import → [FORBIDDEN]               │
  ├─────────────────────────────────────────────────────────────┤
  │ GROUP: HRE (Ho so nhan su)                                  │
  │   ✅ hre_profile         → NV đang làm việc (5 feat, 12 fields) │
  │   ...                                                       │
  └─────────────────────────────────────────────────────────────┘

OUTPUT FILES:
  📄 User flow diagram : .specify/memory/userflow-{group}.md
  📋 Flow index        : .specify/memory/flow-index.md

PHỤC VỤ VIẾT TESTCASE:
  → Dùng userflow-{group}.md làm nguồn cho /qc_generate {PBI_ID}
  → Kiểm tra [TODO] trong userflow file nếu field chưa nhận diện
  → Các alias ❌/⏱️ cần kiểm tra quyền hoặc config môi trường

BƯỚC TIẾP THEO:
  → /qc_generate {PBI_ID}  — đọc userflow file tự động
  → /qc_detect_component   — phát hiện component chi tiết hơn
  → /qc_map_flow           — sinh Page Object + Locator file
```

---

## BƯỚC 8 — Sinh Playwright spec tái sử dụng (dùng /playwright-cli)

Sau khi crawl và ghi `userflow-{group}.md`, **tự động sinh `.spec.ts`** cho happy-path của từng alias đã crawl thành công — dùng `/playwright-cli` skill.

### 8.1 Khi nào sinh spec

- Alias có trạng thái `✅ OK` trong flow-index.md
- Alias có ít nhất 1 FEATURE có dialog/panel với fields thu thập được
- **Không sinh** cho alias `[TIMEOUT]`, `[FORBIDDEN]`, `[NOT_FOUND]`, hoặc Dashboard/readonly

### 8.2 Vị trí output

```
.specify/specs/{group}/userflow-{alias}.spec.ts
```

Ví dụ: `.specify/specs/ATT/userflow-att_leave_day.spec.ts`

### 8.3 Template spec sinh ra

Dùng `/playwright-cli` skill để sinh spec với pattern:

```typescript
// .specify/specs/{GROUP}/userflow-{alias}.spec.ts
// Auto-generated by /qc_user_flow — {ISO_DATETIME}
// Source: userflow-{group}.md

import { test, expect } from '@playwright/test';

test.describe('[{GROUP}] {alias} — {Mô tả màn hình}', () => {

  test.beforeEach(async ({ page }) => {
    // Nạp session từ user.json
    await page.context().addCookies(
      JSON.parse(require('fs').readFileSync('.specify/tests/user.json','utf8')).cookies ?? []
    );
    await page.goto('{APP_URL}{path_local}');
    await page.waitForLoadState('networkidle');
  });

  test('Danh sách hiển thị đúng', async ({ page }) => {
    await expect(page.locator('[role="grid"], table')).toBeVisible();
  });

  test('Tạo mới — happy path', async ({ page }) => {
    // Mở dialog
    await page.getByRole('button', { name: /thêm mới/i }).click();
    await expect(page.locator('[role="dialog"], .k-dialog')).toBeVisible();

    // Nhập fields bắt buộc (từ Form Fields đã crawl)
    // {field1}: await page.getByLabel('{label1}').fill('{value1}');
    // {field2}: await page.getByRole('combobox', { name: '{label2}' }).selectOption('{option}');

    // Submit
    await page.getByRole('button', { name: /lưu/i }).click();

    // Verify
    await expect(page.locator('.k-notification, .toast')).toContainText(/thành công/i);
  });

});
```

### 8.4 Gọi /playwright-cli để record và refine

Sau khi sinh template, gọi `/playwright-cli` để:
1. **Chạy thử** spec vừa sinh và ghi trace:
```bash
playwright-cli run_test ".specify/specs/{GROUP}/userflow-{alias}.spec.ts"
playwright-cli tracing_start --screenshots --snapshots
```

2. **Capture screenshot** màn hình chính:
```bash
playwright-cli screenshot ".specify/specs/{GROUP}/screenshots/{alias}-list.png"
```

3. **Lưu trace** nếu có lỗi:
```bash
playwright-cli tracing_stop ".specify/specs/{GROUP}/traces/{alias}.zip"
```

### 8.5 Báo cáo spec đã sinh

```
SPEC FILES SINH RA:
  ✅ .specify/specs/ATT/userflow-att_leave_day.spec.ts      (2 tests)
  ✅ .specify/specs/ATT/userflow-att_overtime.spec.ts       (3 tests)
  ⏭️  att_compute_work_day  → bỏ qua (TIMEOUT)
  ⏭️  att_report_leaveday   → bỏ qua (Dashboard/readonly)
```

---

## QUY TẮC BẮT BUỘC

- **Ưu tiên playwright-mcp** (`mcp__playwright__*`) — gọi trực tiếp, không viết TypeScript temp file, không subprocess
- **Dùng `/playwright-cli`** chỉ để sinh `.spec.ts` tái sử dụng sau khi crawl xong
- **Không sửa** `spec.md`, `plan.md`, hay bất kỳ file spec nào
- **Không hardcode selector** trong userflow file — chỉ ghi label, placeholder, role
- **Không click** các action destructive: Xóa, Submit payroll, Tính lương, Duyệt hàng loạt
- Mỗi màn hình crawl **tối đa 60 giây** — timeout → ghi `[TIMEOUT]`, tiếp tục
- Session hết hạn (redirect về `/auth`) → **dừng ngay**, re-login qua playwright-mcp rồi tiếp tục
- File `userflow-{group}.md` — không ghi đè userflow của group **khác** trong cùng 1 lần chạy
- `flow-index.md` — **luôn cập nhật incremental**, không bao giờ reset toàn bộ file
- Field không nhận diện được type → ghi `type=unknown` + `[TODO: xác định loại field]`
- Options combobox: tối đa **10 items** — sau khi lấy xong đóng dropdown bằng `Escape`
- Sơ đồ ASCII: **căn chỉnh thống nhất bằng space**, không dùng tab character
- Phân cấp sơ đồ **bắt buộc đủ 5 tầng**: GROUP → ALIAS → FEATURE → SCREEN → ACTION

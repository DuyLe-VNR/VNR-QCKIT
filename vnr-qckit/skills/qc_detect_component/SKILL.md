---
description: "Crawl DOM từng màn hình trong url-aliases.md, phát hiện các component theo rule trong component-rule.md và các element nhập liệu chưa có rule, sinh file component_{alias}.md tại .specify/memory/components/. Dùng trước qc_generate để biết screen dùng component nào."
argument-hint: "[group-code1 group-code2 ...] | --all | alias1 alias2 ..."
allowed-tools:
  - mcp__playwright__*
  - Bash(playwright-cli:*)
  - Bash(npx playwright *)
  - Read
  - Write
  - Edit
---

# /qc_detect_component

Crawl DOM từng màn hình, phát hiện component theo rule trong `component-rule.md` và tìm thêm các element có thể nhập liệu chưa có rule, sinh file `component_{alias}.md` tại `.specify/memory/components/`.

> **Công cụ sử dụng:**
> - `mcp__playwright__*` — gọi trực tiếp qua MCP (ưu tiên, không cần subprocess)
> - `/playwright-cli` skill — sinh `.spec.ts` detect script tái sử dụng nếu cần
> - `Bash(npx playwright ...)` — fallback khi MCP không khả dụng

---

## User Input

```text
$ARGUMENTS
```

- **Không có argument** hoặc **`--all`** → xử lý tất cả alias trong `url-aliases.md`
- **`group-code`** → chỉ xử lý alias thuộc section có group code khớp (ví dụ: `ATT`)
- **`alias1 alias2`** → chỉ xử lý đúng các alias được chỉ định

---

## BƯỚC 0 — Kiểm tra điều kiện

### 0.1 Đọc môi trường

Đọc `.specify/tests/.env` → lấy `ENV`.
Đọc `.specify/tests/.env.{ENV}` → lấy `APP_URL`, `AUTH_USERNAME`, `AUTH_PASSWORD`.

Nếu thiếu `APP_URL` → **DỪNG**:
```
⛔ APP_URL chưa cấu hình trong .specify/tests/.env.{ENV}
```

### 0.2 Kiểm tra file nguồn

Đọc đồng thời hai file (không chờ tuần tự):

| File | Mục đích |
| --- | --- |
| `.specify/tests/url-aliases.md` | Danh sách alias + path |
| `.specify/rules/component-rule.md` | Định nghĩa selector & container rule của từng component |

Nếu thiếu một trong hai → **DỪNG** và báo file nào thiếu.

### 0.3 Kiểm tra và nạp session vào playwright-mcp

**A. Thử nạp session từ user.json (nếu tồn tại):**

```
mcp__playwright__browser_navigate: { url: "{APP_URL}" }
```

- Nếu URL sau navigate **không chứa** `/auth` → session OK, tiếp tục
- Nếu bị redirect về `/auth` → session hết hạn → thực hiện **B**

**B. Tự đăng nhập lại qua playwright-mcp:**

```
mcp__playwright__browser_navigate:      { url: "{APP_URL}/auth/login" }
mcp__playwright__browser_snapshot                              ← đọc form login
mcp__playwright__browser_type:          { selector: "css=#username", text: "{AUTH_USERNAME}" }
mcp__playwright__browser_type:          { selector: "css=#password", text: "{AUTH_PASSWORD}" }
mcp__playwright__browser_click:         { selector: "role=button[name='Đăng nhập']" }
mcp__playwright__browser_wait_for_url:  { pattern: "**/DashBoard/**", timeout: 15000 }
mcp__playwright__browser_save_storage_state: { path: ".specify/tests/user.json" }
```

Nếu sau login URL vẫn ở `/auth` → **DỪNG**, yêu cầu kiểm tra credentials.

> **Lưu ý:** playwright-mcp giữ session trong suốt phiên Claude — không cần re-load `user.json` giữa các alias.

---

## BƯỚC 1 — Parse url-aliases.md và lọc alias

### 1.1 Parse alias theo argument

Cấu trúc file url-aliases.md:
```
## Tên section (group-code)

| Alias | Path (local) | Path (dev) | Mô tả |
```

Lọc alias:
- **group-code** → lấy tất cả alias trong section có header `## ... (group-code)`
- **alias cụ thể** → lấy đúng alias đó
- **`--all`** → lấy toàn bộ

Bỏ qua alias có path: `/`, `/#/`, `/#/auth/*`

### 1.2 Nhóm alias theo màn hình gốc

Alias có `?tab=` → tab con của alias gốc cùng path base. Chỉ crawl **màn hình gốc** (không crawl từng tab riêng — component giống nhau).

In danh sách sẽ xử lý:
```
Sẽ detect component trên {n} màn hình:
  [CAT]
    • cat_leave_day_type  → /#/catLeaveDay/cat-leave-day-type
    • cat_grade_attend    → /#/catGradeAttendance/cat-grade-attendance
```

---

## BƯỚC 2 — Parse component-rule.md → danh sách rule-component

Đọc `.specify/rules/component-rule.md`.

File được cấu trúc thành các section `## {component-name}`, mỗi section chứa:

| Trường | Pattern trong file |
| --- | --- |
| `COMPONENT_NAME` | Tên heading `## {name}` |
| `CONTAINER_SELECTOR` | Dòng `/* Container */` → selector phía sau |
| `INPUT_SELECTOR` | Dòng `/* Truy cập input */` hoặc `Input selector:` → selector |
| `LABEL_SELECTOR` | Dòng `/* Label gắn với control */` hoặc `Label của control:` → selector |

Kết quả parse:
```
rule_components = [
  {
    name: "k-textbox",
    container: "div:has(div.FieldTitle, div.FieldValue)",
    input:     "div.FieldValue input.k-textbox",
    label:     "div.FieldTitle label",
    is_input:  true
  },
  {
    name: "k-combobox",
    container: "span.k-combobox",
    input:     "span.k-combobox input.k-input",
    label:     null,     // [TODO] — bỏ qua detect label
    is_input:  true
  },
  {
    name: "k-button",
    container: "a.k-button, button.k-button",
    input:     null,     // không có input con
    label:     null,     // text content của element
    is_input:  false
  },
  ...
]
```

> `is_input: false` (như `k-button`) → chỉ ghi vào bản đồ màn hình, không đưa vào nhóm "nhập liệu".

---

## BƯỚC 3 — Crawl DOM từng màn hình

Với mỗi alias, thực hiện tuần tự:

### 3.1 Navigate đến màn hình

```
mcp__playwright__browser_navigate: { url: "{APP_URL}{path_local}", waitUntil: "networkidle" }
```

Nếu URL sau navigate chứa `/auth` → session hết hạn → **DỪNG toàn bộ**, yêu cầu refresh session.

Nếu navigate timeout (> 30s) → ghi `[TIMEOUT]` vào file output, tiếp tục alias kế.

### 3.2 Snapshot để hiểu cấu trúc trang (tuỳ chọn — dùng khi cần debug)

```
mcp__playwright__browser_snapshot
```

Dùng kết quả snapshot để:
- Xác nhận trang đã render đúng (không còn skeleton/spinner)
- Phát hiện context đặc biệt (dialog, drawer, tab) ngay khi vào trang

### 3.3 Detect rule-component — chạy 1 lần evaluate duy nhất

Gọi `mcp__playwright__browser_evaluate` với IIFE tổng hợp tất cả rule-component cùng lúc:

```javascript
mcp__playwright__browser_evaluate: {
  expression: `
    (() => {
      // ── Rule definitions (parsed from component-rule.md) ──────────
      const RULES = [
        { name: 'k-textbox',    container: 'div:has(div.FieldTitle, div.FieldValue)', input: 'div.FieldValue input.k-textbox',    label: 'div.FieldTitle label',    is_input: true  },
        { name: 'k-combobox',   container: 'span.k-combobox',                        input: 'span.k-combobox input.k-input',     label: null,                      is_input: true  },
        { name: 'k-select',     container: 'span.k-dropdown',                        input: 'span.k-dropdown span.k-input',      label: null,                      is_input: true  },
        { name: 'k-datepicker', container: 'span.k-datepicker',                      input: 'span.k-datepicker input.k-input',   label: null,                      is_input: true  },
        { name: 'k-timepicker', container: 'span.k-timepicker',                      input: 'span.k-timepicker input.k-input',   label: null,                      is_input: true  },
        { name: 'textarea',     container: 'div:has(div.FieldTitle, div.FieldValue)', input: 'div.FieldValue textarea',           label: 'div.FieldTitle label',    is_input: true  },
        { name: 'numeric',      container: 'div:has(div.FieldTitle, div.FieldValue)', input: 'div.FieldValue input[type="number"]', label: 'div.FieldTitle label', is_input: true  },
        { name: 'checkbox',     container: 'div:has(div.FieldTitle150)',              input: 'div.FieldValue input[type="checkbox"]', label: 'div.FieldTitle150 label', is_input: true },
        { name: 'k-button',     container: 'a.k-button, button.k-button',            input: null,                                label: null,                      is_input: false }
      ]

      // ── Helper: detect context ─────────────────────────────────────
      function getContext(el) {
        if (el.closest('.k-dialog, .k-window')) return 'dialog'
        if (el.closest('.k-drawer-content, .ant-drawer-body')) return 'drawer'
        if (el.closest('.k-tabstrip-content .k-state-active, .ant-tabs-tabpane-active')) return 'tab'
        return 'main-form'
      }

      // ── Collect coveredNodes to avoid double-counting ──────────────
      const coveredNodes = new Set()
      const ruleResults = []

      for (const rule of RULES) {
        const containers = Array.from(document.querySelectorAll(rule.container))
        if (!containers.length) continue
        const instances = []
        for (const el of containers) {
          coveredNodes.add(el)
          const labelEl = rule.label ? el.querySelector(rule.label) : null
          const label   = labelEl?.textContent?.trim() || ''
          const inputEl = rule.input ? el.querySelector(rule.input) : el
          if (inputEl) coveredNodes.add(inputEl)
          const placeholder = inputEl?.getAttribute('placeholder') || ''
          const name        = inputEl?.getAttribute('name') || inputEl?.getAttribute('formcontrolname') || inputEl?.getAttribute('id') || ''
          const inputType   = inputEl?.getAttribute('type') || inputEl?.tagName?.toLowerCase() || ''
          const required    = !!el.querySelector('[class*="required"], [required], .k-required')
          const context     = getContext(el)
          // k-button: label = text content
          const btnLabel    = !rule.input ? (el.textContent?.trim().slice(0, 60) || '') : ''
          instances.push({
            label:       label || btnLabel || '',
            name,
            placeholder,
            inputType,
            required,
            context
          })
        }
        ruleResults.push({ name: rule.name, is_input: rule.is_input, count: instances.length, instances })
      }

      return { ruleResults, coveredNodeCount: coveredNodes.size, _coveredIds: Array.from(coveredNodes).map(n => n.tagName + (n.id ? '#'+n.id : '') + (n.className ? '.'+n.className.split(' ')[0] : '')).slice(0, 20) }
    })()
  `
}
```

### 3.4 Detect unknown inputs — evaluate lần 2

Gọi `mcp__playwright__browser_evaluate` riêng để quét phần còn lại (truyền `coveredNodeCount` từ kết quả trên để validate logic):

```javascript
mcp__playwright__browser_evaluate: {
  expression: `
    (() => {
      // ── Re-build covered set (same logic as step 3.3) ─────────────
      const CONTAINER_SELECTORS = [
        'div:has(div.FieldTitle, div.FieldValue)',
        'span.k-combobox', 'span.k-dropdown', 'span.k-datepicker',
        'span.k-timepicker', 'div:has(div.FieldTitle150)',
        'a.k-button', 'button.k-button'
      ]
      const covered = new Set()
      CONTAINER_SELECTORS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          covered.add(el)
          el.querySelectorAll('input, textarea, select').forEach(c => covered.add(c))
        })
      })

      // ── Scan for any input-capable element NOT already covered ─────
      const SCAN = [
        'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"])',
        'textarea',
        'select',
        '[contenteditable="true"]',
        '[role="textbox"]', '[role="combobox"]', '[role="listbox"]',
        '[role="spinbutton"]', '[role="slider"]', '[role="searchbox"]'
      ]

      function getContext(el) {
        if (el.closest('.k-dialog, .k-window')) return 'dialog'
        if (el.closest('.k-drawer-content, .ant-drawer-body')) return 'drawer'
        if (el.closest('.k-tabstrip-content .k-state-active, .ant-tabs-tabpane-active')) return 'tab'
        return 'main-form'
      }

      const unknowns = []
      const seen = new Set()

      SCAN.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (covered.has(el) || seen.has(el)) return
          seen.add(el)
          const tagName     = el.tagName.toLowerCase()
          const inputType   = el.getAttribute('type') || tagName
          const placeholder = el.getAttribute('placeholder') || ''
          const name        = el.getAttribute('name') || el.getAttribute('formcontrolname') || el.getAttribute('id') || ''
          const required    = el.hasAttribute('required') || !!el.closest('[required]')
          const cssClasses  = Array.from(el.classList).join(' ')
          const ariaLabel   = el.getAttribute('aria-label') || ''
          const labelledBy  = el.getAttribute('aria-labelledby')
          const labelByFor  = el.id ? document.querySelector('label[for="' + el.id + '"]')?.textContent?.trim() || '' : ''
          const label       = ariaLabel
                           || (labelledBy ? (document.getElementById(labelledBy)?.textContent?.trim() || '') : '')
                           || labelByFor
                           || placeholder
                           || '[unknown]'
          const htmlSnippet = el.outerHTML.slice(0, 200).replace(/"/g, "'")
          unknowns.push({ label, name, inputType, placeholder, required, cssClasses, context: getContext(el), htmlSnippet })
        })
      })
      return unknowns
    })()
  `
}
```

### 3.5 Thu thập kết quả

Tổng hợp dữ liệu từ 3.3 + 3.4:
```
screen_components[alias] = {
  url:             path,
  description:     "Mô tả từ url-aliases.md",
  rule_components: [ ...ruleResults ],   // từ evaluate 3.3
  unknown_inputs:  [ ...unknowns ]       // từ evaluate 3.4
}
```

---

## BƯỚC 4 — Sinh file component_{alias}.md

Với mỗi alias đã crawl, ghi:
```
.specify/memory/components/component_{alias}.md
```

> ⚠️ Tạo thư mục `.specify/memory/components/` nếu chưa tồn tại.

### 4.1 Format file

```markdown
# Component List — {alias}

> Screen   : {mô tả từ url-aliases.md}
> URL      : {path}
> Sinh bởi : /qc_detect_component — {ISO_DATE}
> Rule     : .specify/rules/component-rule.md
> Tổng     : {n} rule-components, {m} unknown-inputs

---

## [RULE COMPONENTS] — Khớp với component-rule.md

### k-textbox ({count} fields)

| # | Label | Name | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Mã loại | Code | Nhập mã | ✓ | main-form |
| 2 | Tên loại | Name | — | ✓ | main-form |

### k-combobox ({count} fields)

| # | Label | Name | Placeholder | Required | Context |
| --- | --- | --- | --- | --- | --- |
| 1 | Trạng thái | Status | Chọn... | — | main-form |

### k-button ({count} buttons)

| # | Label | Context |
| --- | --- | --- |
| 1 | Lưu | main-form |
| 2 | Hủy | main-form |

---

## [UNKNOWN INPUTS] — Element nhập liệu chưa có trong component-rule.md

> ⚠️ Các element dưới đây có thể nhập liệu nhưng chưa được định nghĩa rule selector.
> Cân nhắc bổ sung vào component-rule.md nếu dùng lặp lại nhiều màn hình.

| # | Label | Name | Type | CSS Classes | Placeholder | Required | Context | HTML Snippet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Ghi chú | Note | textarea | custom-note-field | — | — | main-form | `<textarea class='custom-note-field'...>` |

---

## Tóm tắt

### Rule Components

| Component | Số lượng | Là input? | Context chính |
| --- | --- | --- | --- |
| k-textbox | {n} | ✓ | main-form |
| k-combobox | {n} | ✓ | main-form |
| k-button | {n} | — | main-form |

### Unknown Inputs

| Type | Số lượng | Context chính |
| --- | --- | --- |
| textarea | 1 | main-form |

> Dùng file này làm input cho /qc_generate để sinh test case chính xác hơn.
> Chạy /qc_init_component để bổ sung rule cho unknown inputs nếu cần.
```

### 4.2 Quy tắc ghi file

- Tạo thư mục `.specify/memory/components/` nếu chưa tồn tại.
- Nếu file đã tồn tại → **ghi đè** (file này luôn là snapshot mới nhất).
- Chỉ ghi section **có ít nhất 1 instance** được tìm thấy.
- Nếu `label` rỗng → dùng `name` làm label; nếu cả hai rỗng → ghi `[unknown]`.
- Nếu không có unknown input → bỏ section `[UNKNOWN INPUTS]`.

---

## BƯỚC 5 — Báo cáo tổng hợp

```
[v] qc_detect_component hoàn thành

Màn hình đã xử lý : {n}
Files đã sinh      : {n} file .specify/memory/components/component_*.md

Kết quả:
  ✔ cat_leave_day_type  → 2 rule-types (4 instances), 1 unknown-input  → component_cat_leave_day_type.md
  ✔ cat_grade_attend    → 3 rule-types (7 instances), 0 unknown-inputs → component_cat_grade_attend.md
  ✗ att_leave_day       → [TIMEOUT / không detect được]

Thống kê rule-components:
  k-textbox    : xuất hiện trên {n}/{total} màn hình
  k-combobox   : xuất hiện trên {n}/{total} màn hình
  k-datepicker : xuất hiện trên {n}/{total} màn hình
  k-button     : xuất hiện trên {n}/{total} màn hình

Unknown inputs (chưa có rule):
  textarea[class*="..."]  : {n} màn hình  ← cân nhắc bổ sung rule
  input[type="file"]      : {n} màn hình  ← cân nhắc bổ sung rule

Output dir: .specify/memory/components/

Bước tiếp theo:
  → Xem file component_{alias}.md để kiểm tra danh sách
  → Chạy /qc_generate {PBI_ID} — sẽ tự đọc component_{alias}.md nếu tồn tại
  → Chạy /qc_init_component nếu muốn bổ sung rule cho unknown inputs vào component-rule.md
```

---

## QUY TẮC

- **Không sửa** `url-aliases.md` hay `component-rule.md`.
- **Không crawl tab con** — component trên tab con sẽ được phát hiện khi chạy /qc_user_flow.
- Mỗi màn hình crawl **tối đa 30 giây** — navigate timeout → ghi `[TIMEOUT]`, tiếp tục alias kế.
- Session hết hạn (redirect `/auth`) → **dừng toàn bộ**, thông báo refresh session.
- Ưu tiên dùng **`mcp__playwright__browser_evaluate`** (gọi trực tiếp, không subprocess); chỉ dùng `Bash(npx playwright ...)` khi MCP không khả dụng.
- Rule-component được detect qua **container selector** (từ `component-rule.md`) — ưu tiên rule đặc thù trước khi quét native element.
- Unknown-input scan chỉ bắt element **chưa được container rule bao phủ** — tránh đếm trùng.
- Nếu phát hiện unknown input xuất hiện ≥ 3 màn hình → in cảnh báo riêng trong báo cáo để user cân nhắc bổ sung rule.

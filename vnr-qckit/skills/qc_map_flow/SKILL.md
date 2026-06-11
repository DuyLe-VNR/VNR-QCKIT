---
description: "Đọc component_temp_{alias}.md + userflow.md, sinh 2 file TypeScript cho từng màn hình: {AliasName}Locator.ts (khai báo locator) đặt ở pages/{group}/ và {AliasName}Page.ts (action methods, import Locator) đặt ở pages/{group}/{alias}/. Chạy sau qc_detect_component + qc_user_flow."
argument-hint: "[alias1 alias2 ...] | --all | --pbi <PBI_ID>"
---

# /qc_map_flow

Sinh **Locator** và **Page Object** TypeScript từ component role + user flow — output sẵn sàng dùng trong test case Playwright.

---

## User Input

```text
$ARGUMENTS
```

- **Không có argument** hoặc **`--all`** → xử lý tất cả alias có `component_temp_{alias}.md`
- **`alias1 alias2 ...`** → chỉ xử lý các alias được chỉ định
- **`--pbi <PBI_ID>`** → chỉ xử lý các alias liên quan đến PBI (đọc từ `testcase.md` hoặc `spec.md`)

---

## BƯỚC 0 — Kiểm tra điều kiện

### 0.1 Xác định nguồn dữ liệu

Tìm các file nguồn theo thứ tự:

| File | Bắt buộc | Ghi chú |
| --- | --- | --- |
| `vnr-qckit/detected_components/component_temp_{alias}.md` | **BẮT BUỘC** | Danh sách component + field từ qc_detect_component |
| `.specify/tests/url-aliases.md` | **BẮT BUỘC** | Alias → URL path mapping |
| `.specify/rules/component-rule.md` | **Ưu tiên** | Selector rules cho từng component type |
| `vnr-qckit/templates/template-component-rule.md` | Fallback | Dùng khi không có `.specify/rules/component-rule.md` |
| `.specify/memory/userflow-{group}.md` | **Ưu tiên** | Userflow riêng theo group — tìm trước |
| `.specify/memory/userflow.md` | Fallback | Userflow tổng hợp — dùng khi không có file theo group |
| `.specify/specs/{PBI_ID}/testcase.md` | Tùy chọn | Để suy luận method nào cần ưu tiên |

Nếu thiếu `component_temp_{alias}.md` ở `vnr-qckit/detected_components/` → **DỪNG**:

```
⛔ Không tìm thấy vnr-qckit/detected_components/component_temp_{alias}.md
→ Chạy /qc_detect_component {alias} trước để phát hiện component
```

Nếu thiếu cả `.specify/rules/component-rule.md` lẫn `vnr-qckit/templates/template-component-rule.md` → **DỪNG**:

```
⛔ Không tìm thấy component-rule.md
→ Chạy /qc_init_component trước để định nghĩa selector cho component
```

### 0.2 Xác định danh sách alias cần xử lý

Từ argument, xác định danh sách alias. Sau đó **resolve group** cho từng alias:

- Đọc `url-aliases.md`, tìm section header `## {Tên section} ({group-code})` chứa alias đó → lấy `group-code`
- Nếu không có section header rõ ràng → lấy prefix trước dấu `_` đầu tiên của alias làm group (ví dụ: `hrm_employee` → group `hrm`)

In danh sách theo group:

```
Sẽ sinh Page Object cho {n} màn hình:
  [hrm]
    • hrm_employee  → /employees
    • hrm_contract  → /contracts
  [obj]
    • obj_goal_personal  → /#/objEval/eva-goal/personal
```

---

## BƯỚC 1 — Đọc tài liệu (song song)

Đọc đồng thời:

1. `.specify/tests/url-aliases.md` → build map `alias → path`
2. `.specify/rules/component-rule.md` (fallback: `vnr-qckit/templates/template-component-rule.md`) → build **ComponentRuleMap**
3. `vnr-qckit/detected_components/component_temp_{alias}.md` cho tất cả alias cần xử lý → build **FieldInventory**
4. Userflow files theo group (xem 1.3) → build **ActionMap**

### 1.1 ComponentRuleMap

Từ `component-rule.md`, parse từng section `## {COMPONENT_NAME}`:

```
ComponentRuleMap[componentName] = {
  containerSelector: string,    // CSS selector của container
  inputSelector: string,        // CSS selector của input bên trong
  labelSelector: string,        // CSS selector của label
  searchInputSelector?: string, // Chỉ có ở combobox/select
  placeholderSelector?: string,
}
```

Ví dụ kết quả:
```
ComponentRuleMap["vnr-input"] = {
  containerSelector: "vnr-input",
  inputSelector: "nz-input-group input",
  labelSelector: "nz-form-label label",
}
ComponentRuleMap["vnr-combobox"] = {
  containerSelector: "vnr-combobox",
  inputSelector: "nz-form-control nz-select",
  labelSelector: "nz-form-label label",
  searchInputSelector: "nz-select-search input",
}
```

### 1.2 FieldInventory

Từ `component_temp_{alias}.md`, parse từng section component:

```
FieldInventory[alias][componentType] = [
  {
    index: number,            // Thứ tự field (1-based)
    label: string,            // Label text từ UI
    formControlName: string,  // formControlName attribute
    placeholder: string,
    required: boolean,
    context: "main" | "dialog" | "panel" | "tab",
  }
]
```

### 1.3 ActionMap — Resolve userflow theo group

Với **mỗi group** trong alias_list, resolve file userflow theo thứ tự ưu tiên:

```
1. Thử đọc: .specify/memory/userflow-{group}.md
     → Có → dùng file này cho TẤT CẢ alias thuộc group đó

2. Fallback: .specify/memory/userflow.md
     → Có → dùng file tổng hợp, lọc section theo alias

3. Không có gì → ActionMap[alias] = {} (empty)
     → Ghi cảnh báo, tiếp tục sinh locator
```

Cảnh báo khi không có userflow:

```
⚠ Không tìm thấy userflow cho group [{group}]
  → Tìm: .specify/memory/userflow-{group}.md — không có
  → Fallback: .specify/memory/userflow.md — không có
  → Sẽ sinh Locator đầy đủ, Page chỉ có goto(), không có action methods
  → Chạy /qc_user_flow {alias} để crawl userflow trước nếu muốn có action methods
```

Ví dụ với alias_list = `[cat_leave_day_type, cat_leave_type, hrm_employee]`:

```
group "cat":
  → Thử: .specify/memory/userflow-cat.md  ✔ tìm thấy
  → Dùng userflow-cat.md cho cat_leave_day_type, cat_leave_type

group "hrm":
  → Thử: .specify/memory/userflow-hrm.md  ✗ không có
  → Fallback: .specify/memory/userflow.md  ✔ tìm thấy
  → Tìm section "## hrm_employee" trong userflow.md
```

Sau khi có file userflow, với mỗi alias trích xuất section `## {alias}`:

```
ActionMap[alias] = {
  screenType: "list" | "form" | "detail" | "tab",
  toolbarActions: [{ label, type }],
  happyPathSteps: string[],
  formContext: "dialog" | "panel" | "route",
}
```

Nếu section `## {alias}` **không tồn tại** trong file userflow đã chọn → `ActionMap[alias] = {}`, ghi:

```
⚠ [{alias}] Không tìm thấy section "## {alias}" trong {userflow_file}
  → Sẽ sinh locators only, không có action methods cho màn hình này
```

Nếu userflow không có → ActionMap trống, vẫn tiếp tục sinh locator.

---

## BƯỚC 2 — Tính toán Locator Strategy cho từng field

Với mỗi field trong FieldInventory, tính **locator strategy** tối ưu:

### 2.1 Ưu tiên locator (từ cao xuống thấp)

| Ưu tiên | Strategy | Khi dùng |
| --- | --- | --- |
| 1 | `getByLabel('{label}')` | Label rõ ràng, unique trên trang |
| 2 | `getByRole('{role}', { name: '{label}' })` | ARIA role rõ ràng (button, combobox, textbox) |
| 3 | `page.locator('{containerSelector}').filter({ hasText: '{label}' }).locator('{inputSelector}')` | Component role với label filter |
| 4 | `page.locator(`{containerSelector}:nth-child({n}) {inputSelector}`) ` | Khi không có label, dùng index |
| 5 | `page.locator('[formcontrolname="{formControlName}"]')` | Khi có formControlName |

### 2.2 Quy tắc chọn strategy

```
Nếu label != "" và label != "[unknown]":
  → Ưu tiên 1: getByLabel nếu component là textbox/input thuần
  → Ưu tiên 3: filter by hasText nếu component là custom tag (vnr-*, k-*)

Nếu componentType là "vnr-button" hoặc "k-button":
  → Dùng getByRole('button', { name: label })

Nếu componentType là "vnr-combobox" hoặc "k-combobox":
  → Dùng filter + locator vì combobox không phải native select

Nếu label == "" hoặc label == "[unknown]" và có formControlName:
  → Dùng ưu tiên 5: formControlName

Nếu không có gì:
  → Dùng ưu tiên 4 với index, ghi [TODO: xác nhận selector]
```

### 2.3 Tính BasePage method tương ứng

| Component type | BasePage method | Ghi chú |
| --- | --- | --- |
| vnr-input, k-textbox, msinput | `inputTextbox` | |
| vnr-combobox, k-combobox, k-select | `inputCombobox` | |
| checkbox, k-checkbox | `inputCheckbox` | |
| k-datepicker, ms-date-picker-container | `inputTextbox` | date dùng fill |
| k-timepicker | `inputTextbox` | |
| textarea | `inputTextbox` | |
| vnr-button, k-button | `click()` trực tiếp | không qua BasePage method |
| table row | `inputTable` | |

---

## BƯỚC 3 — Sinh Locator + Page Object TypeScript

Với mỗi alias, sinh **2 file** tách biệt:

| File | Đường dẫn | Vai trò |
| --- | --- | --- |
| Locator | `.specify/tests/pages/{group}/{AliasName}Locator.ts` | Khai báo toàn bộ locator — **không** có action method |
| Page Object | `.specify/tests/pages/{group}/{alias}/{AliasName}Page.ts` | Import Locator, kế thừa BasePage, chứa action methods |

### 3.1 Quy tắc đặt tên

- Alias `hrm_employee` (group `hrm`) → `{AliasName}` = `HrmEmployee`
  - Locator file : `.specify/tests/pages/hrm/HrmEmployeeLocator.ts` — class `HrmEmployeeLocator`
  - Page file    : `.specify/tests/pages/hrm/hrm_employee/HrmEmployeePage.ts` — class `HrmEmployeePage`
- Alias `obj_goal_personal` (group `obj`) → `{AliasName}` = `ObjGoalPersonal`
  - Locator file : `.specify/tests/pages/obj/ObjGoalPersonalLocator.ts`
  - Page file    : `.specify/tests/pages/obj/obj_goal_personal/ObjGoalPersonalPage.ts`
- **Group** = `group-code` từ section header trong `url-aliases.md` (hoặc prefix trước `_` đầu tiên làm fallback)
- Chuyển snake_case alias → PascalCase làm `{AliasName}`
- Thư mục alias trong Page file = **raw snake_case** (giữ nguyên alias gốc)

### 3.2 Cấu trúc file Locator (`{AliasName}Locator.ts`)

File này **chỉ** chứa khai báo locator — không import BasePage, không có action method.

```typescript
import { Page, Locator } from '@playwright/test'

/**
 * Locator: {Mô tả màn hình từ url-aliases.md}
 * URL: {path}
 * Sinh bởi /qc_map_flow — {ISO_DATE}
 * Source: component_temp_{alias}.md + component-rule.md
 * Group: {group-code}
 */
export class {AliasName}Locator {
  // ─── Toolbar Actions ─────────────────────────────────────────────────────────

  readonly btn{ActionLabel}: Locator  // {label} — toolbar

  // ─── Form Fields — {Context: dialog|panel|main} ──────────────────────────────

  readonly {camelCaseFieldName}: Locator  // {label} ({componentType})

  constructor(private readonly page: Page) {
    // Toolbar
    this.btn{ActionLabel} = page.getByRole('button', { name: '{actionLabel}' })

    // Fields — {context}
    this.{camelCaseFieldName} = {locator expression}
  }
}
```

### 3.3 Cấu trúc file Page Object (`{AliasName}Page.ts`)

File này **import Locator**, kế thừa BasePage, chứa toàn bộ action methods.

```typescript
import { Page } from '@playwright/test'
import { BasePage } from '../../BasePage'
import { {AliasName}Locator } from '../{AliasName}Locator'

/**
 * Page Object: {Mô tả màn hình từ url-aliases.md}
 * URL: {path}
 * Screen type: {list|form|detail|tab}
 * Sinh bởi /qc_map_flow — {ISO_DATE}
 * Source: component_temp_{alias}.md + userflow-{group}.md (hoặc userflow.md)
 * Group: {group-code}
 */
export class {AliasName}Page extends BasePage {
  // ─── URL ────────────────────────────────────────────────────────────────────

  readonly url = '{path}'

  // ─── Locator ─────────────────────────────────────────────────────────────────

  readonly loc: {AliasName}Locator

  constructor(page: Page) {
    super(page)
    this.loc = new {AliasName}Locator(page)
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto() {
    await this.navigate(this.url)
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Mở form tạo mới */
  async openCreateForm() {
    await this.loc.btn{AddButton}.click()
  }

  /** Điền form tạo mới — truyền partial data */
  async fillCreateForm(data: {
    {fieldName}?: string   // {label} — {required? 'bắt buộc' : 'tùy chọn'}
  }) {
    if (data.{fieldName} !== undefined)
      await this.input{ComponentMethod}(this.loc.{fieldLocator}, data.{fieldName}, '{label}')
  }

  /** Submit form */
  async submitForm() {
    await this.loc.btn{SaveButton}.click()
  }

  /** Điền và submit form tạo mới — shortcut */
  async createRecord(data: Parameters<typeof this.fillCreateForm>[0]) {
    await this.openCreateForm()
    await this.fillCreateForm(data)
    await this.submitForm()
  }
}
```

### 3.4 Quy tắc sinh locator cụ thể

**vnr-input / textbox:**
```typescript
// Label rõ ràng → dùng filter + inputSelector
this.tenPhieuMucTieu = page
  .locator('vnr-input')
  .filter({ has: page.locator('nz-form-label label', { hasText: 'Tên phiếu mục tiêu' }) })
  .locator('nz-input-group input')
```

**vnr-combobox:**
```typescript
// Combobox → filter label, locator select control
this.loaiPhieu = page
  .locator('vnr-combobox')
  .filter({ has: page.locator('nz-form-label label', { hasText: 'Loại phiếu' }) })
  .locator('nz-form-control nz-select')
```

**vnr-button / action button:**
```typescript
// Button → getByRole với name
this.btnLuu = page.getByRole('button', { name: 'Lưu' })
this.btnHuy = page.getByRole('button', { name: 'Hủy' })
```

**Dialog context — wrap trong dialog locator:**
```typescript
// Nếu context = "dialog", wrap locator trong nz-modal-content
private get _dialog() {
  return this.page.locator('nz-modal-content')
}

this.tenPhieuMucTieu = this._dialog
  .locator('vnr-input')
  .filter({ has: this.page.locator('nz-form-label label', { hasText: 'Tên phiếu mục tiêu' }) })
  .locator('nz-input-group input')
```

**Panel/Drawer context:**
```typescript
private get _panel() {
  return this.page.locator('nz-drawer-content, .ant-drawer-body').first()
}
```

**Tab context:**
```typescript
private get _activeTab() {
  return this.page.locator('.ant-tabs-tabpane-active')
}
```

**Kendo textbox (k-textbox):**
```typescript
this.tenNhanVien = page
  .locator('div:has(> div.FieldTitle, > div.FieldValue)')
  .filter({ has: page.locator('div.FieldTitle label', { hasText: 'Tên nhân viên' }) })
  .locator('div.FieldValue input.k-textbox')
```

**Kendo combobox (k-combobox):**
```typescript
this.phongBan = page
  .locator('span.k-combobox')
  .filter({ has: page.locator('input[aria-label*="Phòng ban"]') })
  .locator('input.k-input')
// Khi label khó xác định → dùng formControlName nếu có
this.phongBan = page.locator('[formcontrolname="DepartmentId"] span.k-combobox input.k-input')
```

**MS Date Picker:**
```typescript
this.ngaySinh = page
  .locator('div.ms-date-picker-container')
  .filter({ has: page.locator('.ms-input-title', { hasText: 'Ngày sinh' }) })
  .locator('input.input-date')
```

### 3.4 Sinh action methods từ userflow

Nếu `ActionMap[alias]` có dữ liệu, sinh thêm các method tương ứng:

| Action type | Method sinh ra |
| --- | --- |
| `open-dialog` | `async openCreateForm()` |
| `delete` | `async deleteRecord()` with `handleConfirmDialog` |
| `export` | `async exportExcel()` |
| `filter` | `async openFilter()` + filter field locators |
| `search` | `async search(keyword: string)` |
| `navigate` | `async navigateTo{Screen}()` |

---

## BƯỚC 4 — Sinh Locator Reference (locator-map.md)

Ghi file `.specify/tests/knowledge/{group}/{alias}/locator-map.md`:

```markdown
# Locator Map — {alias}

> Sinh bởi /qc_map_flow — {ISO_DATE}
> Group: {group-code}
> Source: component_temp_{alias}.md + component-rule.md
> Locator file : .specify/tests/pages/{group}/{AliasName}Locator.ts
> Page Object  : .specify/tests/pages/{group}/{alias}/{AliasName}Page.ts

## Toolbar

| Property | Locator expression | Label | Type |
| --- | --- | --- | --- |
| `btnThemMoi` | `page.getByRole('button', { name: 'Thêm mới' })` | Thêm mới | button |

## Form Fields — {context: dialog}

| Property | Locator expression | Label | Component | Required | BasePage Method |
| --- | --- | --- | --- | --- | --- |
| `tenPhieuMucTieu` | `_dialog.locator('vnr-input').filter(...).locator('nz-input-group input')` | Tên phiếu mục tiêu | vnr-input | ✓ | `inputTextbox` |
| `loaiPhieu` | `_dialog.locator('vnr-combobox').filter(...).locator('nz-form-control nz-select')` | Loại phiếu | vnr-combobox | ✓ | `inputCombobox` |

## [TODO] Fields cần xác nhận thủ công

| Field | Vấn đề | Gợi ý |
| --- | --- | --- |
| `[unknown]` field | Label không detect được | Inspect DOM thủ công, tìm theo formControlName |
```

---

## BƯỚC 5 — Cập nhật index

### 5.1 Cập nhật `_IMPACT_INDEX.json` (nếu có)

Nếu `--pbi` được chỉ định và file tồn tại:
- Thêm `page_object_path` vào entry của PBI_ID

### 5.2 Ghi tóm tắt vào flow-index.md (nếu có)

Nếu `.specify/memory/flow-index.md` tồn tại:
- Cập nhật entry của alias với `page_object` field trỏ đến file mới sinh (bao gồm group path)

---

## BÁO CÁO KẾT QUẢ

```
[v] qc_map_flow hoàn thành

Màn hình đã xử lý : {n}
File sinh          : {n*2} files ({n} Locator + {n} Page)

OUTPUT:
  {AliasName}Locator.ts              → .specify/tests/pages/{group}/
  {alias}/{AliasName}Page.ts         → .specify/tests/pages/{group}/{alias}/
  locator-map.md                     → .specify/tests/knowledge/{group}/{alias}/

Chi tiết theo group:

  [hrm]
    ✔ hrm_employee
        Locator : hrm/HrmEmployeeLocator.ts       ({n} locators)
        Page    : hrm/hrm_employee/HrmEmployeePage.ts   ({n} methods)
    ✔ hrm_contract
        Locator : hrm/HrmContractLocator.ts       ({n} locators)
        Page    : hrm/hrm_contract/HrmContractPage.ts   ({n} methods)

  [obj]
    ✔ obj_goal_personal
        Locator : obj/ObjGoalPersonalLocator.ts
        Page    : obj/obj_goal_personal/ObjGoalPersonalPage.ts
    ✗ obj_dashboard → [SKIP] component_temp_obj_dashboard.md không tồn tại

Thống kê locator:
  getByLabel         : {n} fields
  filter + locator   : {n} fields   (custom component)
  getByRole          : {n} buttons
  formControlName    : {n} fields   (fallback)
  [TODO cần confirm] : {n} fields

Bước tiếp theo:
  → Review [TODO] trong locator-map.md — confirm selector thủ công nếu cần
  → Import vào test file:
      import { HrmEmployeePage } from '../pages/hrm/hrm_employee/HrmEmployeePage'
      // Truy cập locator qua page.loc.*
      await page.loc.btnTaoMoi.click()
  → Chạy /qc_generate {PBI_ID} — sẽ tự đọc Page Object khi viết test steps
```

---

## QUY TẮC

- **Tách Locator và Page Object thành 2 file riêng biệt** — Locator file ở `{group}/{AliasName}Locator.ts`, Page file ở `{group}/{alias}/{AliasName}Page.ts`.
- **Locator file không chứa action method** — chỉ khai báo `Locator` property, không import BasePage.
- **Page Object import Locator** qua `this.loc = new {AliasName}Locator(page)` — truy cập locator trong action method qua `this.loc.*`.
- **Không sửa** `component_temp_*.md`, `userflow-{group}.md`, `userflow.md`, `component-rule.md`, hay bất kỳ file INPUT nào.
- **Không dùng `id`** làm locator — Angular/Kendo sinh id dynamic.
- **Không dùng `nth-child` index** nếu có thể xác định bằng label — index giòn, dễ vỡ khi UI thay đổi.
- Nếu **label trùng nhau** trên cùng context → thêm `nth(index)` và ghi `[WARN: label trùng — cần xác nhận]`.
- **Context wrapper** (dialog/panel) phải được áp dụng nhất quán cho mọi locator trong cùng context — không mix context.
- Nếu `userflow-{group}.md` và `userflow.md` đều thiếu → sinh Locator file đầy đủ, Page file chỉ có `goto()`, **không** sinh action methods — ghi `[TODO: thêm action methods sau khi có userflow-{group}.md]`.
- **Ghi đè** nếu file đã tồn tại — luôn là snapshot mới nhất từ component_temp.
- Với field `[unknown]` label → **không bỏ qua** — sinh locator với `[TODO]` comment để reviewer biết cần check.
- Tên property trong Locator dùng **camelCase tiếng Việt không dấu** từ label (ví dụ: `Tên phiếu mục tiêu` → `tenPhieuMucTieu`).

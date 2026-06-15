---
description: "Đọc testcase.md của PBI, lấy tất cả TC có Loại = Auto chưa pass từ Mục 4, bóc tách bước → Page Object/Locator, sinh spec.ts có cấu trúc, thực thi qua playwright-cli + playwright-mcp (chỉ dùng mcp để discovery DOM/component mới), cập nhật PageObject/Locator nếu có component mới, đánh dấu kết quả vào Mục 4."
argument-hint: "<PBI_ID>"
allowed-tools:
  - Bash(playwright-cli:*)
---

# /qc_auto_test

Chạy tự động các TC có `**Loại**: ✅ Auto` trong `testcase.md` (đọc từ **Mục 4**), sinh spec.ts có cấu trúc thật sự, thực thi qua **playwright-cli** (execution) + **playwright-mcp** (chỉ dùng để discovery DOM/component động), cập nhật kết quả vào bảng Mục 4.

> **Nguyên tắc tool**: `playwright-cli` = mọi thao tác thực thi (navigate, fill, click, assert, trace). `playwright-mcp` = **chỉ** dùng khi cần đọc DOM trực tiếp để discovery component mới hoặc xử lý UI động (Kendo combobox popup, auth guard check).

---

## User Input

```text
$ARGUMENTS
```

`PBI_ID` = giá trị sau `/qc_auto_test`. Bắt buộc.

---

## PHÂN CÔNG TOOL (bắt buộc tuân thủ)

### playwright-cli — EXECUTION (tất cả thao tác thực thi)

| Nhiệm vụ | Command |
| --- | --- |
| Load session | `playwright-cli load_storage_state ".specify/tests/user.json"` |
| Save session | `playwright-cli save_storage_state ".specify/tests/user.json"` |
| Trace per-TC | `playwright-cli tracing_start/stop --screenshots --snapshots --sources` |
| Navigate | `playwright-cli navigate "{url}"` |
| Fill textbox | `playwright-cli fill "css={selector}" "{value}"` |
| Click element | `playwright-cli click "css={selector}"` / `"role=button[name='{name}']"` |
| Tick checkbox | `playwright-cli check "css={selector}"` |
| Untick checkbox | `playwright-cli uncheck "css={selector}"` |
| Nhấn phím | `playwright-cli press "css={selector}" "{key}"` |
| **Lấy URL hiện tại** | `playwright-cli evaluate "window.location.href"` |
| **Auth guard check** | `playwright-cli evaluate "window.location.href"` → so sánh chứa login pattern |
| **Capture ID từ DOM** | `playwright-cli evaluate "document.querySelector('[data-id]')?.getAttribute('data-id')"` |
| **Capture text từ DOM** | `playwright-cli evaluate "document.querySelector('{selector}')?.textContent?.trim()"` |
| **Assert visible** | `playwright-cli assert_visible "css={selector}"` |
| **Assert text** | `playwright-cli assert_text "css={selector}" "{expected}"` |
| **Assert URL** | `playwright-cli assert_url "{expected_url}"` |
| **Assert count** | `playwright-cli assert_count "css={selector}" {n}` |
| **Assert hidden** | `playwright-cli assert_hidden "css={selector}"` |
| **Assert value** | `playwright-cli assert_value "css={selector}" "{value}"` |
| Evaluate JS | `playwright-cli evaluate "{expression}"` |
| Chụp ảnh | `playwright-cli screenshot "{path}"` |
| Chạy spec | `playwright-cli run_test "{path}"` / `--grep "TC-{NNN}"` |
| Debug trace | `playwright-cli show_trace "{path}.zip"` |

### playwright-mcp — DISCOVERY ONLY (chỉ 2 trường hợp)

| Nhiệm vụ | Tool | Khi nào dùng |
| --- | --- | --- |
| Đọc DOM/accessibility tree | `browser_snapshot` | **Chỉ** khi tìm selector component mới chưa có trong Locator.ts |
| Kendo combobox dropdown | `browser_click` + `browser_type` + `browser_snapshot` + `browser_click` | Popup động, cần đọc option thực tế từ k-list |

> ⚠️ **playwright-mcp chỉ dùng cho 2 trường hợp trên** — auth guard, capture URL, screenshot lỗi, exploratory assertions đều dùng `playwright-cli`. Không dùng `browser_navigate`, `browser_current_url`, `browser_screenshot` cho bất kỳ mục đích execution nào.

---

## BƯỚC 0 — Kiểm tra điều kiện

> **Nguyên tắc đọc file**: mỗi file được đọc **đúng tại bước cần dùng** — không đọc trước, không gom song song.

### 0.1 Đọc .env → lấy APP_URL

Đọc `.specify/tests/.env`, nếu có `ENV=...` thì đọc tiếp `.specify/tests/.env.{ENV}`. Lấy giá trị `APP_URL`.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/tests/.env`

---

### 0.2 Đọc testcase.md → lọc TC cần chạy

Đọc `.specify/specs/{PBI_ID}/testcase.md`.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/specs/{PBI_ID}/testcase.md`

**Cấu trúc Mục 4** (Section 4) trong testcase.md:

```markdown
## 4. Danh sách Test Case

| TC | Tên | Loại | Ưu tiên | ⭐ | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Hiển thị form | ✅ Auto | --uutien | ⭐ | ⬜ Chưa test |
| TC-002 | Lưu thành công | ✅ Auto | p0 | | ⬜ Chưa test |
| TC-003 | Validation lỗi | ✅ Auto | p1 | | ✅ PASSED |
| TC-004 | Export file | ✅ Auto | p1 | | ❌ FAILED |
| TC-005 | Xem chi tiết | 🖐 Manual | p2 | | ⬜ Chưa test |
```

**Lọc TC cần chạy** — thỏa đồng thời:
- Cột `Loại` = `✅ Auto`
- Cột `Trạng thái` ≠ `✅ PASSED`

**Sắp xếp thứ tự chạy:**

| Thứ tự | Nhãn | Quy tắc dừng |
| --- | --- | --- |
| 1 | `--uutien` | FAILED → **dừng toàn bộ batch** |
| 2 | `p0` | — |
| 3 | `p1` | — |
| 4 | `p2` | — |
| 5+ | `p3+` / không nhãn | — |

Nếu tất cả đã PASSED → báo và dừng.

Tạo thư mục output:
- `.specify/tests/playwright/{PBI_ID}/`
- `.specify/specs/{PBI_ID}/auto_test_results/screenshots/`
- `.specify/specs/{PBI_ID}/auto_test_results/traces/`

---

### 0.3 Đọc sub-system-map.json → xác định màn hình cần test

Đọc `.specify/memory/sub-system-map.json` sau khi đã biết danh sách TC.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/memory/sub-system-map.json`

Từ danh sách TC vừa lọc, tìm các màn hình liên quan theo alias / URL trong bước testcase.

---

### 0.4 Bóc tách Page Object & Locator cho từng màn hình

**Đây là bước quan trọng nhất** — mọi selector dùng trong spec.ts đều xuất phát từ đây.

> **Đọc file theo từng màn hình** — không đọc tất cả cùng lúc. Với mỗi màn hình, đọc đúng 2 file của màn hình đó trước khi chuyển sang màn hình tiếp theo.

#### 0.4.1 Tra cứu từ sub-system-map.json (đã đọc ở 0.3)

Cấu trúc sub-system-map.json:

```json
{
  "screens": {
    "{alias}": {
      "group": "...",
      "url": "...",
      "pageObject": ".specify/tests/pages/{group}/{AliasName}Page.ts",
      "locator": ".specify/tests/pages/{group}/{AliasName}Locator.ts"
    }
  }
}
```

Với **mỗi màn hình** (xử lý tuần tự):
1. Lấy đường dẫn `pageObject` + `locator` từ sub-system-map.json
2. Đọc `{AliasName}Locator.ts` → extract tất cả selector constants
3. Đọc `{AliasName}Page.ts` → extract tất cả method names + signatures
4. Build bảng ánh xạ nội bộ cho màn hình đó
5. Chuyển sang màn hình tiếp theo

Nếu Locator.ts / Page.ts chưa tồn tại → ghi nhận `[MISSING]`, sẽ discovery qua mcp ở BƯỚC 2.4.

#### 0.4.2 Bảng ánh xạ nội bộ per-màn hình

Sau khi đọc xong, ghi nhận nội bộ dạng:

```
Màn hình: {AliasName} ({url})
  SELECTORS: FORM_LOAI_NGAY_NGHI, FORM_NGAY_BAT_DAU, BTN_LUU, ...
  METHODS:   goto(), openCreateForm(), fillCreateForm(), submitForm(), ...
```

#### 0.4.3 Phát hiện selector còn thiếu

Rà soát từng bước trong testcase.md — nếu bước nhắc đến field/element **chưa có** trong Locator.ts → đánh dấu `[MISSING_SELECTOR]`, sẽ discovery qua playwright-mcp ở BƯỚC 2.4.

In tổng kết:

```
📦 Màn hình đã nạp:
  {alias} ({url})
    Locator.ts: {n} selectors ✅
    Page.ts: {n} methods ✅
    [MISSING_SELECTOR]: {danh sách field chưa có}

  {alias2} → ⚠️ Chưa có Locator — toàn bộ selector sẽ discovery qua mcp
```

---

### 0.5 Cập nhật cột ⭐ trong Mục 4

Kiểm tra bảng Mục 4 (dữ liệu đã đọc ở 0.2):
- Nếu chưa có cột `⭐` → thêm cột vào bảng
- Điền `⭐` cho TC có Ưu tiên = `--uutien`, bỏ trống với TC khác
- Lưu lại testcase.md

---

### 0.6 Khởi tạo Runtime Context — kho dữ liệu liên TC

> **Nguyên tắc cốt lõi**: dữ liệu thực tế sinh ra sau mỗi TC (ID record, tên đã lưu, giá trị đã chọn, URL trang vừa tạo…) được lưu vào `runtime_context` và **ưu tiên sử dụng cho các TC phía sau** thay vì hard-code lại hay dùng datafake.json một mình.

Khởi tạo bảng `runtime_context` trong bộ nhớ phiên làm việc (không ghi file):

```
runtime_context = {
  created_records: [],     // [{tc: "TC-001", entity: "LeaveType", id: "...", name: "...", url: "..."}]
  selected_values: {},     // {fieldName: "giá trị đã chọn thực tế"} — từ combobox, checkbox...
  captured_urls: {},       // {alias: "URL thực tế sau navigate"}
  last_toast: "",          // toast text cuối cùng được assert thành công
  form_snapshots: {}       // {tc: snapshot DOM form sau submit — để verify ở TC sau}
}
```

**Phân tích phụ thuộc data giữa các TC** — đọc testcase.md đã có để xác định:
- TC nào **sinh data** (tạo mới / cập nhật / xóa)
- TC nào **dùng data** từ TC trước (xem chi tiết, sửa, xóa, lọc theo record đã tạo)

Ghi nhận chuỗi phụ thuộc nội bộ:

```
📊 Chuỗi dữ liệu phát hiện:
  TC-001 (tạo loại nghỉ "Nghỉ phép năm") → sinh: entity_id, entity_name
  TC-003 (xem chi tiết)  → dùng: entity_id từ TC-001
  TC-004 (sửa tên)       → dùng: entity_id từ TC-001, sinh: entity_name mới
  TC-005 (xóa)           → dùng: entity_id từ TC-001 (hoặc TC-004 nếu đã sửa)
  TC-006 (lọc danh sách) → dùng: entity_name từ TC-001/TC-004
```

Nếu không có chuỗi phụ thuộc → ghi nhận `runtime_context: độc lập — mỗi TC tự dùng datafake.json`.

---

## BƯỚC 1 — Load session + Login check

### 1.1 Đọc user.json → load session

Đọc `.specify/tests/user.json`.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/tests/user.json`

Dùng `playwright-cli load_storage_state` để load session từ file này.

Nếu `load_storage_state` thất bại (file lỗi / format không hợp lệ) → ghi nhận `SESSION_LOAD_FAIL`, chuyển thẳng sang **1.2.1**.

### 1.2 Login check sau khi load session

Dùng `playwright-cli navigate` điều hướng đến `{APP_URL}`, sau đó kiểm tra:
- `browser_current_url` (mcp) → kiểm tra URL có chứa login pattern không (`/login`, `/sign-in`, `/auth`, `#/login`, `/dang-nhap`)
- `browser_snapshot` (mcp) → tìm auth indicators: `[class*="user-info"]`, `[class*="avatar"]`, `.k-avatar`, `[class*="username"]`, `#user-display-name`

**Nếu PASSED** (URL không phải login page + có auth indicator) → tiếp tục **1.3**

**Nếu FAILED** (redirect về login page / không thấy auth element) → chuyển sang **1.2.1**

### 1.2.1 Thực hiện login (khi session load fail hoặc session hết hạn)

Báo: `⚠️ Session không hợp lệ hoặc đã hết hạn — thực hiện đăng nhập tự động...`

**A. Lấy credentials từ .env**

Đọc `.specify/tests/.env` (và `.specify/tests/.env.{ENV}` nếu có) — lấy:
- `LOGIN_USERNAME` (hoặc `APP_USERNAME`)
- `LOGIN_PASSWORD` (hoặc `APP_PASSWORD`)

Nếu thiếu credentials → **DỪNG**: `⛔ Không tìm thấy LOGIN_USERNAME / LOGIN_PASSWORD trong .env — không thể tự động login`

**B. Discovery login form qua mcp**

Nếu chưa ở login page → `playwright-cli navigate` đến `{APP_URL}` để kích hoạt redirect về trang login.

Dùng `browser_snapshot` (mcp) đọc DOM trang login, xác định selector thực tế của:
- Field username: ưu tiên `[name="username"]`, `[name="email"]`, `[id*="user"]`, `[placeholder*="user"]`, `[placeholder*="email"]`, fallback `input[type="text"]:first-of-type`
- Field password: ưu tiên `[name="password"]`, `[id*="pass"]`, `input[type="password"]`
- Button submit: ưu tiên `button[type="submit"]`, `role=button[name*="login"]`, `role=button[name*="đăng nhập"]`, `role=button[name*="Sign in"]`

**C. Điền và submit form**

```
playwright-cli fill "{username_selector}" "{LOGIN_USERNAME}"
playwright-cli fill "{password_selector}" "{LOGIN_PASSWORD}"
playwright-cli click "{submit_selector}"
```

Sau click submit, đợi tối đa 5s để trang chuyển hướng: kiểm tra URL thay đổi khỏi login page hoặc auth element xuất hiện.

### 1.2.2 Kiểm tra login sau khi đăng nhập

Lặp lại kiểm tra như 1.2:
- `browser_current_url` (mcp) → URL không còn là login page
- `browser_snapshot` (mcp) → có auth indicators (`[class*="user-info"]`, `[class*="avatar"]`, `.k-avatar`, `[class*="username"]`, `#user-display-name`)

**Nếu PASSED** → tiếp tục **1.3**

**Nếu FAILED** → **DỪNG**:

```
⛔ LOGIN THẤT BẠI — Dừng toàn bộ batch
Lý do: {URL hiện tại} | {Không thấy auth element / thông báo lỗi login nếu có}
Gợi ý: Kiểm tra lại LOGIN_USERNAME / LOGIN_PASSWORD trong .specify/tests/.env
```

### 1.3 Lưu lại session sau khi login check thành công

Ngay sau khi login check PASSED (tại 1.2 hoặc 1.2.2), dùng `playwright-cli save_storage_state` ghi đè `.specify/tests/user.json` với session hiện tại — cookie và localStorage vừa được xác thực, đảm bảo lần test tiếp theo không bị lỗi session hết hạn.

---

## BƯỚC 2 — Sinh spec.ts có cấu trúc

### 2.1 Đọc datafake.json

Đọc `.specify/tests/playwright/{PBI_ID}/datafake.json` trước khi sinh spec — cần biết keys/values để mapping vào test data.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/tests/playwright/{PBI_ID}/datafake.json`

### 2.2 Cấu trúc spec.ts chuẩn

Sinh **2 loại spec** vào thư mục `.specify/tests/playwright/{PBI_ID}/`:

| File | Nội dung | Mục đích |
| --- | --- | --- |
| `.specify/tests/playwright/{PBI_ID}/{PBI_ID}.spec.ts` | Tất cả TC trong 1 file | Chạy toàn bộ batch |
| `.specify/tests/playwright/{PBI_ID}/{TC_ID}.spec.ts` | 1 file / 1 TC | Rerun đơn lẻ từng TC |

> **Lưu ý `playwright.config.ts`**: đảm bảo `testDir: './playwright'` (không phải `'./tests'`). Nếu chưa đúng → sửa trước khi chạy.

**Import rules bắt buộc** — `tsconfig.json` có `baseUrl: "."` (= `.specify/tests/`):

```typescript
// Page Object — dùng baseUrl path (không có ./ hay ../)
import { CatBankPage } from 'pages/{group}/{alias}/{AliasName}Page'

// datafake — cùng thư mục với spec
import datafake from './datafake.json'

// ❌ SAI — đừng dùng
import { CatBankPage } from '../pages/...'
import { CatBankPage } from '../../../../.specify/tests/pages/...'
```

Cấu trúc mỗi spec file:

- **Header comment**: PBI_ID, tên PBI, ngày sinh, hướng dẫn rerun/grep
- **Import**: Page Object qua `baseUrl` path, datafake qua `'./datafake.json'`
- **Không import Locator.ts trực tiếp** — dùng qua Page Object
- **`runtimeContext` object** khai báo ở scope ngoài cùng — chia sẻ data giữa các `test()` block:

```typescript
// Runtime context — data sinh ra từ TC trước dùng cho TC sau
const runtimeContext: {
  createdId?: string;
  createdName?: string;
  createdUrl?: string;
  selectedValues: Record<string, string>;
  lastToast?: string;
} = { selectedValues: {} };
```

- **Helper functions**: `waitForToast()`, `checkAuthGuard()`, `captureCreatedRecord()`
- **`test.describe` theo nhóm ưu tiên**: `⭐ --uutien` → `p0` → `p1` → ...
- **`test.beforeEach`** trong mỗi describe: gọi `checkAuthGuard()`
- **Mỗi TC → 1 `test()` block** với tag `@{PBI_ID}`, `@auto`, `@{priority}`
- **TC sinh data** → ghi vào `runtimeContext` sau khi assert thành công
- **TC dùng data** → đọc từ `runtimeContext` (fallback về `datafake` nếu context chưa có)

### 2.3 Quy tắc dịch bước testcase → code spec

| Bước testcase.md | Code trong spec.ts |
| --- | --- |
| `Điều hướng đến {alias}` | `await screenPage.goto()` — dùng method từ Page.ts |
| `inputTextbox("{label}", "{value}")` | `await page.fill({AliasName}Locator.{FIELD_CONST}, datafake.{key})` |
| `inputCombobox("{label}", "{value}")` | Kendo sequence — xem BƯỚC 3.3 |
| `inputCheckbox("{label}", true/false)` | `await page.check/uncheck({AliasName}Locator.{FIELD_CONST})` |
| `Click **{button}**` | `await screenPage.submitForm()` hoặc `await page.click({AliasName}Locator.BTN_{NAME})` |
| Toast: `"{text}"` | `await waitForToast(page, '{text}')` |
| Verify field value | `await expect(page.locator({AliasName}Locator.{FIELD})).toHaveValue('{val}')` |
| Verify element visible | `await expect(page.locator({AliasName}Locator.{ELEMENT})).toBeVisible()` |
| Verify count | `await expect(page.locator({AliasName}Locator.{LIST})).toHaveCount(n)` |

> **Selector constant naming**: dùng SNAKE_CASE ALL_CAPS từ Locator.ts (`FORM_LEAVE_TYPE`, `BTN_SAVE`, `GRID_ROW`).

#### 2.3.1 Quy tắc dùng data từ TC trước (data chaining)

Với TC **dùng data** từ TC trước (phát hiện ở 0.6), ưu tiên nguồn data theo thứ tự:

| Thứ tự | Nguồn | Khi nào dùng |
| --- | --- | --- |
| 1 | `runtimeContext.createdId` / `.createdName` | TC trước đã tạo record thành công |
| 2 | `datafake.{key}` | Chưa có runtime context (chạy độc lập / TC đầu tiên) |
| 3 | Giá trị hard-code từ bước testcase | Chỉ khi cả 2 nguồn trên đều không phù hợp |

Code pattern cho TC dùng data:

```typescript
test('TC-003 — Xem chi tiết record vừa tạo @TC-003', async ({ page }) => {
  // Dùng ID từ TC-001 nếu đã chạy, fallback về datafake
  const targetId = runtimeContext.createdId ?? datafake.existingRecordId;
  await screenPage.goto();
  await page.click(`[data-id="${targetId}"]`);
  // ... assertions
});
```

Code pattern cho TC sinh data (capture vào runtimeContext):

```typescript
test('TC-001 — Tạo mới thành công @TC-001', async ({ page }) => {
  await screenPage.openCreateForm();
  await page.fill(LeaveTypeLocator.FORM_NAME, datafake.leaveName);
  await screenPage.submitForm();
  await waitForToast(page, 'Lưu thành công');

  // Capture data thực tế vào runtimeContext
  runtimeContext.createdName = datafake.leaveName;
  runtimeContext.createdUrl = page.url();
  const idEl = await page.locator('[data-id]').first().getAttribute('data-id');
  if (idEl) runtimeContext.createdId = idEl;
});
```

#### 2.3.2 Quy tắc sinh Exploratory Assertions tự động

Với mỗi TC **sinh data** (tạo / sửa / xóa), sau các assertion chính trong testcase.md, tự động thêm **exploratory assertion block** — toàn bộ dùng `playwright-cli assert_*` và `playwright-cli evaluate`:

```
// === EXPLORATORY ASSERTIONS (tự sinh — dùng playwright-cli) ===

// Kiểm tra record xuất hiện trong danh sách
playwright-cli navigate "{list_url}"
playwright-cli assert_text "css={grid_row_selector}" "{datafake.recordName}"

// Kiểm tra URL hợp lệ (không phải error page)
playwright-cli evaluate "window.location.href"
// → assert kết quả không chứa "error", "404", "500"

// Kiểm tra không còn loading indicator
playwright-cli assert_hidden "css=.k-loading-mask, [class*='loading']"
```

Danh sách exploratory assertions theo loại TC — tất cả dùng `playwright-cli`:

| Loại TC | Exploratory assertions tự sinh |
| --- | --- |
| **Tạo mới** | 1) `assert_text` record xuất hiện trong grid/list với đúng tên. 2) `evaluate "window.location.href"` → URL là list page hoặc detail page (không phải form tạo mới). 3) `assert_hidden` toast lỗi. 4) `assert_count` số row tăng thêm 1 (chỉ khi grid không phân trang). |
| **Sửa / Cập nhật** | 1) `assert_value` hoặc `assert_text` giá trị mới hiển thị đúng trong form/grid. 2) `assert_text` không còn tên cũ tại ô đó (nếu rename). 3) `evaluate` lấy modified_date → assert không rỗng. |
| **Xóa** | 1) `assert_hidden` hoặc `assert_count 0` record đã xóa. 2) `assert_count` số row giảm 1. 3) `navigate` đến URL cũ của record → `evaluate "window.location.href"` kiểm tra redirect hoặc `assert_visible` error message. |
| **Validation lỗi** | 1) `assert_visible` form vẫn còn mở (dialog/panel không đóng). 2) `assert_value` các field hợp lệ không bị xóa trắng. 3) `assert_visible` error message đúng field bị lỗi. |
| **Tìm kiếm / Lọc** | 1) `assert_text` chỉ hiện record khớp filter. 2) `assert_count` số row ≤ tổng record (dùng `evaluate` đếm tổng nếu cần). 3) `click` clear filter → `assert_count` grid trở về số row ban đầu. |

### 2.4 Xử lý [MISSING_SELECTOR] — discovery qua mcp

Với mỗi field/element đánh dấu `[MISSING_SELECTOR]` ở BƯỚC 0.4.3:

1. Dùng `playwright-cli navigate` đến URL màn hình, `playwright-cli click` mở form nếu cần
2. Dùng `browser_snapshot` (mcp) để đọc DOM
3. Phân tích snapshot → tìm selector phù hợp (ưu tiên: `data-field`, `name`, `id`, `aria-label`, `data-testid`; hạn chế: `nth-child`, positional)
4. Thêm selector constant mới vào `{AliasName}Locator.ts`
5. Thêm method mới vào `{AliasName}Page.ts` nếu cần

### 2.5 Cập nhật PageObject & Locator khi phát hiện component mới

Sau khi discovery xong, cập nhật **3 file** theo thứ tự:

**A. Cập nhật `.specify/memory/components/component_{alias}.md`**

Đọc file `component_{alias}.md` tương ứng với màn hình (alias = URL path segment, ví dụ `cat_leave_day_type`). Thêm component mới vào đúng section loại component (`k-textbox`, `k-combobox`, `checkbox`, ...) — nếu section chưa có thì tạo mới. Ghi chú `[NEW - phát hiện trong /qc_auto_test {PBI_ID}]` ở cuối dòng label.

Ví dụ thêm vào section `k-combobox`:

```markdown
| 4 | Giới tính áp dụng | ApplyGender | — | — | dialog | [NEW - /qc_auto_test {PBI_ID}] |
```

Nếu file `component_{alias}.md` chưa tồn tại → tạo mới tại `.specify/memory/components/component_{alias}.md` với header chuẩn và section tương ứng.

**B. Cập nhật `{AliasName}Locator.ts`**

Thêm selector constant mới với comment `// Phát hiện trong /qc_auto_test {PBI_ID}`.

**C. Cập nhật `{AliasName}Page.ts`**

Thêm method mới nếu cần (đặc biệt với Kendo combobox cần sequence riêng).

**D. Đánh giá component mới có cần testcase không**

Với mỗi component / locator / method mới phát hiện, đánh giá xem nó có logic nghiệp vụ cần verify không:

- **Cần TC mới** nếu: component có validation, giá trị ảnh hưởng đến flow khác, field bắt buộc, hoặc có điều kiện hiển thị/ẩn
- **Không cần TC mới** nếu: field chỉ là metadata phụ, đã được cover bởi TC hiện có, hoặc không có business rule

Các TC phát sinh từ component mới được coi là **`--uutien`** vì chưa từng được test.

**E. Cập nhật testcase.md nếu có TC mới**

Nếu có TC mới cần thêm:

1. Đọc lại `testcase.md` để kiểm tra duplicate — so sánh theo mục tiêu + bước thực hiện + màn hình; nếu đã có TC cover cùng scenario → **bỏ qua, không thêm**
2. Thêm TC mới vào đúng section trong testcase.md (cùng nhóm với màn hình liên quan)
3. Cập nhật bảng Mục 4: thêm dòng mới với `Loại = ✅ Auto`, `Ưu tiên = --uutien`, `⭐ = ⭐`, `Trạng thái = ⬜ Chưa test`
4. Cập nhật bảng Tóm tắt (số lượng TC)
5. Bổ sung TC mới vào danh sách batch hiện tại để chạy ngay trong lần này (ưu tiên đầu tiên do là `--uutien`)

In báo cáo component mới:

```
🔍 Component mới phát hiện & cập nhật:
  component_{alias}.md: + ApplyGender (k-combobox), + IsRequireConsecutive (checkbox)
  {AliasName}Locator.ts: + FIELD_APPLY_GENDER, + FIELD_IS_CONSECUTIVE
  {AliasName}Page.ts: + selectApplyGender(value)

📋 TC mới sinh từ component mới (--uutien):
  TC-026 — ApplyGender: NV nữ thấy loại Female trong dropdown   [mới, chạy ngay]
  TC-027 — IsRequireConsecutive: toggle hiện/ẩn field MaxDays   [mới, chạy ngay]
  (Không thêm) TC tương tự TC-006 đã có — bỏ qua duplicate
```

---

## BƯỚC 3 — Thực thi TC (playwright-cli chính, mcp khi cần)

Thực thi từng TC **tuần tự** theo thứ tự ưu tiên.

### 3.1 Vòng lặp per-TC

Với mỗi TC theo thứ tự `[--uutien] → [p0] → [p1] → ...`:

**A. Bắt đầu trace**: `playwright-cli tracing_start --screenshots --snapshots --sources`

**B. Auth guard trước TC**: dùng `playwright-cli evaluate "window.location.href"` kiểm tra URL — nếu là login page → `AUTH_EXPIRED` → DỪNG batch

**C. Inject runtime context vào TC**

Trước khi thực thi bước đầu tiên, kiểm tra `runtime_context`:
- Nếu TC này thuộc danh sách "dùng data" (phát hiện ở 0.6) → log nguồn data sẽ dùng:
  ```
  🔗 [TC-003] Dùng runtimeContext.createdId = "{id}" (từ TC-001)
  ```
- Nếu `runtime_context` chưa có giá trị cần thiết (TC trước chưa chạy / FAILED) → log fallback:
  ```
  ⚠️ [TC-003] runtimeContext.createdId chưa có — fallback về datafake.existingRecordId
  ```

**D. Thực thi bước**: dùng playwright-cli theo bảng PHÂN CÔNG, sau mỗi navigate kiểm tra auth guard, Kendo combobox dùng mcp sequence (xem 3.3)

**E. Assertion chính**: dùng `playwright-cli assert_*` (xem 3.4)

**F. Capture runtime context** (chỉ sau khi assertion chính PASSED)

Với TC **sinh data**, capture ngay sau khi assert toast thành công — toàn bộ dùng `playwright-cli`:

```
// Capture ID từ DOM (ưu tiên theo thứ tự):
// 1. data-id attribute trên row/item mới nhất trong grid
// 2. ID từ URL nếu redirect sang trang detail (e.g. /detail/123)
// 3. Text content của field ID nếu hiển thị trên form
playwright-cli evaluate "
  document.querySelector('[data-id]')?.getAttribute('data-id')
  || location.pathname.match(/\\/([\\d]+)$/)?.[1]
"
→ ghi vào runtime_context.created_records + runtime_context.createdId

// Capture tên đã lưu (verify đúng với datafake):
playwright-cli evaluate "
  document.querySelector('[data-field=\"name\"], .record-name')?.textContent?.trim()
"
→ ghi vào runtime_context.createdName

// Capture URL hiện tại:
playwright-cli evaluate "window.location.href"
→ ghi vào runtime_context.createdUrl + runtime_context.captured_urls[alias]

// Capture giá trị combobox đã chọn (từ input value):
playwright-cli evaluate "
  document.querySelector('{combobox_selector}')?.value
"
→ ghi vào runtime_context.selected_values[fieldName]
```

Log capture:
```
📥 [TC-001] Captured → id: "42", name: "Nghỉ phép năm", url: "/leave-types/42"
```

**G. Exploratory assertions** (tự sinh theo loại TC — xem 2.3.2)

Thực thi exploratory assertion block **sau** assertion chính đã PASSED — toàn bộ dùng `playwright-cli assert_*` và `playwright-cli evaluate`. Nếu exploratory assertion thất bại:
- KHÔNG đổi trạng thái TC thành FAILED
- Ghi nhận `⚠️ EXPLORATORY_WARN: {mô tả}` trong summary
- Tiếp tục TC tiếp theo

**H. Kết thúc TC**: `playwright-cli tracing_stop` lưu vào `traces/TC-{NNN}.zip`, ghi nhận kết quả, cập nhật Mục 4 ngay

**I. Kiểm tra dừng**: `--uutien` FAILED hoặc `AUTH_EXPIRED` → DỪNG toàn bộ batch

### 3.2 Cách bóc tách selector khi thực thi

Với mỗi bước fill/click, lookup selector theo thứ tự ưu tiên:
1. Method trong `{AliasName}Page.ts` (ưu tiên nhất — đã đóng gói)
2. Constant trong `{AliasName}Locator.ts`
3. Selector discovery mới từ BƯỚC 2.4 (đã thêm vào Locator.ts)
4. `browser_snapshot` trực tiếp (chỉ khi 1–3 đều không có)

### 3.3 Kendo combobox (playwright-mcp sequence)

1. `playwright-cli click` mở input combobox
2. `browser_type` (mcp) gõ text để filter
3. `browser_snapshot` (mcp) đọc k-list popup, xác định option phù hợp
4. `browser_click` (mcp) click option từ ref trong snapshot

Trong spec.ts: gọi method của Page Object nếu đã có, nếu chưa thì inline.

### 3.4 Ánh xạ assertion → playwright-cli

| Kết quả mong đợi | playwright-cli assertion |
| --- | --- |
| Toast / thông báo `"{text}"` | `playwright-cli assert_text "css=.k-notification,[class*='toast']" "{text}"` |
| Element visible | `playwright-cli assert_visible "css={selector}"` |
| Element hidden | `playwright-cli assert_hidden "css={selector}"` |
| URL sau action | `playwright-cli assert_url "{url}"` |
| Số row/item = n | `playwright-cli assert_count "css={selector}" {n}` |
| Field value = `"{val}"` | `playwright-cli assert_value "css={selector}" "{val}"` |
| Element chứa text | `playwright-cli assert_text "css={selector}" "{text}"` |
| JS assertion phức tạp | `playwright-cli evaluate "{expression}"` → so sánh kết quả |

### 3.5 Auth guard

Sau mỗi `playwright-cli navigate`, dùng `playwright-cli evaluate "window.location.href"` kiểm tra URL trả về. Nếu URL chứa `/login`, `/sign-in`, `#/login`:
- Dùng `playwright-cli screenshot` lưu ảnh bằng chứng vào `screenshots/TC-{NNN}-auth-expired.png`
- DỪNG TC hiện tại + toàn bộ batch còn lại
- Báo: `⛔ AUTH_EXPIRED tại TC-{NNN} bước "{tên bước}"`

### 3.6 Xử lý TC FAILED

1. `playwright-cli screenshot` lưu vào `screenshots/TC-{NNN}-fail-step{n}.png`
2. `browser_snapshot` (mcp) đọc DOM tại thời điểm lỗi
3. `playwright-cli evaluate` lấy error message từ `.k-notification, [class*=error]`
4. `playwright-cli tracing_stop` lưu vào `traces/TC-{NNN}.zip`
5. Ghi nhận: bước lỗi | expected | actual | screenshot path | trace path
6. Đánh dấu FAILED → tiếp tục TC tiếp theo (trừ `--uutien`)

### 3.7 Tiền điều kiện

- **"Đã đăng nhập"** → pass qua BƯỚC 1
- **"Tồn tại record X"** → `playwright-cli navigate` + `playwright-cli assert_visible` xác nhận; không thấy → `⏭ SKIPPED (precondition)`
- **Phức tạp** → `⏭ SKIPPED (requires manual setup)`

### 3.8 [TODO] trong kết quả mong đợi

Bỏ qua assertion đó → `⏭ SKIPPED (TODO assertion)`.

---

## BƯỚC 4 — Xác định & cập nhật kết quả

### 4.1 Trạng thái

| Trạng thái | Điều kiện |
| --- | --- |
| `✅ PASSED` | Tất cả assertion chính pass |
| `❌ FAILED` | Ít nhất 1 assertion chính thất bại |
| `⏭ SKIPPED` | Precondition không thỏa / [TODO] |
| `⏸ NOT_RUN` | Dừng do --uutien FAILED / AUTH_EXPIRED |

> **Exploratory warnings** KHÔNG ảnh hưởng trạng thái TC — chỉ ghi nhận riêng trong summary.

### 4.2 Cập nhật Mục 4 — ngay sau mỗi TC

**Chỉ cập nhật cột Trạng thái + đảm bảo cột ⭐ đã đúng** — KHÔNG thêm dòng vào cuối TC.

```markdown
| TC-001 | Hiển thị form | ✅ Auto | --uutien | ⭐ | ✅ PASSED |
| TC-002 | Lưu thành công | ✅ Auto | p0 | | ✅ PASSED |
| TC-004 | Export file | ✅ Auto | p1 | | ❌ FAILED |
```

### 4.3 Quy tắc không chạy lại

| Trạng thái | Hành động lần sau |
| --- | --- |
| `✅ PASSED` | Bỏ qua — không chạy lại |
| `❌ FAILED` | Bỏ qua — không chạy lại |
| `⏭ SKIPPED` | **Chạy lại** |
| `⬜ Chưa test` | **Chạy lại** |

---

## BƯỚC 5 — Ghi file tóm tắt

Ghi `.specify/specs/{PBI_ID}/auto_test_results/run-{DATETIME}-summary.md`:

```markdown
# Run Summary — {PBI_ID}

> Chạy lúc      : {ISO_DATETIME}
> Engine        : playwright-cli (execution) + playwright-mcp (discovery)
> Login check   : ✅ PASSED
> Spec batch    : playwright/{PBI_ID}/{PBI_ID}.spec.ts
> Spec đơn lẻ  : playwright/{PBI_ID}/{TC_ID}.spec.ts (mỗi TC 1 file)

## Runtime Context tích lũy

| TC sinh data | Entity | ID capture | Name capture | URL capture |
| --- | --- | --- | --- | --- |
| TC-001 | LeaveType | "42" | "Nghỉ phép năm" | /leave-types/42 |
| TC-004 | LeaveType | "42" | "Nghỉ phép (đã sửa)" | — |

## Data Chaining log

| TC dùng data | Nguồn | Giá trị thực tế |
| --- | --- | --- |
| TC-003 | runtimeContext.createdId (từ TC-001) | "42" |
| TC-005 | runtimeContext.createdId (từ TC-001) | "42" |
| TC-006 | datafake.existingName (fallback — TC-001 chưa chạy) | "Nghỉ phép" |

## Exploratory Warnings

| TC | Loại | Mô tả |
| --- | --- | --- |
| TC-001 | EXPLORATORY_WARN | Grid count không tăng thêm 1 — có thể do phân trang |
| TC-002 | EXPLORATORY_WARN | Modified date blank — field chưa hiển thị trên UI |

## Component mới phát hiện
{AliasName}Locator.ts: +{n} selectors
{AliasName}Page.ts: +{n} methods

## Thứ tự chạy

| # | TC | Tên | ⭐ | Ưu tiên | Kết quả | Trace | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TC-001 | {Tên} | ⭐ | --uutien | ✅ PASSED | traces/TC-001.zip | — |
| 2 | TC-002 | {Tên} | | p0 | ✅ PASSED | traces/TC-002.zip | — |
| 3 | TC-004 | {Tên} | | p1 | ❌ FAILED | traces/TC-004.zip | screenshots/TC-004-fail-step3.png |

## FAILED Details

### TC-004 — {Tên TC}
- **Bước lỗi** : {tên bước}
- **Expected** : {expected}
- **Actual**   : {actual}
- **Selector** : {selector đã dùng} — kiểm tra Locator.ts
- **Screenshot**: screenshots/TC-004-fail-step3.png
- **Trace**    : `playwright-cli show_trace traces/TC-004.zip`

## Tổng kết
- ✅ PASSED  : {n}
- ❌ FAILED  : {n}
- ⏭ SKIPPED : {n}
- ⏸ NOT_RUN : {n}
```

---

## BƯỚC 6 — Cập nhật HISTORY.md

Append vào `.specify/specs/{PBI_ID}/auto_test_results/HISTORY.md`:

```markdown
| Lần | Datetime | Engine | ✅ | ❌ | ⏭ | ⏸ | Dừng do | New components | Summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #3 | 2026-06-11 | cli+mcp | 6 | 1 | 1 | 0 | — | +3 selectors | [link](run-...) |
```

---

## BƯỚC 7 — Cập nhật bảng Tóm tắt trong testcase.md

```markdown
| Nhóm | ✅ Auto | ⚠️ Semi-Auto | 🖐 Manual | Tổng | Priority | ✅ Passed |
| --- | --- | --- | --- | --- | --- | --- |
| Cấu hình field mới | 4 | 1 | 0 | 5 | P1 | 3/4 |
| **Tổng** | **13** | **7** | **1** | **21** | — | **8/13** |
```

---

## BÁO CÁO KẾT QUẢ

```
[v] qc_auto_test hoàn thành — PBI {PBI_ID}

Chạy lúc     : {ISO_DATETIME}
Engine       : playwright-cli (execution) + playwright-mcp (discovery only)
Login check  : ✅ OK
Màn hình     : {n} màn hình | {n} Locator.ts đã đọc | {n} Page.ts đã đọc
Thứ tự chạy : --uutien → p0 → p1 → ...

Data Chaining:
  TC-001 → sinh id="42", name="Nghỉ phép năm" (dùng bởi TC-003, TC-005, TC-006)
  TC-003 ← runtimeContext.createdId = "42" (từ TC-001) ✅
  TC-006 ← datafake.existingName (fallback — TC-001 chưa chạy lần trước) ⚠️

Kết quả:
  ✅ PASSED  : {n} TC  → {danh sách}
  ❌ FAILED  : {n} TC  → {danh sách}
  ⏭ SKIPPED : {n} TC  → {danh sách}
  ⏸ NOT_RUN : {n} TC  → {danh sách}

⚠️ Exploratory Warnings ({n}):
  TC-001: Grid count không tăng thêm 1 — có thể do phân trang ẩn
  TC-002: Modified date blank — field chưa hiển thị trên UI

🔍 Component mới phát hiện & cập nhật:
  {AliasName}Locator.ts: +{n} selectors ({danh sách})
  {AliasName}Page.ts: +{n} methods ({danh sách})

FAILED details:
  TC-XXX: {bước lỗi} | Selector: {selector} | Expected: {x} | Actual: {y}
         Screenshot: screenshots/TC-XXX-fail-step{n}.png
         Trace: playwright-cli show_trace traces/TC-XXX.zip

OUTPUT (auto_test_results/):
  traces/TC-*.zip                 ← trace per-TC
  screenshots/TC-*-fail-*.png     ← ảnh lỗi
  run-{DATETIME}-summary.md
  HISTORY.md

Spec (playwright/{PBI_ID}/):
  {PBI_ID}.spec.ts                ← tất cả TC
  {TC_ID}.spec.ts                 ← từng TC riêng lẻ

Testcase.md Mục 4: cập nhật ⭐ column + {n} TC trạng thái

Rerun spec (từ .specify/tests/):
  npx playwright test playwright/{PBI_ID}/{PBI_ID}.spec.ts
  npx playwright test playwright/{PBI_ID}/{TC_ID}.spec.ts
  npx playwright test playwright/{PBI_ID}/{PBI_ID}.spec.ts --grep "TC-004"
```

---

## CẤU TRÚC THƯ MỤC

```
.specify/
  tests/
    playwright/
      {PBI_ID}/
        {PBI_ID}.spec.ts          ← tất cả TC trong 1 file (chạy batch)
        {TC_ID_001}.spec.ts       ← TC-001 riêng lẻ (rerun đơn)
        {TC_ID_002}.spec.ts       ← TC-002 riêng lẻ
        datafake.json             ← dữ liệu test
        ...

  specs/
    {PBI_ID}/
      testcase.md
      datafake.json
      auto_test_results/
        traces/
          TC-001.zip
          TC-004.zip
        screenshots/
          TC-004-fail-step3.png
          TC-007-auth-expired.png
        run-{DATETIME}-summary.md
        HISTORY.md
```

---

## QUY TẮC

### Tool rules
- **playwright-cli = tất cả execution**: navigate, fill, click, check, assert, trace, screenshot, run_test, load/save_storage_state, evaluate (kể cả auth guard check và capture runtime context)
- **playwright-mcp = discovery only, chỉ 2 trường hợp**: `browser_snapshot` (tìm selector mới) + Kendo combobox sequence (`browser_type` + `browser_snapshot` + `browser_click`)
- **Auth guard**: `playwright-cli evaluate "window.location.href"` — không dùng `browser_current_url`
- **Capture URL/ID/text**: `playwright-cli evaluate "..."` — không dùng bất kỳ mcp tool nào
- **Screenshot lỗi**: `playwright-cli screenshot` — không dùng `browser_screenshot`
- **Exploratory assertions**: toàn bộ dùng `playwright-cli assert_*` và `playwright-cli evaluate`
- **Không dùng `browser_navigate`** trong bất kỳ tình huống nào

### File reading rules
- **Đọc từng file đúng lúc cần** — không gom đọc song song ở đầu
- Thứ tự: `.env` → `testcase.md` → `sub-system-map.json` → `Locator.ts/Page.ts` (per màn hình) → `user.json` → `playwright/{PBI_ID}/datafake.json`

### Locator/Page Object rules
- **Đọc Locator.ts + Page.ts trước khi sinh spec.ts** — mọi selector trong spec phải từ constant Locator.ts
- **Phát hiện component mới trong quá trình test** → discovery qua `browser_snapshot` (mcp) → thêm vào Locator.ts + Page.ts ngay
- **Báo cáo component mới** trong summary và báo cáo kết quả

### Spec rules
- **Sinh 2 loại spec** vào `.specify/tests/playwright/{PBI_ID}/`:
  - `{PBI_ID}.spec.ts` — tất cả TC trong 1 file (chạy batch)
  - `{TC_ID}.spec.ts` — 1 file/TC (rerun đơn lẻ)
- **Kết quả lưu tại** `.specify/specs/{PBI_ID}/auto_test_results/` (traces, screenshots, summary, HISTORY)
- **Import Page Object**: dùng `baseUrl` path (`'pages/{group}/{alias}/{Name}Page'`), KHÔNG dùng relative `../`
- **Import datafake**: `'./datafake.json'` (cùng thư mục `playwright/{PBI_ID}/`)
- **Selector dùng constant** từ Locator.ts qua Page Object — không hard-code selector trong test body
- **Data dùng datafake.json** — không hard-code giá trị trong test
- **playwright.config.ts** phải có `testDir: './playwright'` — kiểm tra trước khi sinh spec

### Flow rules
- **Chỉ chạy TC có `✅ Auto`**
- **TC đã `✅ PASSED` không chạy lại**
- **Login check bắt buộc** — FAILED → dừng toàn bộ; PASSED → save_storage_state ngay
- **Auth guard sau mỗi navigate** — AUTH_EXPIRED → dừng batch
- **Thứ tự chạy**: `--uutien` → `p0` → `p1` → `p2` → `p3+`
- **TC `--uutien` FAILED** → dừng toàn bộ batch
- **Cập nhật Mục 4 ngay sau mỗi TC** — chỉ cột Trạng thái + cột ⭐
- **Cột ⭐**: thêm vào Mục 4 nếu chưa có, điền `⭐` cho `--uutien` TC
- **HISTORY.md luôn append**
- **Không tự động gợi ý chạy /qc_* khác** khi gặp lỗi — chỉ thông báo lỗi rõ ràng

### Data chaining rules
- **Phân tích chuỗi phụ thuộc** ở BƯỚC 0.6 — **trước** khi sinh spec.ts
- **Ưu tiên runtimeContext** hơn datafake khi TC dùng data từ TC trước
- **Fallback về datafake** khi TC nguồn chưa chạy hoặc capture thất bại — KHÔNG để TC bị SKIPPED chỉ vì thiếu context
- **Log rõ nguồn data** mỗi TC: `runtimeContext.{key}` hay `datafake.{key}` hay hard-code
- **Capture ngay sau assertion chính PASSED** — không capture nếu TC FAILED (data không tin cậy)
- **runtimeContext là in-memory** — không ghi file, reset về `{}` mỗi lần chạy `/qc_auto_test`

### Exploratory testing rules
- **Tự sinh exploratory assertions** cho mỗi TC sinh data (tạo/sửa/xóa) — xem bảng 2.3.2
- **Exploratory assertion KHÔNG làm FAILED TC** — chỉ ghi `EXPLORATORY_WARN` trong summary
- **Ưu tiên assertions có giá trị cao**: record xuất hiện đúng trong list > URL hợp lệ > loading cleared
- **Không sinh exploratory nếu TC là**: validation lỗi, hiển thị giao diện, navigation-only
- **Log exploratory warn riêng** trong summary — không lẫn vào FAILED details

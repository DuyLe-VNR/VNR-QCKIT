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
| Lấy URL hiện tại | `playwright-cli evaluate "window.location.href"` |
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

### playwright-mcp — DISCOVERY ONLY (không dùng cho execution)

| Nhiệm vụ | Tool | Khi nào dùng |
| --- | --- | --- |
| Đọc DOM/accessibility tree | `browser_snapshot` | Khi cần tìm selector của component mới chưa có trong Locator.ts |
| Kendo combobox dropdown | `browser_click` + `browser_type` + `browser_snapshot` + `browser_click` | Popup động, cần đọc option thực tế |
| Auth guard check URL | `browser_current_url` | Sau navigate — kiểm tra redirect login tức thì |
| Chụp ảnh lỗi | `browser_screenshot` | Khi assert thất bại, cần ảnh ngay lập tức |

> ⚠️ **Không dùng `browser_navigate` cho execution** — dùng `playwright-cli navigate`. `browser_navigate` chỉ dùng khi cần kiểm tra redirect ngay sau navigate (auth guard).

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
- `.specify/specs/{PBI_ID}/auto_test_results/screenshots/`
- `.specify/specs/{PBI_ID}/auto_test_results/traces/`
- `.specify/specs/{PBI_ID}/auto_test_results/specs/`

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

## BƯỚC 1 — Load session + Login check

### 1.1 Đọc user.json → load session

Đọc `.specify/tests/user.json`.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/tests/user.json`

Dùng `playwright-cli load_storage_state` để load session từ file này.

### 1.2 Login check (playwright-cli + mcp)

Dùng `playwright-cli navigate` điều hướng đến `{APP_URL}`, sau đó kiểm tra:
- `browser_current_url` (mcp) → kiểm tra URL có chứa login pattern không (`/login`, `/sign-in`, `/auth`, `#/login`, `/dang-nhap`)
- `browser_snapshot` (mcp) → tìm auth indicators: `[class*="user-info"]`, `[class*="avatar"]`, `.k-avatar`, `[class*="username"]`, `#user-display-name`

Nếu FAILED → **DỪNG**:

```
⛔ LOGIN CHECK THẤT BẠI — Dừng toàn bộ batch
Lý do: {URL redirect / không thấy auth element}
```

### 1.3 Lưu lại session sau khi login check thành công

Ngay sau khi login check PASSED, dùng `playwright-cli save_storage_state` ghi đè `.specify/tests/user.json` với session hiện tại — cookie và localStorage vừa được xác thực, đảm bảo lần test tiếp theo không bị lỗi session hết hạn.

---

## BƯỚC 2 — Sinh spec.ts có cấu trúc

### 2.1 Đọc datafake.json

Đọc `.specify/specs/{PBI_ID}/datafake.json` trước khi sinh spec — cần biết keys/values để mapping vào test data.

Nếu thiếu → **DỪNG**: `⛔ Không tìm thấy .specify/specs/{PBI_ID}/datafake.json`

### 2.2 Cấu trúc spec.ts chuẩn

Sinh file `.specify/specs/{PBI_ID}/auto_test_results/specs/{PBI_ID}.spec.ts` với cấu trúc:

- **Header comment**: PBI_ID, tên PBI, ngày sinh, hướng dẫn rerun/grep
- **Import**: Page Object + Locator từ đường dẫn trong sub-system-map.json (không import BasePage trực tiếp — đã được Page Object kế thừa)
- **Import datafake.json** để lấy test data
- **Helper functions**: `waitForToast()`, `checkAuthGuard()`
- **`test.describe` theo nhóm ưu tiên**: `⭐ --uutien` → `p0` → `p1` → ...
- **`test.beforeEach`** trong mỗi describe: gọi `checkAuthGuard()`
- **Mỗi TC → 1 `test()` block** với tag `@{PBI_ID}`, `@auto`, `@{priority}`

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

**B. Auth guard trước TC**: dùng `browser_current_url` (mcp) kiểm tra URL — nếu là login page → `AUTH_EXPIRED` → DỪNG batch

**C. Thực thi bước**: dùng playwright-cli theo bảng PHÂN CÔNG, sau mỗi navigate kiểm tra auth guard, Kendo combobox dùng mcp sequence (xem 3.3)

**D. Assertion**: dùng `playwright-cli assert_*` (xem 3.4)

**E. Kết thúc TC**: `playwright-cli tracing_stop` lưu vào `traces/TC-{NNN}.zip`, ghi nhận kết quả, cập nhật Mục 4 ngay

**F. Kiểm tra dừng**: `--uutien` FAILED hoặc `AUTH_EXPIRED` → DỪNG toàn bộ batch

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

Sau mỗi `playwright-cli navigate`, dùng `browser_current_url` (mcp) kiểm tra URL. Nếu URL chứa `/login`, `/sign-in`, `#/login`:
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
| `✅ PASSED` | Tất cả assertion pass |
| `❌ FAILED` | Ít nhất 1 assertion thất bại |
| `⏭ SKIPPED` | Precondition không thỏa / [TODO] |
| `⏸ NOT_RUN` | Dừng do --uutien FAILED / AUTH_EXPIRED |

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

> Chạy lúc    : {ISO_DATETIME}
> Engine      : playwright-cli (execution) + playwright-mcp (discovery)
> Login check : ✅ PASSED
> Spec        : specs/{PBI_ID}.spec.ts

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

Kết quả:
  ✅ PASSED  : {n} TC  → {danh sách}
  ❌ FAILED  : {n} TC  → {danh sách}
  ⏭ SKIPPED : {n} TC  → {danh sách}
  ⏸ NOT_RUN : {n} TC  → {danh sách}

🔍 Component mới phát hiện & cập nhật:
  {AliasName}Locator.ts: +{n} selectors ({danh sách})
  {AliasName}Page.ts: +{n} methods ({danh sách})

FAILED details:
  TC-XXX: {bước lỗi} | Selector: {selector} | Expected: {x} | Actual: {y}
         Screenshot: screenshots/TC-XXX-fail-step{n}.png
         Trace: playwright-cli show_trace traces/TC-XXX.zip

OUTPUT (auto_test_results/):
  specs/{PBI_ID}.spec.ts          ← spec chính (structured, reusable)
  traces/TC-*.zip                 ← trace per-TC
  screenshots/TC-*-fail-*.png     ← ảnh lỗi
  run-{DATETIME}-summary.md
  HISTORY.md

Testcase.md Mục 4: cập nhật ⭐ column + {n} TC trạng thái

Rerun spec:
  playwright-cli run_test "specs/{PBI_ID}.spec.ts"
  playwright-cli run_test "specs/{PBI_ID}.spec.ts" --grep "TC-004"
  playwright-cli show_trace "traces/TC-004.zip"
```

---

## CẤU TRÚC THƯ MỤC auto_test_results

```
.specify/specs/{PBI_ID}/
  testcase.md
  datafake.json
  auto_test_results/
    specs/
      {PBI_ID}.spec.ts
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
- **playwright-cli = tất cả execution**: navigate, fill, click, check, assert, trace, screenshot, run_test, load/save_storage_state
- **playwright-mcp = discovery only**: `browser_snapshot` (tìm selector mới), `browser_current_url` (auth guard), `browser_screenshot` (lỗi tức thì), Kendo combobox sequence
- **Không dùng `browser_navigate` cho execution** — chỉ dùng `playwright-cli navigate`

### File reading rules
- **Đọc từng file đúng lúc cần** — không gom đọc song song ở đầu
- Thứ tự: `.env` → `testcase.md` → `sub-system-map.json` → `Locator.ts/Page.ts` (per màn hình) → `user.json` → `datafake.json`

### Locator/Page Object rules
- **Đọc Locator.ts + Page.ts trước khi sinh spec.ts** — mọi selector trong spec phải từ constant Locator.ts
- **Phát hiện component mới trong quá trình test** → discovery qua `browser_snapshot` (mcp) → thêm vào Locator.ts + Page.ts ngay
- **Báo cáo component mới** trong summary và báo cáo kết quả

### Spec rules
- **Sinh spec.ts có cấu trúc** (import Locator/Page, helper functions, describe/test blocks theo nhóm ưu tiên)
- **Selector dùng constant** từ Locator.ts (SNAKE_CASE ALL_CAPS), không hard-code selector string trong test body
- **Data dùng datafake.json** — không hard-code giá trị trong test

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

---
description: Phân loại kết quả automation test theo 3 nhóm (PASS / APP_BUG / INFRA) từ HISTORY.md mới nhất. Với APP_BUG sinh bảng Severity (Critical/High/Medium/Low). Output: triage-{PBI_ID}-{YYYYMMDD}.md trong auto_test_results/.
argument-hint: "<PBI_ID>"
---

# /qc_triage

Đọc kết quả test run **mới nhất** trong `.specify/specs/{PBI_ID}/auto_test_results/HISTORY.md`, phân tích từng TC và phân loại thành **PASS**, **APP_BUG**, hoặc **INFRA**. Với nhóm APP_BUG, xác định Severity và sinh bảng tổng hợp.

---

## User Input

```text
$ARGUMENTS
```

`PBI_ID` = giá trị sau `/qc_triage` (ví dụ: `123`, `PBI-456`, `090626`). **Bắt buộc**.

---

## BƯỚC 1 — KIỂM TRA & ĐỌC DỮ LIỆU

### 1.1 Kiểm tra file bắt buộc

```
.specify/specs/{PBI_ID}/auto_test_results/HISTORY.md   → BẮT BUỘC
```

Nếu không tồn tại → **DỪNG**:

```
⛔ Không tìm thấy .specify/specs/{PBI_ID}/auto_test_results/HISTORY.md
→ Chạy /vnr-qckit:qc_auto_test {PBI_ID} trước để có kết quả test.
```

### 1.2 Xác định run mới nhất

Đọc HISTORY.md, lấy **dòng đầu tiên** trong bảng (dòng `#N` với N cao nhất, hoặc timestamp mới nhất).

Trích xuất:
- `RUN_ID`      : mã run (ví dụ `#3`)
- `DATETIME`    : ngày giờ chạy
- `SUMMARY_FILE`: đường dẫn file summary (cột "Summary")
- Tổng TC, số ✅, số ❌

### 1.3 Đọc summary file của run mới nhất

```
.specify/specs/{PBI_ID}/auto_test_results/{SUMMARY_FILE}
```

Nếu summary file không tồn tại → đọc từ `testcase.md` để lấy danh sách TC, kết hợp thông tin HISTORY.md.

### 1.4 Đọc testcase.md (luôn đọc)

```
.specify/specs/{PBI_ID}/testcase.md
```

Dùng để:
- Lấy mô tả, nhóm, priority của từng TC
- Lấy **Kết quả thực tế** đã được ghi inline (`**Kết quả thực tế**: ✅ PASSED / ❌ FAILED`)
- Đối chiếu kết quả mong đợi vs thực tế

---

## BƯỚC 2 — PHÂN LOẠI TỪNG TC

Với mỗi TC trong run mới nhất, áp dụng quy tắc phân loại theo thứ tự ưu tiên:

---

### 2.1 Định nghĩa 3 loại

#### ✅ PASS

**Dấu hiệu:**
- Test case exit code = 0, không có lỗi
- Assertion tất cả đều green
- Không có timeout, không có selector error

**Ví dụ:**
```
TC-003: MaxConsecutiveDaysPerMonth chỉ hiển thị khi IsRequireConsecutive=true
→ PASS: toggle checkbox → verify element visible/hidden — both assertions green, 2256ms
```

---

#### 🐛 APP_BUG

**Dấu hiệu — test fail do BUG của ứng dụng (không phải hạ tầng/test script):**

| Dấu hiệu | Mô tả | Ví dụ lỗi thực tế |
| --- | --- | --- |
| **Feature chưa deploy** | UI/field không tồn tại trên môi trường test dù đã trong spec | `expect(locator).toBeVisible() failed — input[name="IsRequireConsecutive"] not attached` |
| **Business rule sai** | App trả về kết quả khác spec (sai message, sai behavior) | Toast: "Lưu thành công" nhưng spec yêu cầu block "Loại nghỉ chỉ áp dụng cho NV nữ" |
| **Validation thiếu** | Submit với data invalid → app cho qua, không block | `IsRequireConsecutive=true + MaxConsecutiveDaysPerMonth="" → lưu được (spec: phải block)` |
| **UI không đúng spec** | Dropdown hiển thị option không được phép | NV nam vẫn thấy loại nghỉ ApplyGender=Female trong dropdown |
| **DB không persist** | Data lưu xong mở lại bị sai / null | `Edit record: MaxConsecutiveDaysPerMonth hiển thị null sau khi lưu 3` |
| **API response sai** | Response status OK nhưng data sai business rule | `POST /save → 200 OK nhưng ApplyGender không được lưu vào DB` |
| **Regression** | Feature cũ bị vỡ sau deploy mới | Loại nghỉ thường (ApplyGender=All) bị block sau khi merge BS-01 |

**Phân loại APP_BUG phải thỏa mãn:**
1. Script đúng (locator hợp lệ, flow đúng spec)
2. Môi trường infra ổn (không phải session/network issue)
3. App hoạt động sai nghiệp vụ

---

#### 🔧 INFRA

**Dấu hiệu — test fail do môi trường/hạ tầng/script, KHÔNG phải lỗi app:**

| Dấu hiệu | Mô tả | Ví dụ lỗi thực tế |
| --- | --- | --- |
| **Session expired / Cookie mismatch** | Cookie domain sai, session hết hạn → redirect login | `TimeoutError 20000ms — page redirect về login, không có nút "Tạo mới"` |
| **Host mismatch** | user.json có domain A, APP_URL trỏ domain B | `Cookie domain=pehn02.vnresource.net, APP_URL=long-main.vnrlocal.com` |
| **Network timeout** | Server không phản hồi, VPN down, môi trường restart | `TimeoutError: networkidle timeout 30000ms` |
| **Selector sai / stale** | CSS/locator không còn khớp DOM do FE refactor nhỏ | `catFillField('Loại ngày nghỉ') — div.FieldTitle label không match (đã đổi class)` |
| **Dữ liệu test không có sẵn** | Tiền điều kiện thiếu (seed data, account test không tồn tại) | `inputCombobox: option "Nghỉ kinh nguyệt" không xuất hiện trong dropdown` khi loại chưa được seed |
| **Config sai** | .env sai, APP_URL sai, playwright.config lỗi | `Error: APP_URL undefined — biến môi trường chưa set` |
| **Test script lỗi logic** | Code spec.ts có bug (sai await, sai assertion) | `TypeError: leaveDayPage.loc.formLoaiNgayNghi is undefined` |
| **Timeout do app chậm** | App phản hồi chậm hơn timeout config, không phải lỗi nghiệp vụ | `TimeoutError 8000ms: spinner không dừng — server chậm do backup đang chạy` |

**Phân loại INFRA không thể được fix bằng cách sửa code app:**
→ Cần fix: user.json, .env, seed data, selector, timeout config, hoặc môi trường deploy

---

### 2.2 Bảng quyết định phân loại

```
TC FAILED →
  ├─ Lỗi: TimeoutError + "redirect" / "login" / "host mismatch" / cookie → INFRA (session)
  ├─ Lỗi: TimeoutError + selector không match + FE chưa deploy field → APP_BUG (feature missing)
  ├─ Lỗi: TimeoutError + selector sai class/attribute sau FE refactor → INFRA (stale selector)
  ├─ Lỗi: assertion failed + app không block khi phải block → APP_BUG (validation missing)
  ├─ Lỗi: assertion failed + app block nhưng message sai → APP_BUG (wrong message)
  ├─ Lỗi: assertion failed + option xuất hiện khi không được phép → APP_BUG (filter sai)
  ├─ Lỗi: undefined / TypeError trong script → INFRA (script bug)
  ├─ Lỗi: networkidle timeout + server không phản hồi → INFRA (network/env)
  └─ Không rõ → APP_BUG (mặc định, cần dev xác nhận)

TC PASSED → ✅ PASS
```

---

## BƯỚC 3 — SEVERITY CHO APP_BUG

Với mỗi TC phân loại là APP_BUG, xác định Severity theo bảng:

### 3.1 Bảng Severity

| Severity | Định nghĩa | Điều kiện | Ví dụ |
| --- | --- | --- | --- |
| 🔴 **Critical** | Chức năng KHÔNG hoạt động được, block toàn bộ nghiệp vụ chính | Feature core bị vỡ hoàn toàn, không có workaround. P1 happy path fail. | TC-006: NV nữ không thể đăng ký nghỉ kinh nguyệt (core flow broken). |
| 🟠 **High** | Nghiệp vụ quan trọng sai, nhưng có workaround tạm thời | Business rule sai (sai validation, sai block logic). P1 test. | TC-007: NV nam đăng ký được loại chỉ dành cho nữ → security/business rule violation. |
| 🟡 **Medium** | Sai nhưng không block toàn bộ, ảnh hưởng một phần flow | Message sai, UI hiển thị sai, data persist thiếu một field. P1/P2. | TC-004: Form lưu được khi MaxConsecutiveDaysPerMonth trống (thiếu validation). |
| 🟢 **Low** | Sai nhỏ, UX/cosmetic, không ảnh hưởng nghiệp vụ | Label sai, default value sai hiển thị, tooltip sai. P2. | TC-005: ApplyGender hiển thị "Tất cả" thay vì "All" (label không khớp spec). |

### 3.2 Quy tắc xác định Severity

```
BUG Severity →
  ├─ Feature core P1 không hoạt động (happy path broken)     → Critical
  ├─ Security/Permission bị vỡ (user trái quyền vẫn làm được) → Critical
  ├─ Data loss / Data corruption                              → Critical
  ├─ Business rule P1 bị sai (block sai / pass sai)          → High
  ├─ Validation bắt buộc bị thiếu (form lưu khi không được)  → High
  ├─ Filter/dropdown hiển thị data không được phép            → High
  ├─ Message/toast sai nội dung                               → Medium
  ├─ Field không persist đúng (1 trong nhiều field)           → Medium
  ├─ Conditional show/hide sai                                → Medium
  ├─ UI cosmetic, label sai, format ngày sai                  → Low
  └─ Default value sai (không ảnh hưởng save)                 → Low
```

---

## BƯỚC 4 — SINH FILE TRIAGE

Ghi ra `.specify/specs/{PBI_ID}/auto_test_results/triage-{PBI_ID}-{YYYYMMDD}.md`:

```markdown
# Triage Report — {PBI_ID}

> Run     : {RUN_ID} — {DATETIME}
> Triage  : {ISO_DATE}
> QC Tool : /vnr-qckit:qc_triage

---

## Tổng quan

| Phân loại | Số TC | % |
| --- | --- | --- |
| ✅ PASS    | {n} | {%} |
| 🐛 APP_BUG | {n} | {%} |
| 🔧 INFRA   | {n} | {%} |
| **Tổng**  | {n} | 100% |

---

## ✅ PASS — {n} test case

| TC | Tên | Nhóm | Priority | Thời gian |
| --- | --- | --- | --- | --- |
| TC-003 | MaxConsecutiveDaysPerMonth chỉ hiển thị khi IsRequireConsecutive=true | BS-01 Admin | P1 | 2256ms |
| TC-005 | Default values khi tạo mới Cat_LeaveDayType | BS-01 Admin | P1 | 2305ms |

---

## 🐛 APP_BUG — {n} test case

### Bảng Severity

| Severity | TC | Tên | Nhóm | Mô tả lỗi | Action |
| --- | --- | --- | --- | --- | --- |
| 🔴 Critical | TC-006 | NV nữ đăng ký loại ApplyGender=Female → pass | BS-02 Rule 1 | Feature BS-02 không hoạt động — NV nữ không tạo được đơn nghỉ kinh nguyệt (core flow P1 broken) | Dev kiểm tra controller Att_LeaveDay, xem gender check có được gọi không |
| 🟠 High | TC-007 | NV nam đăng ký loại Female → hard block | BS-02 Rule 1 | Rule 1 không chặn được NV nam → security violation | Fix business rule check gender trước khi INSERT |
| 🟡 Medium | TC-004 | Validation IsRequireConsecutive=true + MaxDays rỗng → block | BS-01 | Form lưu được khi MaxConsecutiveDaysPerMonth trống — thiếu server-side validation | Thêm validation: if IsRequireConsecutive=1 AND MaxConsecutiveDaysPerMonth IS NULL → error |
| 🔴 Critical | TC-001 | Form Cat_LeaveDayType hiển thị đủ 3 field mới | BS-01 | 3 field BS-01 (IsRequireConsecutive, MaxConsecutiveDaysPerMonth, ApplyGender) không có trên form — migration chưa deploy | Deploy Phase 0 (DB migration) + Phase 4 (Admin form) |

### Chi tiết từng APP_BUG

#### 🔴 Critical — TC-001

**Tên**: Form Cat_LeaveDayType hiển thị đủ 3 field mới sau DB migration
**Severity**: 🔴 Critical
**Nhóm**: BS-01 Admin cấu hình | **Priority**: P1

**Lỗi thực tế**:
```
Error: expect(locator).toBeVisible() failed
Locator: input[name="IsRequireConsecutive"]
Expected: visible
Received: <element not found>
```

**Phân tích**: Fields `IsRequireConsecutive`, `MaxConsecutiveDaysPerMonth`, `ApplyGender` chưa có
trong form Cat_LeaveDayType trên môi trường long-main.vnrlocal.com. DB migration (Phase 0)
và Admin form UI (Phase 4) chưa được deploy lên môi trường này.

**Impact**: Block toàn bộ BS-01 (TC-001, TC-002, TC-004, TC-025) không test được.

**Action cho Dev/DevOps**:
- Deploy `v059_add_leavetype_gender_fields.sql` lên long-main.vnrlocal.com
- Deploy code Admin form có 3 field mới

---

*(... lặp lại cho từng APP_BUG)*

---

## 🔧 INFRA — {n} test case

| TC | Tên | Nguyên nhân | Loại INFRA | Action fix |
| --- | --- | --- | --- | --- |
| TC-006..TC-023 | BS-02/BS-03 tests | Session cookie domain mismatch: user.json có `pehn02.vnresource.net`, APP_URL là `long-main.vnrlocal.com` | Session/Config | Cập nhật user.json: chạy lại global-setup với APP_URL=long-main; hoặc đổi .env.local APP_URL về pehn02 |
| TC-002, TC-004 | Cat form field | Selector `div.FieldTitle label:has-text("Loại ngày nghỉ")` không match DOM thực tế | Stale Selector | Sửa spec.ts: dùng `input[name="LeaveDayTypeName"]` thay label-based filter |

---

## Hành động tiếp theo (ưu tiên)

### Ngay (block test):
- [ ] **Fix INFRA — Session**: Cập nhật user.json với đúng domain `long-main.vnrlocal.com` → unblock TC-006..TC-023 (17 TC)
- [ ] **Fix INFRA — Selector**: Sửa `catFillField` → dùng `input[name]` attribute → unblock TC-002, TC-004

### Sau khi INFRA fix xong:
- [ ] **APP_BUG Critical**: Deploy Phase 0 + Phase 4 → retest TC-001, TC-025
- [ ] **APP_BUG High**: Kiểm tra Business Rule BS-02 trong controller → retest TC-006..TC-010

### Next run:
```text
→ /vnr-qckit:qc_auto_test {PBI_ID}   — sau khi fix INFRA
→ /vnr-qckit:qc_triage {PBI_ID}      — để so sánh với triage này
```

---

## So sánh với lần triage trước

*(Điền khi có lần triage trước — số APP_BUG tăng/giảm, bug nào đã fix)*

| TC | Triage #1 | Triage #2 | Delta |
| --- | --- | --- | --- |
| TC-001 | INFRA | APP_BUG | Cùng lỗi nhưng nay xác nhận rõ là bug deploy |
```

---

## BƯỚC 5 — BÁO CÁO CONSOLE

In ra màn hình (không ghi vào file):

```text
[v] qc_triage hoàn thành — PBI {PBI_ID}

Run phân tích : {RUN_ID} — {DATETIME}
Tổng TC       : {n}

  ✅ PASS      : {n} TC
  🐛 APP_BUG   : {n} TC  → 🔴 Critical: {n}  🟠 High: {n}  🟡 Medium: {n}  🟢 Low: {n}
  🔧 INFRA     : {n} TC

APP_BUG nổi bật:
  🔴 TC-001 — Feature BS-01 chưa deploy (Critical)
  🔴 TC-006 — Core flow NV nữ đăng ký bị broken (Critical)
  🟠 TC-007 — Business rule gender không chặn được NV nam (High)

INFRA cần fix trước:
  🔧 TC-006..023 — Session cookie host mismatch (long-main vs pehn02)
  🔧 TC-002, 004  — Stale selector (label-based → dùng name attribute)

Output:
  triage-{PBI_ID}-{YYYYMMDD}.md → .specify/specs/{PBI_ID}/auto_test_results/

Bước tiếp theo:
  1. Fix INFRA → /vnr-qckit:qc_auto_test {PBI_ID}
  2. Report APP_BUG cho Dev (file triage đính kèm)
  3. Sau khi dev fix → /vnr-qckit:qc_triage {PBI_ID} để compare
```

---

## QUY TẮC

- **Đọc summary file MỚI NHẤT** — không đọc run cũ trừ khi cần so sánh.
- **Ưu tiên INFRA trước APP_BUG** trong bảng "Hành động tiếp theo" — vì INFRA có thể che giấu APP_BUG thực sự.
- **Không phân loại APP_BUG khi chưa loại trừ INFRA** — nếu cùng 1 TC có cả dấu hiệu INFRA và APP_BUG → ưu tiên phân loại INFRA + ghi chú "Cần xác nhận sau khi fix INFRA".
- **Severity Critical** chỉ dùng khi feature bị vỡ hoàn toàn hoặc security bị vi phạm — không lạm dụng.
- **Nếu 1 bug ảnh hưởng nhiều TC** → gom chung 1 entry, liệt kê tất cả TC bị ảnh hưởng.
- **Không sửa testcase.md hay spec.ts** trong skill này — chỉ đọc và phân tích.
- **File triage ghi đè** nếu cùng ngày chạy lại — dùng timestamp để phân biệt nếu cần: `triage-{PBI_ID}-{YYYYMMDD}-{HHMMSS}.md`.
- **Giữ nguyên RUN_ID trong tên** nếu muốn so sánh nhiều run trong ngày.


## NGUYÊN TẮC BẮT BUỘC

- Phải tương tác với **TẤT CẢ** phần tử interactive visible trên màn hình.

---

## [BƯỚC 0 của 2.2] – Quét và lập danh sách TẤT CẢ interactive elements

Trước khi click bất kỳ thứ gì, chạy lệnh sau để thu thập toàn bộ:

```javascript
// Đóng overlay chặn click nếu có
document.querySelectorAll('[class*="new-feature"], [class*="smooth-movement"]')
  .forEach(e => e.style.display = 'none');

// Thu thập TẤT CẢ interactive elements đang visible
const interactiveEls = Array.from(document.querySelectorAll(
  'button, a[href], [role="button"], [role="tab"], [class*="cls-func-pointer"], ' +
  '[class*="expand-more"], [class*="parent-dropdown"], [class*="tab-item"]'
)).filter(el => {
  if (!el.offsetParent) return false; // phải visible
  if (el.disabled) return false; // bỏ qua disabled
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  return true;
}).map(el => ({
  tag: el.tagName,
  text: el.textContent?.trim().substring(0, 40) || '',
  hasIcon: !!el.querySelector('[class*="mi-"], svg, img'),
  isArrow: el.classList.contains('expand-more-button') || el.classList.contains('parent-dropdown'),
  cls: el.className?.substring(0, 60),
  hint: el.getAttribute('data-original-title') || el.getAttribute('title') || el.getAttribute('aria-label') || ''
}));

return interactiveEls;
```

---

### Tổng hợp thành **INTERACT_QUEUE**

Danh sách có thứ tự ưu tiên:

| Thứ tự | Loại phần tử |
|--------|-------------------------------|
| 1      | Tabs (`role=tab`)             |
| 2      | Toolbar buttons có text       |
| 3      | Toolbar split arrows ▾        |
| 4      | Icon-only buttons             |
| 5      | Row action buttons            |
| 6      | Row split arrows ▾            |
| 7      | Stat cards / hyperlink clickable |

---

## [A] Click TẤT CẢ tabs

Với mỗi tab trong `tabs_list`:

```
browser_click(tab_ref)
browser_wait_for(time: 1)
browser_snapshot() -> ghi nhận nội dung tab + buttons trong tab + readonly/editable
```

---

## [B] Click TẤT CẢ toolbar buttons có text

Với MỖI button trên toolbar (kể cả "Lọc", "Tiện ích", "Thực hiện hàng loạt", "Thêm bằng AI", và bất kỳ button nào khác):

```
browser_click(btn)
browser_wait_for(time: 0.6)
browser_snapshot() -> ghi nhận kết quả:
- Dropdown mở? -> liệt kê TẤT CẢ items (kể cả items ẩn dưới scroll)
- Form/popup mở? -> ghi nhận fields, buttons trong form
- Action xảy ra trực tiếp? -> ghi nhận toast/redirect/thay đổi
- Không thay đổi? -> ghi nhận "no visible effect"
browser_press_key("Escape")  <- nếu mở dropdown/popup
```

## 1. Thao tác với button "Thêm mới / Thêm / + / New"

### 1.1. Kiểm thử form thêm mới
- **Bước 1:** Click button "Thêm mới / Thêm / + / New".
- **Bước 2:** Điền dữ liệu giả vào form.
- **Bước 3:** Thử validation bằng cách bỏ trống các trường bắt buộc.
- **Bước 4:** Lưu form.
- **Ghi nhận:**
  - Thông báo lỗi (error messages) hiển thị đúng.
  - Toast thông báo thành công/thất bại.
  - Danh sách có thay đổi sau khi lưu thành công.

### 1.2. Button "Thêm bằng AI"
- **Bước 1:** Click button "Thêm bằng AI".
- **Ghi nhận:**
  - Popup hoặc flow AI xuất hiện, ghi nhận giao diện và các bước tiếp theo.

---

## 2. [C] Click TẤT CẢ toolbar split arrows ↓

### 2.1. Tìm và click các split arrows trên toolbar
```javascript
// Tìm tất cả split arrows trên toolbar (ngoài tbody)
const toolbarArrows = Array.from(document.querySelectorAll(
  '.expand-more-button, .parent-dropdown.expand-more-button, .ms-con-dropdown'
)).filter(el => el.offsetParent && !el.closest('tbody'));
```

### 2.2. Thao tác với từng arrow
```javascript
// Với mỗi arrow:
browser_evaluate → arrow.click()
browser_wait_for(time: 0.6)
browser_snapshot() → thu thập TẤT CẢ dropdown items (scroll xuống nếu list dài)
ghi nhận: { parent_button_text, items: ["item1", "item2", ...] }
browser_press_key("Escape")
```

---

## 3. [D] Click TẤT CẢ icon-only buttons (không có text)

### 3.1. Tìm các button chỉ có icon
```javascript
const iconOnlyBtns = Array.from(document.querySelectorAll('button'))
  .filter(el => el.offsetParent && !el.disabled
    && !el.textContent?.trim()
    && el.querySelector('[class*="mi-"], svg, img'));
```

### 3.2. Thao tác với từng icon button
```javascript
// Với mỗi icon button:
browser_evaluate → btn.click()
browser_wait_for(time: 0.6)
browser_snapshot() → ghi nhận bất cứ thay đổi nào
browser_press_key("Escape")
```

---

## 4. [E] Khám phá search/filter (nếu có)

### 4.1. Tìm input search/filter
Tìm input có placeholder chứa "tìm", "search", "tìm kiếm", "nhập":

```text
browser_type(input_ref, text: "test", submit: false)
browser_wait_for(time: 1)
browser_snapshot() → ghi nhận: có kết quả hay empty state
browser_type(input_ref, text: "", submit: false)  ← clear
```

---

## 5. [F] Click TẤT CẢ row actions [cột Chức năng]

### 5.1. Tìm và thao tác với các nút chức năng trong row đầu tiên
```javascript
const funcCell = document.querySelector('tbody tr td:last-child');
const allBtns = Array.from(funcCell?.querySelectorAll(
  'button, a, [class*="cls-func"]'
) || []).filter(e => e.offsetParent);
```

#### F1. Main button (Xem / Sửa)
```text
browser_click(main_btn)
browser_wait_for(time: 1)
browser_snapshot() → ghi nhận trang/popup detail
```
- Với form Sửa: fill 1 field → lưu → ghi nhận validation + toast
- `browser_navigate_back()` nếu navigate

#### F1b. Khám phá footer buttons trong form detail (BẮT BUỘC)
> ⚠️ **NGUYÊN TẮC**: Sau khi mở form detail, PHẢI quét và click **TẤT CẢ buttons trong footer**, đặc biệt là các dropdown button (`ms-con-dropdown`, `ms-dropdown-type-footer`).

```javascript
// Bước 1: Thu thập tất cả buttons trong footer của form detail
const footerBtns = Array.from(document.querySelectorAll(
  '.footer-container button, .ms-footer button, [class*="footer"] button'
)).filter(el => el.offsetParent && !el.disabled)
  .map((b, i) => ({
    index: i,
    text: b.innerText.trim(),
    isDropdown: b.className.includes('dropdown') || b.className.includes('ms-con-dropdown'),
    shortkey: b.getAttribute('shortkey-target') || ''
  }));
```

## Bước 2: Xử lý Button trong Footer

### 2a. Dropdown Button (isDropdown=true)
```javascript
// Click dropdown button (có thể là split button, text rỗng hoặc có text)
browser_evaluate → footerBtns[i].click() // hoặc dùng bounding box để click
browser_wait_for(time: 0.8)
// Thu thập items từ menu vừa mở:
const menuItems = Array.from(document.querySelectorAll(
  'ul.ms-dropdown--menu li a, ul.ms-dropdown--menu li'
)).filter(el => el.offsetParent).map(el => el.innerText.trim()).filter(t => t);
// Ghi nhận:
{ button_text, menu_items: menuItems }
browser_press_key("Escape")
```

### 2b. Action Button Thông Thường (không dropdown)
- Ghi nhận tên button
- Bỏ qua click nếu có thể gây navigate/xóa data

#### Lưu ý khi click footer dropdown
- Nhiều button footer MISA SME có class `ms-con-dropdown` + `ms-dropdown--type-footer` → split button dropdown
- Button tên rỗng `""` thường là arrow `˅` của split button ngay bên cạnh
- Để click đúng: dùng **bounding box** của button trước đó + offset `+15px` sang phải, KHÔNG dùng evaluate click vì Vue event handler không trigger
- Ví dụ: `[In][˅]` → `In` = button chính, `""` kế tiếp = arrow dropdown của In
- Sau khi menu mở, đọc `ul.ms-dropdown--menu` để lấy items

---

## F2. Row Split Arrow ˅
```javascript
// Click tất cả expand-more-button trong row
document.querySelectorAll('tbody tr .expand-more-button')
  .forEach(btn => { btn.click(); /* ghi nhận từng cái */ });
```

browser_wait_for(time: 0.6)
browser_snapshot() → liệt kê dropdown items
ghi nhận theo trạng thái row (đã GS / Chưa GS / ...)
browser_press_key("Escape")

---

## F3. Xóa 🗑️ (nếu có)
```text
browser_click(btn_xoa)
browser_wait_for(time: 1)
browser_snapshot() → ghi nhận confirm dialog text
browser_press_key("Escape")  ← KHÔNG xác nhận xóa thật
```

---

## [G] Khám phá Table Row Click (nếu có data)

Click vào cell tên/link đầu tiên trong row → navigate sang detail:
```text
browser_snapshot() → ghi nhận detail page (tabs, fields, buttons)
browser_navigate_back()
```

---

## [H] Click TẤT CẢ Stat Cards / Hyperlink Clickable

Với màn hình có stat cards (số tổng, KPI cards):
```javascript
const statCards = Array.from(document.querySelectorAll(
  '[class*="hyperlink"], [class*="cls-func-pointer"], [class*="total-money"]'
)).filter(e => e.offsetParent);
```

// Với mỗi stat card:
browser_evaluate → el.click()
browser_wait_for(time: 0.6)
browser_snapshot() → ghi nhận: filter áp dụng / navigate / popup

---

## NGUYÊN TẮC CHUNG

- Mọi element có `offsetParent !== null` (đang visible) và là `button/a/[role=button]` đều là interactive.
- **Phải tương tác TẤT CẢ** → không phân biệt có text hay không có text, icon hay chữ, to hay nhỏ.
- Không được giả định “cái này chắc không quan trọng” hay “cái này chắc chỉ là decoration”.

---

## 2.3 - Build ScreenFlow Object

```javascript
ScreenFlow {
  alias,
  url,
  ma_phan_he,
  feature,
  mo_ta,
  screen_name,
  initial_state,        // "empty" | "has_data" | "unknown"
  tabs: [{ name, content_summary }],
  toolbar_icons: [      // ★ icon-only buttons không có text
    { icon_class, tooltip, action_result }
  ],
  toolbar_split_buttons: [  // ★ split button [Text]+[˅]
    { main_button, arrow_menu_items: [] }
  ],
  tien_ich_menu: [],    // ★ items trong dropdown Tiện ích
  actions: [
    {
      trigger,          // "[+ Thêm mới]", "[Tìm kiếm]", "[Row → click]"
      result,           // "mở Popup", "filter danh sách", "navigate /path/detail"
      dialog_title,     // nếu có dialog
      dialog_fields: [{ label, required, type }],
      branches: [
        { condition, outcome }
      ],
      inline_actions: [],    // ["Sửa ✎", "Xóa 🗑", "..."]
      row_split_dropdown: [] // ★ ˅ arrow dropdown theo trạng thái row
    }
  ],
  detail_screen: {      // nếu có trang detail
    screen_name,
    tabs: [],
    footer_buttons: [],       // ★ TẤT CẢ buttons trong footer form detail
    footer_dropdowns: [       // ★ Dropdown buttons và items của chúng
      { button_text, menu_items: [] }
    ],
    actions: []
  } | null
}
```

- `ALL_FLOWS.push(ScreenFlow)`
- `ACTION_COUNT += actions.length`

---

## BƯỚC 3 - Sinh ASCII Flow Diagram

Sau khi duyệt xong tất cả URL, sinh output Markdown có embedded ASCII diagram.

### Format ASCII chuẩn

```text
[Vào màn hình {screen_name}]
        |
        v
[Xem danh sách] ---- {filter_actions nếu có} -----------
        |                                              |
        |                                              v
        |                                       {kết quả filter}
```

==================================================
[ẢNH 1]
==================================================
│
├── ICON TOOLBAR (không có text):
│   ⚙ {icon_class} -> {action}
│   📊 {icon_class} -> {action}
│   ...
│
├── [{main_btn} ▾] split button -> {item_1} | {item_2} | ...
│
├── [Tiện ích] -> {tiện_ích_item_1} | {item_2} | ...
│
├── [{trigger_1}] -> {result_1}
│       {chi tiết dialog/popup nếu có}
│
│           ├── {branch_condition_1} -> {branch_outcome_1}
│           └── {branch_condition_2} -> {branch_outcome_2}
│
└── [Row actions]:
    Nút chính: {main_btn_text}
    ▾ dropdown (trạng thái A): {item_1} | {item_2}
    ▾ dropdown (trạng thái B): {item_3} | {item_4}

**Quy tắc ký tự:**
- │  = đường dọc chính
- ├── = nhánh giữa (có thêm bên dưới)
- └── = nhánh cuối
- -> = mũi tên -> kết quả
- ▼ = đi xuống
- ─── = đường ngang
- ┐ / ┘ = góc phải
- [...] = màn hình / action
- {...} = kết quả / outcome

==================================================
[ẢNH 2]
==================================================
### Cấu trúc file output tổng thể

```markdown
# Flow: {PROJECT_NAME}
> Khám phá: {timestamp}  |  {X}/{N} URLs thành công

---

## MA_PHAN_HE: {MA_PHAN_HE_1}

### {mo_ta feature} (`{alias}`)
> URL: `{url}`

```
{ASCII flow diagram cho feature này}
```

---

### {mo_ta feature 2} (`{alias_2}`)
...

---

## MA_PHAN_HE: {MA_PHAN_HE_2}
...

---
```

==================================================
[ẢNH 3]
==================================================
## Tóm tắt

| Chỉ số | Giá trị |
|--------|---------|
| Tổng URL queue | {N} |
| Khám phá thành công | {X} |
| Lỗi navigation | {Y} |
| Dialogs/Popups phát hiện | {D} |
| Actions ghi nhận | {A} |

{Nếu có NAV_FAIL:}
### URLs lỗi navigation
| Alias | URL | Lý do |
|------|-----|-------|
| ... | ... | Redirect về login |
```

---

## Bảng data giả tự sinh

Khi cần fill field trong dialog, xác định loại field từ label text + placeholder:

| Pattern label / placeholder | Data giả |
|-----------------------------|----------|
| chứa: tên, họ tên, full name | `Nguyễn Văn Khám Phá` |
| chứa: email | `khampha.explore@misa.com.vn` |
| chứa: điện thoại, phone, sdt | `0912000999` |
| chứa: ngày, date | ngày hiện tại (dd/MM/yyyy) |
| chứa: mô tả, ghi chú, note, nội dung | `[EXPLORE] Dữ liệu khám phá tự động` |
| chứa: tiền, giá, amount, price | `100000` |
| chứa: mã, code, số hiệu | `EXPLORE-001` |
| chứa: url, link, website | `https://example.com` |
| chứa: địa chỉ, address | `123 Đường Khám Phá, Hà Nội` |
| chứa: số lượng, quantity | `1` |
| không xác định | `test_explore` |

==================================================
[ẢNH 4]
==================================================
## BƯỚC 4 - Lưu output

**Quy tắc đặt tên file:**
- Nếu toàn bộ queue thuộc **1 phần hệ** duy nhất -> `flow-{MA_PHAN_HE}.md` (vd: `flow-CA.md`)
- Nếu queue gồm **nhiều phần hệ** -> `flow-ALL.md`
- File đã tồn tại -> **ghi đè** (không thêm timestamp, không tạo file trùng)

```bash
mkdir -p .specify/memory

# Xác định tên file
if [ số phần hệ = 1 ]; then
  OUTPUT=".specify/memory/flow-{MA_PHAN_HE}.md"
else
  OUTPUT=".specify/memory/flow-ALL.md"
fi
TIMESTAMP=$(date +%Y-%m-%dT%H-%M-%S)
```

Ghi Markdown + ASCII diagrams vào `OUTPUT`.

Cập nhật `.specify/memory/flow-index.md` (tạo mới nếu chưa có):

```markdown
# Flow Index

| Thời gian | File | URLs | Thành công |
|-----------|------|------|------------|
| {timestamp} | [flow-{MA_PHAN_HE}.md](flow-{MA_PHAN_HE}.md) | {N} | {X}/{N} |
```

Báo kết quả:

```
✅ Flow đã lưu: .specify/memory/flow-{MA_PHAN_HE}.md
🔍 Khám phá: {X}/{N} URLs thành công | {D} dialogs | {A} actions
```

==================================================
[ẢNH 5]
==================================================
## Ví dụ output ASCII diagram

```
[Vào màn hình Đơn vị tính]
│
│   ▼
[Xem danh sách] ─── Tìm kiếm theo tên ─────────────────┐
│       │          Lọc theo trạng thái                 │
│       │          Thiết lập bảng                      │
│       │                                              │
│       │                                Không có kết quả
│       │                                -> Empty state
│       │
│       ├── [+ Thêm] -> Popup "Thêm đơn vị tính"
│       │                     │
│       │                     │  Fields: Tên (*), Mô tả
│       │                     │
│       │                     ├── Thiếu Tên -> Tooltip đỏ "Không được để trống" (giữ popup)
│       │                     └── Lưu thành công -> Đóng popup
│       │                                           Bản ghi lên đầu danh sách
│       │                                           Toast "Thêm thành công"
│       │
│       ├── [Sửa ✎] -> Popup "Sửa đơn vị tính"
│       │                │
│       │                │  Fields: Tên (*), Mô tả, Ngừng theo dõi (checkbox)
│       │                │  Prefill: có giá trị hiện tại
│       │                │
│       │                ├── Validation lỗi -> Tooltip đỏ (giữ popup)
│       │                └── Lưu thành công -> Đóng popup, cập nhật DS
│       │                                          Toast "Cập nhật thành công"
│       │
│       ├── [Xóa 🗑] -> Dialog xác nhận "Bạn có chắc muốn xóa?"
│       │                │
│       │                ├── [Xóa] -> xóa bản ghi khỏi DS
│       │                │          Toast "Xóa thành công"
│       │                └── [Hủy] -> đóng dialog, giữ nguyên bản ghi
│       │
│       └── [Row actions]: [Sửa ✎], [Xóa 🗑]
```

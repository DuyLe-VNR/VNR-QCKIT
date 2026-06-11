---
description: "Quét toàn bộ *Page.ts và *Locator.ts trong .specify/tests/pages/**, đọc url-aliases.md, khớp alias → Page Object + Locator theo URL path segment, sinh file url-page-map.md. Dùng trước khi viết test để biết màn hình nào đã có Page Object."
argument-hint: ""
---

# /qc_url_page_map

Quét toàn bộ Page Object và Locator đã có trong `.specify/tests/pages/`, so khớp với danh sách URL alias trong `url-aliases.md`, sinh file mapping `url-page-map.md`.

---

## BƯỚC 0 — Kiểm tra điều kiện

Kiểm tra tồn tại hai file:

| File | Mục đích |
| --- | --- |
| `.specify/tests/url-aliases.md` | Danh sách alias → path |
| `.specify/tests/pages/` | Thư mục chứa Page Objects |

Nếu `url-aliases.md` không tồn tại → **DỪNG**:
```
⛔ Không tìm thấy .specify/tests/url-aliases.md — chạy /qc_pre trước.
```

Nếu thư mục `pages/` không có file `*Page.ts` nào → **CẢNH BÁO** (vẫn tiếp tục, nhưng cột Page Class sẽ trống hết).

---

## BƯỚC 1 — Quét *Page.ts và *Locator.ts

Dùng Glob tìm:
```
.specify/tests/pages/**/*Page.ts
.specify/tests/pages/**/*Locator.ts
```

Với **mỗi file `*Page.ts`**:
- Đọc nội dung file
- Tìm `export class {ClassName}` — lấy `ClassName`
- Ghi nhận đường dẫn file **tương đối** tính từ `.specify/tests/pages/` (ví dụ: `hre/HreProfilePage.ts`)

Với **mỗi file `*Locator.ts`**:
- Đọc nội dung file
- Tìm `export class {ClassName}` — lấy `ClassName`
- Ghi nhận đường dẫn file tương đối

**Ghép cặp Page ↔ Locator**: so khớp theo prefix tên file:
- `HreProfilePage.ts` ↔ `HreProfileLocator.ts` → cùng prefix `HreProfile`
- Nếu không có Locator tương ứng → để trống cột Locator

In tóm tắt:
```
Tìm thấy: {n} Page files, {m} Locator files
  → {k} cặp khớp được, {j} Page chưa có Locator
```

---

## BƯỚC 2 — Parse url-aliases.md

Đọc `.specify/tests/url-aliases.md`.

Cấu trúc file:
```markdown
## Tên section

| Alias | Path (local) | Path (full) | Mô tả |
| --- | --- | --- | --- |
| hre_profile | /Hre_Profile/Index | /Hrm_Main_Web/Hre_Profile/Index | Nhân viên đang làm việc |
```

Thu thập toàn bộ:
```
aliases = [
  { alias: "hre_profile", pathLocal: "/Hre_Profile/Index", pathFull: "/Hrm_Main_Web/Hre_Profile/Index", desc: "Nhân viên đang làm việc", section: "Ho so nhan su (HRE)" },
  ...
]
```

Bỏ qua alias có path là `/`, `/#/`, hoặc chứa `/auth/`.

---

## BƯỚC 3 — Mapping alias → Page Object

Với **mỗi alias**, tìm Page Object phù hợp nhất bằng cách so khớp URL path segment:

### Thuật toán khớp:

1. **Lấy segments** từ `pathLocal` (hoặc `pathFull`):
   - Ví dụ: `/Hre_Profile/Index` → segments = `["hre_profile", "index"]` (lowercase, underscore-normalized)
   - `/Att_LeaveDay/Index` → `["att_leaveday", "index"]`

2. **Với mỗi Page class**, tính **điểm khớp**:
   - Chuẩn hóa tên class: `HreProfilePage` → `hreprofile`
   - So khớp từng segment của URL với chuỗi tên class đã chuẩn hóa
   - Điểm = số ký tự khớp liên tiếp / độ dài chuỗi ngắn hơn
   - Ví dụ: `att_leaveday` vs `AttLeaveDayPage` → score cao

3. **Chọn Page có điểm cao nhất** (ngưỡng tối thiểu: 0.6):
   - Nếu điểm < 0.6 → không khớp, để trống

4. **Tìm Locator** tương ứng với Page đã chọn (theo cặp đã ghép ở Bước 1).

### Ví dụ khớp:
```
alias: hre_profile        → HreProfilePage.ts     (score: 0.95)
alias: att_leave_day      → AttLeaveDayPage.ts     (score: 0.90)
alias: sal_compute_payroll → SalComputePayrollPage.ts (score: 0.88)
alias: dash_board         → [không khớp]           (score: 0.40)
```

---

## BƯỚC 4 — Sinh file url-page-map.md

Ghi file `.specify/tests/pages/url-page-map.md`.

### Cấu trúc file:

```markdown
# URL → Page Object Map

> Sinh bởi : /qc_url_page_map — {ISO_DATE}
> Tổng alias: {total}  |  Đã khớp: {matched}  |  Chưa có Page Object: {unmatched}

---

## Đã có Page Object ({matched} màn hình)

| Alias | URL Path | Mô tả | Page Class | Page File | Locator Class | Locator File |
| --- | --- | --- | --- | --- | --- | --- |
| hre_profile | /Hre_Profile/Index | Nhân viên đang làm việc | HreProfilePage | hre/HreProfilePage.ts | HreProfileLocator | hre/HreProfileLocator.ts |
| att_leave_day | /Att_LeaveDay/Index | DS Ngày nghỉ | AttLeaveDayPage | att/AttLeaveDayPage.ts | AttLeaveDayLocator | att/AttLeaveDayLocator.ts |

---

## Chưa có Page Object ({unmatched} màn hình)

| Alias | URL Path | Mô tả | Section |
| --- | --- | --- | --- |
| dash_board | /DashBoard/Index | Biểu đồ chức danh | Dashboard |
| sal_compute_payroll | /Sal_ComputePayroll/Index | Tính lương | Luong (SAL) |

---

## Thống kê theo Section

| Section | Tổng | Đã có PO | Chưa có PO |
| --- | --- | --- | --- |
| Ho so nhan su (HRE) | 120 | 15 | 105 |
| Cham cong (ATT) | 80 | 3 | 77 |
| Luong (SAL) | 60 | 0 | 60 |
```

### Quy tắc ghi file:
- Nếu file đã tồn tại → **ghi đè** (luôn là snapshot mới nhất)
- Sắp xếp bảng "Đã có" theo section, rồi theo alias (alphabetical)
- Sắp xếp bảng "Chưa có" theo section

---

## BƯỚC 5 — Báo cáo tổng hợp

```
[v] qc_url_page_map hoàn thành

Kết quả:
  Page files tìm thấy   : {n}
  Locator files tìm thấy: {m}
  Tổng alias trong map  : {total}
  Đã khớp Page Object   : {matched} ({pct}%)
  Chưa có Page Object   : {unmatched} ({pct}%)

Top section chưa có PO:
  ATT (Chấm công)  : {n} màn hình chưa có PO
  SAL (Lương)      : {n} màn hình chưa có PO
  HRE (Hồ sơ)     : {n} màn hình chưa có PO

Output: .specify/tests/pages/url-page-map.md

Bước tiếp theo:
  → Xem url-page-map.md để biết màn hình nào cần tạo Page Object
  → Chạy /qc_generate {PBI_ID} — tự tham chiếu url-page-map để import đúng PO
```

---

## QUY TẮC

- **Không sửa** `url-aliases.md` hay bất kỳ `*Page.ts` / `*Locator.ts` nào.
- Chỉ **đọc** file, **không tạo** Page Object mới — đây là skill mapping thuần túy.
- Nếu một alias khớp với **nhiều Page** cùng điểm → chọn file có path ngắn nhất (ít thư mục con hơn).
- `BasePage.ts` **không** được tính là Page Object để khớp.
- Locator không bắt buộc — alias có Page nhưng không có Locator vẫn được ghi (để trống cột Locator).

---
description: "QC preflight setup — cài Playwright + Chromium, kiểm tra/tạo playwright.config.ts & global-setup.ts, tạo BasePage.ts nếu thiếu, crawl navigation và sinh url-aliases.md. Chạy 1 lần khi khởi tạo project hoặc reset cấu hình. Yêu cầu: .specify/tests/.env có ENV và APP_URL."
---

# /qc_pre

Command **setup môi trường project** — chạy thủ công 1 lần khi khởi tạo project hoặc khi cần reset lại cấu hình.

Thực hiện 3 bước chính. **Bước 1 (`/vnr-qckit:qc_setup`) chạy trước.** Sau khi hoàn thành, **CHECK 6 và CHECK 7 chạy song song** — khởi động cùng lúc, không chờ nhau.

---

## Bước 1 — Gọi `/vnr-qckit:qc_setup`

Dùng **Skill tool** gọi skill `/vnr-qckit:qc_setup`.

`/vnr-qckit:qc_setup` sẽ thực hiện tuần tự: cài Playwright + Chromium, kiểm tra/tạo `playwright.config.ts`, kiểm tra/tạo `global-setup.ts`.

Chờ `/vnr-qckit:qc_setup` hoàn thành → tiếp **CHECK 2 & CHECK 3 song song**.

---

## Mục đích

Khởi tạo và chuẩn hóa project Automation Test mới:

- Kiểm tra cấu hình Playwright.
- Kiểm tra hoặc tạo `.specify/tests/pages/BasePage.ts`.
- Crawl URL từ hệ thống đang chạy.
- Sinh hoặc cập nhật `url-aliases.md`.
- Báo cáo trạng thái setup QC.

## CHECK 2 - BasePage.ts

Kiểm tra:

```powershell
Test-Path .specify/tests/pages/BasePage.ts
```

Nếu thiếu, gọi command:

```text
/vnr-qckit:qc_basepage
```

Yêu cầu khi gọi:

- Thực thi ngay.
- Chờ hoàn thành.
- Ghi nhận trạng thái `created`, `updated`, `exists`, hoặc `failed`.

Nếu đã tồn tại, đọc file để xác nhận có class `BasePage`.

## CHECK 3 - Crawl URL và sinh url-aliases.md

### Đọc môi trường

Đọc `ENV` từ:

```text
.specify/tests/.env
```

Sau đó đọc `APP_URL` từ:

```text
.specify/tests/.env.{ENV}
```

Nếu không tìm thấy `ENV` hoặc `APP_URL`, báo lỗi cấu hình và không crawl.

### Load alias hiện có

Nếu `url-aliases.md` tồn tại:

- Đọc file.
- Giữ alias cũ.
- Chỉ cập nhật path/mô tả khi phát hiện thay đổi.

Nếu chưa tồn tại:

- Tạo mới theo format trong phần "Ghi url-aliases.md".

### Crawl navigation

Dùng Playwright CLI hoặc MCP browser tool nếu có:

```text
open APP_URL
snapshot
click role=link/menuitem/tab
snapshot
record current URL
```

Thu thập:

- Full URL sau click.
- Path local, bỏ prefix `APP_URL`.
- Text hiển thị của link/menu/tab.
- Sub-tab nếu màn hình có tab con.

## Quy tắc sinh alias

| Path | Quy tắc | Ví dụ alias |
| --- | --- | --- |
| `/agentwork/ai-employee` | prefix `aw_` + path snake_case | `aw_ai_employee` |
| `/agentwork/settings?tab=log` | query param thành suffix | `aw_settings_log` |
| `/setting/template` | prefix `set_` | `set_template` |

Nếu alias cũ đã tồn tại:

- Không đổi tên alias.
- Cập nhật path nếu route đổi.
- Đánh dấu cảnh báo nếu route cũ không còn thấy trong crawl.

## Ghi url-aliases.md

Format:

```markdown
# URL Aliases

> Sinh tự động bởi /qc_pre - {ISO_DATE}

> ENV: {ENV}
> APP_URL: {APP_URL}

## Nhóm màn hình

| Alias | Path (local) | Path (dev) | Mô tả |
| --- | --- | --- | --- |
| aw_home | /agentwork/home | /home | Trang chủ |
```

## Báo cáo cuối

In báo cáo:

```text
[v] qc_pre hoàn thành

Playwright + Chromium : [v] đã cài
playwright.config.ts  : {OK | [edit] đã sửa | [new] đã tạo}
global-setup.ts       : {OK | [new] đã tạo từ template | [new] đã tạo qua /qc_login_discover}

BasePage.ts
: EXISTS | CREATED | UPDATED | FAILED

url-aliases.md
: added={n}, updated={n}, unchanged={n}, warning={n}
```

## Không dùng cho

- Pipeline tự động `qc-auto*`.
- Tác vụ chỉ cần chạy test hiện có.

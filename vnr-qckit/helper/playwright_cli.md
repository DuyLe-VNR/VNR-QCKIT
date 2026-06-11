# Playwright CLI — Cheat Sheet

> Project: `.specify/tests`
> Config : `playwright.config.ts`
> Session: `user.json` (sinh bởi `global-setup.ts`)

---

## 0. Khai báo biến (chạy 1 lần đầu mỗi session)

```powershell
# ── Thư mục gốc ──────────────────────────────────────────────
$TESTS_DIR = ".specify\tests"

# ── Đọc từ .env.local ────────────────────────────────────────
$envFile   = "$TESTS_DIR\.env.local"
$APP_URL   = (Get-Content $envFile | Select-String "^APP_URL=").Line -replace "^APP_URL=", ""

# ── PBI đang làm việc (đổi mỗi khi đổi PBI) ─────────────────
$PBI_ID    = "090626"

# ── Derived ──────────────────────────────────────────────────
$SPEC      = "runs\$PBI_ID.spec.ts"
$SPEC_DIR  = "runs"
```

> Sau khi khai báo, mọi lệnh bên dưới dùng biến thay vì hardcode value.

---

## 1. Chạy test

```powershell
# Di chuyển vào thư mục tests (chỉ cần 1 lần)
cd $TESTS_DIR

# Tất cả test
npx playwright test

# Một file cụ thể (theo PBI)
npx playwright test $SPEC

# Một test theo tên (grep)
npx playwright test $SPEC --grep "TC-001"

# Theo tag PBI
npx playwright test --grep "@$PBI_ID"

# Toàn bộ thư mục runs/
npx playwright test $SPEC_DIR

# Chạy có giao diện (headed)
npx playwright test $SPEC --headed

# Chạy debug (dừng tại mỗi bước)
npx playwright test $SPEC --debug

# Chạy với số worker cụ thể
npx playwright test $SPEC --workers=1
npx playwright test $SPEC --workers=4

# Dừng ngay khi có 1 test fail
npx playwright test $SPEC --bail=1
```

---

## 2. Xem báo cáo

> **Lưu ý cấu trúc:** Mỗi lần chạy test sinh ra 1 thư mục `test-results/{timestamp}/`
> chứa cả **HTML report** (`index.html`) và **artifacts** (trace, screenshot, video) của lần đó.

```powershell
# ── Lấy thư mục report mới nhất (dùng lại ở các lệnh bên dưới) ──
$LAST_RUN = (Get-ChildItem "test-results" -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName

# Mở HTML report của lần chạy mới nhất
npx playwright show-report $LAST_RUN

# Mở HTML report của PBI đang làm
$REPORT_PBI = (Get-ChildItem "test-results" -Directory | Where-Object Name -match $PBI_ID | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
npx playwright show-report $REPORT_PBI
```

### Xem tóm tắt kết quả (không mở browser)

```powershell
# Đọc kết quả lần chạy cuối (pass/fail)
Get-Content "test-results\.last-run.json" | ConvertFrom-Json

# Liệt kê tất cả lần chạy kèm thời gian
Get-ChildItem "test-results" -Directory | Sort-Object LastWriteTime -Descending |
  Select-Object Name, LastWriteTime | Format-Table -AutoSize
```

### Xem trace khi TC fail

```powershell
# Tìm tất cả trace.zip trong lần chạy mới nhất
$TRACES = Get-ChildItem $LAST_RUN -Recurse -Filter "trace.zip"
$TRACES | Select-Object FullName

# Mở trace của TC cụ thể (grep theo tên TC)
$TRACE_TC = ($TRACES | Where-Object DirectoryName -match "TC-002").FullName
npx playwright show-trace $TRACE_TC

# Mở trace đầu tiên tìm được
npx playwright show-trace $TRACES[0].FullName
```

### Xem screenshot / video khi TC fail

```powershell
# Liệt kê screenshot trong lần chạy mới nhất
Get-ChildItem $LAST_RUN -Recurse -Filter "*.png" | Select-Object FullName

# Mở screenshot TC fail (Windows Explorer)
Get-ChildItem $LAST_RUN -Recurse -Filter "*.png" | ForEach-Object { Start-Process $_.FullName }

# Liệt kê video
Get-ChildItem $LAST_RUN -Recurse -Filter "*.webm" | Select-Object FullName
```

---

## 3. Codegen — Ghi lại thao tác thành code

```powershell
# Mở browser và ghi lại thao tác
npx playwright codegen $APP_URL

# Ghi có reuse session (dùng user.json)
npx playwright codegen --load-storage="$TESTS_DIR\user.json" $APP_URL

# Ghi và lưu ra file
npx playwright codegen --output="$SPEC_DIR\recorded.spec.ts" $APP_URL
```

---

## 4. Session & Auth

```powershell
# Chạy lại global-setup để refresh user.json
cd $TESTS_DIR
npx ts-node -e "import('./global-setup.ts').then(m => m.default({} as any))"

# Kiểm tra session còn hạn không
Get-Content "$TESTS_DIR\user.json" | ConvertFrom-Json | Select-Object -ExpandProperty cookies | Select-Object name, expires

# Xóa session để force login lại
Remove-Item "$TESTS_DIR\user.json" -Force
```

---

## 5. Inspector & Selector

```powershell
# Mở Playwright Inspector trên trang đã đăng nhập
npx playwright open --load-storage="$TESTS_DIR\user.json" $APP_URL

# Chạy test với inspector (dừng tại dòng đầu tiên)
$env:PWDEBUG = "1"
npx playwright test $SPEC

# Reset sau khi debug xong
Remove-Item Env:PWDEBUG
```

---

## 6. Cài đặt & Cập nhật

```powershell
# Cài Playwright vào thư mục project
npm install --save-dev @playwright/test --prefix $TESTS_DIR

# Kiểm tra version
npx playwright --version

# Cập nhật Playwright
npm install @playwright/test@latest --prefix $TESTS_DIR
npx playwright install
```

---

## 7. Chạy theo tag / annotation

```powershell
# Chạy test có tag @smoke
npx playwright test --grep "@smoke"

# Chạy test theo PBI tag
npx playwright test --grep "@$PBI_ID"

# Chạy Auto TC của PBI hiện tại
npx playwright test --grep "@$PBI_ID" --grep "@auto"

# Bỏ qua test có tag @slow
npx playwright test --grep-invert "@slow"
```

---

## 8. Biến môi trường khi chạy

```powershell
# Override APP_URL (không sửa .env.local)
$env:APP_URL = $APP_URL
npx playwright test $SPEC

# Chạy headed (override headless trong config)
$env:PW_HEADLESS = "false"
npx playwright test $SPEC

# Chỉ định report output dir
$env:REPORT_DIR = ".\test-results\manual-$PBI_ID"
npx playwright test $SPEC

# Reset tất cả env override
Remove-Item Env:APP_URL, Env:PW_HEADLESS, Env:REPORT_DIR -ErrorAction SilentlyContinue
```

---

## 9. TypeScript / ts-node

```powershell
# Chạy global-setup trực tiếp
npx ts-node "$TESTS_DIR\global-setup.ts"

# Chạy inline expression
npx ts-node -e "import('./global-setup.ts').then(m => m.default({} as any))"
```

---

## 10. Lệnh hay dùng kết hợp

```powershell
# Xóa session → refresh → chạy test PBI hiện tại
Remove-Item "$TESTS_DIR\user.json" -Force
npx ts-node -e "import('./global-setup.ts').then(m => m.default({} as any))"
npx playwright test $SPEC

# Chạy test 1 PBI + mở report ngay
npx playwright test $SPEC; npx playwright show-report

# Chạy headed + dừng khi fail đầu tiên
npx playwright test $SPEC --headed --bail=1

# Chạy lại đúng 1 TC fail
npx playwright test $SPEC --grep "TC-002"

# Copy per-TC script vào runs/ rồi chạy riêng lẻ
$TC = "TC-001"
Copy-Item "..\specs\$PBI_ID\auto_test_results\$TC.spec.ts" ".\runs\"
npx playwright test "runs\$TC.spec.ts"
```

---

## Cấu trúc thư mục test

```
.specify/tests/
  playwright.config.ts     ← testDir: './runs'
  global-setup.ts          ← login, sinh user.json
  user.json                ← session storage (gitignore)
  .env                     ← ENV=local
  .env.local               ← APP_URL, AUTH_USERNAME, AUTH_PASSWORD
  pages/
    BasePage.ts            ← base methods: inputTextbox, inputCombobox, ...
    {group}/
      {AliasPage}.ts       ← Page Object
  runs/                    ← spec files copy vào đây để Playwright chạy (gitignore)
    {PBI_ID}.spec.ts
    TC-{NNN}.spec.ts
  test-results/            ← HTML report, trace, screenshot (gitignore)
```

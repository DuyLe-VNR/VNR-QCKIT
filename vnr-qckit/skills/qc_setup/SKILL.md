---
description: "[Internal] Called by /vnr-qckit:qc_pre. Install Playwright + Chromium, check/create playwright.config.ts and global-setup.ts."
user-invocable: false
---

# /qc_setup

Command cài đặt Playwright + kiểm tra/tạo config files – chạy thủ công 1 lần khi khởi tạo project hoặc khi cần reset cấu hình. Có thể gọi độc lập hoặc được gọi bởi `/vnr-qckit:qc_pre`.

Thực hiện 6 check tuần tự (CHECK 0 → CHECK 5). CHECK 1 MISSING thì skip CHECK 2/3/4.

---

## CHECK 0 – Cài Playwright + Chromium từ plugin tools

Luôn chạy tuần tự, không kiểm tra trước, không hỏi user:

**Bước 0.1 – Tạo thư mục `.specify\tests` (và các thư mục con) trước khi cài:**

```powershell
$testsDir = Join-Path (Get-Location) ".specify\tests"
New-Item -ItemType Directory -Force -Path "$testsDir"          | Out-Null
New-Item -ItemType Directory -Force -Path "$testsDir\runs"    | Out-Null
New-Item -ItemType Directory -Force -Path "$testsDir\pages"    | Out-Null
Write-Host "OK: directories -> $testsDir"
```

> **Bắt buộc chạy trước npm install.** Nếu `.specify\tests` chưa tồn tại, npm sẽ tạo thư mục `.specifytests` (gộp dấu `/`) thay vì `.specify\tests`.

**Bước 0.2 – Install Playwright dependencies vào `.specify\tests`:**

```powershell
$testsDir = Join-Path (Get-Location) ".specify\tests"
npm install --save-dev @playwright/test --prefix "$testsDir"
```

> Dùng đường dẫn tuyệt đối `$testsDir` thay vì relative path `.specify/tests` để tránh lỗi trên Windows.

**Bước 0.3 – Copy Chromium từ plugin tools vào thư mục cố định:**

```powershell
$src  = "{PLUGIN_DIR}\tools\pw-chromium\chrome-win"
$dest = "$env:LOCALAPPDATA\pw-chromium\chrome-win"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path "$src\*" -Destination $dest -Recurse -Force
Write-Host "OK: Chromium -> $dest"
```

> Nếu `{PLUGIN_DIR}` chưa được resolve tự động, thay bằng đường dẫn tuyệt đối của thư mục plugin.  
> Ví dụ: `D:\SourceCode\AutomationProcess\vnr-qckit\tools\pw-chromium\chrome-win`

**Bước 0.4 – tsconfig.json trong `.specify\tests` nếu chưa có:**

```powershell
$tsconfig = Join-Path (Get-Location) ".specify\tests\tsconfig.json"
if (Test-Path $tsconfig) { Write-Host "OK" } else { Write-Host "MISSING" }
```

MISSING → Dùng Write tool ghi `.specify/tests/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": "."
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

→ Tiếp CHECK 1.

> Lý do dùng thư mục cố định `%LOCALAPPDATA%\pw-chromium`: Tránh phải detect revision. `executablePath` trong `playwright.config.ts` trỏ thẳng vào `%LOCALAPPDATA%\pw-chromium\chrome-win\chrome.exe`.  
> Nguồn Chromium: `{PLUGIN_DIR}\tools\pw-chromium\chrome-win` (đã bundled sẵn trong plugin).

---

## CHECK 1 – playwright.config.ts tồn tại?

```powershell
$f = Join-Path (Get-Location) ".specify\tests\playwright.config.ts"
if (Test-Path $f) { Write-Host "OK" } else { Write-Host "MISSING" }
```

**MISSING** → tìm template theo thứ tự:

```text
{skills_dir}/playwright.config.template.ts
```

Không tìm thấy → tạo với nội dung chuẩn sau:

Dùng Write tool ghi `.specify/tests/playwright.config.ts` → skip CHECK 2/3/4, tiếp CHECK 5.

**OK** → tiếp CHECK 2.

### Nội dung chuẩn khi tạo mới:

```typescript
import { defineConfig } from '@playwright/test'
import fs from 'fs'
import path from 'path'

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}
  return Object.fromEntries(
    fs.readFileSync(filePath, 'utf-8')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const idx = line.indexOf('=')
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
      })
  )
}

const { ENV } = readEnvFile(path.resolve(__dirname, '.env'))
const envVars = ENV ? readEnvFile(path.resolve(__dirname, `.env.${ENV}`)) : {}
const baseURL = process.env.APP_URL || envVars.APP_URL || ''

// KHÔNG dùng baseURL để navigate hash URL (/#/path) — Playwright không resolve
// URL dạng /#/path vì đây là hash fragment, không phải relative URL theo HTTP spec.
// BasePage.navigate() tự resolve bằng cách đọc APP_URL từ .env trong từng worker.

function makeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

const reportDir = process.env.REPORT_DIR || `./test-results/${makeTimestamp()}`

export default defineConfig({
  testDir: './runs',
  globalSetup: './global-setup.ts',
  use: {
    headless: (process.env.PW_HEADLESS ?? envVars.PW_HEADLESS ?? 'true') !== 'false',
    baseURL,
    storageState: './user.json',
    launchOptions: {
      executablePath: `${process.env.LOCALAPPDATA}\\pw-chromium\\chrome-win\\chrome.exe`,
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: [
    ['html', { outputFolder: reportDir, open: 'never' }],
    ['list'],
  ],
  outputDir: reportDir,
  workers: 1,
})
```

---

## CHECK 2 – Đọc .env?

```powershell
$cfg = Join-Path (Get-Location) ".specify\tests\playwright.config.ts"
if (Select-String -Path $cfg -Pattern "readEnvFile|dotenv" -Quiet) { Write-Host "OK" } else { Write-Host "MISSING" }
```

**MISSING** → Edit: chèn hàm `readEnvFile` + `path.resolve(__dirname, '.env')` + `baseURL` từ env sau import cuối, thay hardcode baseURL bằng biến. Đảm bảo `import path from 'path'` có mặt.

**OK** → tiếp CHECK 3.

---

## CHECK 3 – headless đọc từ env?

```powershell
$cfg = Join-Path (Get-Location) ".specify\tests\playwright.config.ts"
if (Select-String -Path $cfg -Pattern "PW_HEADLESS" -Quiet) { Write-Host "OK" } else { Write-Host "MISSING" }
```

**MISSING** → Edit: thay `headless: true` bằng expression đọc từ env:
```typescript
headless: (process.env.PW_HEADLESS ?? envVars.PW_HEADLESS ?? 'true') !== 'false',
```
Cho phép override `PW_HEADLESS=false` trong `.env.local` để debug mà không cần sửa config.

**OK** → tiếp CHECK 4.

---

## CHECK 4 – REPORT_DIR?

```powershell
$cfg = Join-Path (Get-Location) ".specify\tests\playwright.config.ts"
if (Select-String -Path $cfg -Pattern "REPORT_DIR" -Quiet) { Write-Host "OK" } else { Write-Host "MISSING" }
```

**MISSING** → Edit: thêm `const reportDir = process.env.REPORT_DIR || \`./test-results/${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}\``, cập nhật `outputFile` + `outputFolder` dùng `reportDir`.

**OK** → tiếp CHECK 5.

---

## CHECK 5 – global-setup.ts tồn tại?

```powershell
$f = Join-Path (Get-Location) ".specify\tests\global-setup.ts"
if (Test-Path $f) { Write-Host "OK" } else { Write-Host "MISSING" }
```

**OK** → không làm gì, tiếp báo cáo kết quả.

**MISSING** → Dùng Read tool đọc `{PLUGIN_DIR}/skills/global-setup.template.ts`

Không thay thế placeholder – template tự đọc từ env lúc runtime.

Dùng Write tool ghi `.specify/tests/global-setup.ts`.

Báo:

```text
[v] global-setup.ts – đã tạo từ template chung
```

> **Quy tắc:** `global-setup.ts` chứa marker `LOGIN_VERSION` ở dòng đầu tiên. Khi gặp lỗi login (403, session expired), agent không được tự sửa file – phải dừng pipeline và báo user.

### Cơ chế hoạt động của global-setup.ts:

| Tình huống | Hành động |
| --- | --- |
| `user.json` chưa tồn tại | Login đầy đủ → lưu storageState |
| `user.json` tồn tại, có `LOGIN_SESSION` hợp lệ | Reuse session, bỏ qua login |
| `user.json` tồn tại nhưng session hết hạn | Login lại, ghi đè `user.json` |

---

## CHECK 6 – BasePage.navigate() resolve URL đúng?

```powershell
$bp = Join-Path (Get-Location) ".specify\tests\pages\BasePage.ts"
if (Test-Path $bp) {
  if (Select-String -Path $bp -Pattern "_resolveAppUrl|_APP_URL" -Quiet) { Write-Host "OK" } else { Write-Host "OUTDATED" }
} else { Write-Host "MISSING" }
```

**MISSING** → BasePage.ts chưa có → `/qc_basepage` sẽ tạo đúng template.

**OUTDATED** → BasePage.ts có nhưng dùng `page.goto(url)` trực tiếp, chưa có `_resolveAppUrl`.

Vấn đề: Playwright **không tự resolve** URL dạng `/#/path` (hash fragment) với `baseURL` vì đây không phải relative URL theo HTTP spec.  
URL dạng `/#/path` → lỗi `Cannot navigate to invalid URL`.

→ Edit `BasePage.ts`: thêm hàm `_resolveAppUrl()` đọc `.env → .env.{ENV}` lấy `APP_URL`, thêm constant `_APP_URL`, sửa method `navigate()`:

```typescript
// Thêm vào đầu file (sau các import @playwright):
import fs from 'fs'
import path from 'path'

function _resolveAppUrl(): string {
  try {
    const root = path.resolve(__dirname, '..')
    const readEnv = (fp: string): Record<string, string> => {
      if (!fs.existsSync(fp)) return {}
      return Object.fromEntries(
        fs.readFileSync(fp, 'utf-8').split('\n')
          .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
          .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
      )
    }
    const { ENV } = readEnv(path.join(root, '.env'))
    const envVars = ENV ? readEnv(path.join(root, `.env.${ENV}`)) : {}
    return (process.env.APP_URL || envVars.APP_URL || '').replace(/\/$/, '')
  } catch { return '' }
}

const _APP_URL = _resolveAppUrl()

// Sửa method navigate():
async navigate(url: string) {
  const resolved = url.startsWith('/') ? `${_APP_URL}${url}` : url
  await this.page.goto(resolved, { waitUntil: 'domcontentloaded' })
}
```

**OK** → không làm gì, tiếp báo cáo kết quả.

---

## Báo cáo kết quả

```text
[v] qc_setup hoàn thành

Playwright + Chromium : [v] đã cài
tsconfig.json         : {OK | [new] đã tạo}
playwright.config.ts  : {OK | [edit] đã sửa | [new] đã tạo}
runs/ directory       : {OK | [new] đã tạo}
global-setup.ts       : {OK | [new] đã tạo từ template}
BasePage.navigate()   : {OK | [edit] đã sửa — thêm _resolveAppUrl}
```

---

## QUY TẮC

- Gọi thủ công khi setup project mới hoặc cần reset config Playwright.
- Có thể gọi độc lập mà không cần chạy `/vnr-qckit:qc_pre`.
- Env files đã có sẵn – không tạo lại.

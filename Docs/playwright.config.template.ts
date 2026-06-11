import { defineConfig } from '@playwright/test'
import fs from 'fs'

// -----------------------------------------------------------------------------
// Đọc env file dạng KEY=VALUE - bỏ qua comment (#) và dòng trống
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Resolve APP_URL theo môi trường (CWD = .specify/tests/)
//
// .env         -> ENV=local | dev | staging | ...
// .env.{ENV}   -> APP_URL=https://...
//
// Thứ tự ưu tiên:
//  1. process.env.APP_URL (truyền inline khi chạy CLI)
//  2. APP_URL trong .env.{ENV}
//  3. Chuỗi rỗng (playwright sẽ dùng URL tuyệt đối trong từng test)
// -----------------------------------------------------------------------------
const { ENV } = readEnvFile('.env')
const envVars = ENV ? readEnvFile(`.env.${ENV}`) : {}
const baseURL = process.env.APP_URL || envVars.APP_URL || ''

// -----------------------------------------------------------------------------
// REPORT_DIR - nơi lưu toàn bộ output của 1 lần chạy pipeline
//
// Trong pipeline: REPORT_DIR được set là absolute path bởi qc-auto BƯỚC 0
// Chạy thủ công: fallback về ./test-results/{timestamp}/
// -----------------------------------------------------------------------------
function makeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

const reportDir = process.env.REPORT_DIR || `./test-results/${makeTimestamp()}`

// Đảm bảo thư mục tồn tại trước khi playwright ghi output
// - Trong pipeline: qc_run đã mkdir sẵn qua BƯỚC 0.5
// - Chạy thủ công: fallback path chưa được tạo -> tạo ở đây
if (!fs.existsSync(`${reportDir}/playwright-reports`)) {
  fs.mkdirSync(`${reportDir}/playwright-reports`, { recursive: true })
}

// -----------------------------------------------------------------------------
export default defineConfig({
  testDir: './script_auto',
  fullyParallel: true,
  retries: 0,
  workers: 3,

  reporter: [
    ['list'],
    ['json', { outputFile: `${reportDir}/results.json` }],
    ['html', { outputFolder: `${reportDir}/playwright-reports`, open: 'never' }],
  ],

  use: {
    baseURL,
    headless: true,
    storageState: './playwright/.auth/user.json',
    launchOptions: {
      executablePath: `${process.env.LOCALAPPDATA}\\pw-chromium\\chrome-win\\chrome.exe`,
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  globalSetup: './global-setup.ts',
})

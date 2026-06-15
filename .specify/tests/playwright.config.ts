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
const headless = (process.env.PW_HEADLESS ?? envVars.PW_HEADLESS ?? 'true') !== 'false'
const video = (process.env.PW_VIDEO ?? envVars.PW_VIDEO ?? 'retain-on-failure') as 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'

function makeTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

const reportDir = process.env.REPORT_DIR || `./test-results/${makeTimestamp()}`

export default defineConfig({
  testDir: './playwright',
  globalSetup: './global-setup.ts',
  use: {
    viewport: { width: 1366, height: 768 },
    headless,
    baseURL,
    storageState: './user.json',
    launchOptions: {
      executablePath: `${process.env.LOCALAPPDATA}\\pw-chromium\\chrome-win\\chrome.exe`,
    },
    screenshot: 'only-on-failure',
    video,
    trace: 'retain-on-failure',
  },
  reporter: [
    ['html', { outputFolder: reportDir, open: 'never' }],
    ['list'],
  ],
  outputDir: reportDir,
  workers: 1,
})

// LOGIN_VERSION=direct-form-1.0
// Sinh bởi /qc_pre – direct form login tại https://hrmcore.vnresource.net/identity/Account/Login
// Selectors: #Username, #txtPassword, button.btn-primary
// ⚠ Không sửa file này thủ công. Chạy /qc_login_discover để cập nhật khi flow login thay đổi.

import { chromium, FullConfig } from '@playwright/test'
import fs from 'fs'
import path from 'path'

// ─── Đọc env file ────────────────────────────────────────────────────────────
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

// ─── Kiểm tra session còn hạn ────────────────────────────────────────────────
function isSessionValid(statePath: string): boolean {
  if (!fs.existsSync(statePath)) return false
  try {
    const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'))
    const cookies: Array<{ name: string; expires?: number }> = state.cookies ?? []
    const authCookie = cookies.find(c => /session|token|auth|access/i.test(c.name))
    if (!authCookie) return false
    if (authCookie.expires && authCookie.expires > 0) {
      return authCookie.expires * 1000 > Date.now()
    }
    return true
  } catch {
    return false
  }
}

// ─── Global Setup ─────────────────────────────────────────────────────────────
export default async function globalSetup(_config: FullConfig) {
  // ── 1. Nạp biến môi trường ──────────────────────────────────────────────────
  const dir     = __dirname
  const baseEnv = readEnvFile(path.join(dir, '.env'))
  const envName = baseEnv.ENV || 'local'
  const envVars = readEnvFile(path.join(dir, `.env.${envName}`))
  const env     = { ...baseEnv, ...envVars }

  const baseURL      = process.env.APP_URL       || env.APP_URL       || 'http://localhost:4200'
  const baseURLlogin = process.env.APP_URL_LOGIN       || env.APP_URL_LOGIN       || 'http://localhost:4200'
  const username     = process.env.AUTH_USERNAME || env.AUTH_USERNAME || 'admin'
  const password     = process.env.AUTH_PASSWORD || env.AUTH_PASSWORD || ''
  const headless     = (env.PW_HEADLESS ?? 'true') !== 'false'
  const authPath     = env.AUTH_STATE_PATH || path.join(dir, 'user.json')
  const chromiumExe  = `${process.env.LOCALAPPDATA}\\pw-chromium\\chrome-win\\chrome.exe`

  console.log(`\n[global-setup] ENV=${envName}  APP_URL=${baseURL}`)

  // ── 2. Reuse session nếu còn hạn ────────────────────────────────────────────
  if (isSessionValid(authPath)) {
    console.log('[global-setup] Session hợp lệ – reuse user.json, bỏ qua login ✓')
    return
  }

  console.log('[global-setup] Session hết hạn hoặc chưa có – đăng nhập mới...')

  // ── 3. Khởi động browser ────────────────────────────────────────────────────
  const browser = await chromium.launch({
    headless,
    executablePath: fs.existsSync(chromiumExe) ? chromiumExe : undefined,
  })

  const context = await browser.newContext({ baseURLlogin })
  const page    = await context.newPage()

  try {
    // ── 4. Đăng nhập — Direct form login (username + password) ────────────────
    // Mở trang app → redirect về /identity/Account/Login
    await page.goto('/', { waitUntil: 'load', timeout: 30_000 })
    await page.waitForTimeout(1_500)

    // Form login trực tiếp: #Username / #txtPassword / button.btn-primary
    // (Không dùng SSO — form native của hrmcore hoạt động với cùng credentials)
    const usernameField = page.locator('#Username, input[name="Username"]').first()
    await usernameField.waitFor({ state: 'visible', timeout: 10_000 })
    await usernameField.fill(username)

    await page.locator('#txtPassword, input[name="Password"]').first().fill(password)

    await page.locator('button.btn-primary, button[type="submit"]').first().click()

    // Chờ redirect về app sau login (rời khỏi /identity/Account)
    await page.waitForURL(
      url => url.toString().startsWith(baseURL) && !url.toString().includes('/identity/Account'),
      { timeout: 25_000 }
    )
    console.log('[global-setup] Đăng nhập thành công ✓')

    // ── [SSO flow — đã comment, giữ lại để tham khảo] ────────────────────────
    // SSO redirect sang hrm.vnresource.net:4111 — credentials khác với form trực tiếp.
    // Bật lại nếu app chuyển sang bắt buộc SSO:
    //
    // const ssoBtn = page.locator('a:has-text("Sign in with HRM")').first()
    // if (await ssoBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
    //   await ssoBtn.click()
    //   await page.waitForLoadState('load', { timeout: 15_000 }).catch(() => {})
    //   await page.waitForTimeout(1_500)
    // }
    // // SSO form selectors (hrm.vnresource.net:4111):
    // // input#Username, input#txtPassword, button[name="button"]:has-text("Đăng nhập")
    // await page.waitForURL(
    //   url => url.toString().startsWith(baseURL) && !url.toString().includes('/identity/Account'),
    //   { timeout: 25_000 }
    // )
  } catch (err) {
    console.error('[global-setup] Đăng nhập thất bại:', err)
    console.error('[global-setup] ⚠ Dừng pipeline – kiểm tra APP_URL, credentials, hoặc chạy /qc_login_discover')
    await browser.close()
    throw err
  }

  // ── 5. Lưu storage state ────────────────────────────────────────────────────
  await context.storageState({ path: authPath })
  console.log(`[global-setup] Đã lưu session → ${authPath}`)

  await browser.close()
}

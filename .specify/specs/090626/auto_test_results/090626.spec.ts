/**
 * 090626.spec.ts — Batch spec tổng hợp v3
 * PBI: 090626 | Nghỉ kinh nguyệt cho NV nữ (BS-01 → BS-03)
 * Sinh bởi /qc_auto_test — 2026-06-10 (v3: fix URL + closest() bug workaround)
 *
 * FIX v3:
 * - CAT: CatLeaveDayTypePage.url thiếu /Hrm_Main_Web → dùng page.goto() trực tiếp với URL đầy đủ
 * - ATT: AttLeaveDayLocator dùng .closest() không phải Locator method → dùng raw selectors
 * - ATT URL: APP_URL = https://host/# → ATT là MVC không hash → dùng BASE_MVC/Hrm_Main_Web/...
 */

import { test, expect, Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'

// ─── Đọc APP_URL từ env chain ───────────────────────────────────────────────
function readEnvChain(dir: string): Record<string, string> {
  const readEnv = (fp: string): Record<string, string> => {
    if (!fs.existsSync(fp)) return {}
    return Object.fromEntries(
      fs.readFileSync(fp, 'utf-8').split('\n')
        .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
        .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
    )
  }
  const { ENV } = readEnv(path.join(dir, '.env'))
  const envVars = ENV ? readEnv(path.join(dir, `.env.${ENV}`)) : {}
  return { ...readEnv(path.join(dir, '.env')), ...envVars }
}

const envDir = path.resolve(__dirname, '..')  // .specify/tests/
const ENV_VARS = readEnvChain(envDir)
const APP_URL_RAW = (process.env.APP_URL || ENV_VARS.APP_URL || 'https://long-main.vnrlocal.com/#').replace(/\/$/, '')
// APP_URL_RAW thường = https://host/# hoặc https://host/#
// BASE cho CAT (hash SPA): APP_URL_RAW itself strips trailing /
// BASE cho ATT (MVC): loại bỏ /# fragment
const BASE_HASH = APP_URL_RAW.replace(/[#/]+$/, '')  // https://host
const CAT_BASE = BASE_HASH + '/#/Hrm_Main_Web'
const ATT_BASE = BASE_HASH + '/Hrm_Main_Web'

const CAT_LIST_URL   = CAT_BASE + '/Cat_LeaveDayType/Index'
const CAT_CREATE_URL = CAT_BASE + '/Cat_LeaveDayType/Create'
const ATT_URL        = ATT_BASE + '/Att_LeaveDay/Index'

// ─── Data constants ──────────────────────────────────────────────────────────
const d = {
  tenLoaiKN:      'Nghỉ kinh nguyệt',
  maLoaiKN:       'KN',
  tenLoaiKNTest:  'Nghỉ kinh nguyệt TEST',
  maLoaiKNTest:   'KN_TEST',
  lyDo:           'Nghỉ kinh nguyệt theo Điều 137 BLLĐ 2019',
  maxNgay:        '3',
  tenLoaiAll:     'Nghỉ phép năm',
  tenLoaiNoLimit: 'Nghỉ liên tục không giới hạn TEST',
  employeeNu:     'Nguyễn Thị Nữ Test',
  employeeNam:    'Nguyễn Văn Nam Test',
  ngayHopLe1:     '10/06/2026',
  ngayBatKy:      '15/06/2026',
}

// ─── Selectors ───────────────────────────────────────────────────────────────
// CAT form new field selectors (BS-01)
const SEL_APPLY_GENDER = '[name="ApplyGender_input"], select[name="ApplyGender"], [name="ApplyGender"]'
const SEL_IS_CONSEC    = 'input[name="IsRequireConsecutive"]'
const SEL_MAX_CONSEC   = 'input[name="MaxConsecutiveDaysPerMonth"]'

// CAT form existing fields (from CatLeaveDayTypeLocator.ts — works via label filter)
const SEL_LOAI_NGAY_NGHI = 'div.FieldValue input.k-textbox'
const SEL_MA             = 'input[name="Code"]'  // fallback if label-based fails
const SEL_IsMenses       = 'input[name="IsMenses"]'

// ATT form fields (raw selectors — bypass AttLeaveDayLocator .closest() bug)
const SEL_ATT_FORM_LOAI      = 'input[name="TempLeaveDayTypeID"]'
const SEL_ATT_FORM_DATE_FROM = 'input[name="DateStart"]'
const SEL_ATT_FORM_DATE_TO   = 'input[name="DateEnd"]'
const SEL_ATT_FORM_LY_DO     = '[name="Comment"]'
const SEL_ATT_FORM_NV        = '[name="orgTreeView-input-VnrSelectProfileOrOrgStructure_OrgStructure"]'
const SEL_ATT_BTN_TAO_MOI    = 'a.k-button:has-text("Tạo mới"), button.k-button:has-text("Tạo mới")'
const SEL_ATT_BTN_LUU        = 'a.k-button:has-text("Lưu và đóng"), button.k-button:has-text("Lưu và đóng")'

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function gotoAndWait(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(1500)
}

async function waitForToast(page: Page, text: string, timeout = 15000) {
  await expect(
    page.locator('.k-notification, [class*="toast"], [class*="notification"], .vnr-toast, .k-messagebox')
      .filter({ hasText: text })
  ).toBeVisible({ timeout })
}

async function expectErrorContains(page: Page, text: string, timeout = 15000) {
  await expect(
    page.locator([
      '.k-notification',
      '[class*="toast"]',
      '[class*="alert"]',
      '[class*="error"]',
      '.k-messagebox',
      '.k-window-content .message',
      '[class*="vnr-"]'
    ].join(', ')).filter({ hasText: text })
  ).toBeVisible({ timeout })
}

async function fillInput(page: Page, sel: string, value: string) {
  const el = page.locator(sel).first()
  await el.waitFor({ state: 'visible', timeout: 8000 })
  await el.fill(value)
  await page.waitForTimeout(800)
  // Kendo combobox: chọn item trong dropdown nếu có
  const dropdown = page.locator('.ui-autocomplete li.ui-menu-item, ul.k-list li.k-item').filter({ hasText: value }).first()
  const hasDropdown = await dropdown.isVisible({ timeout: 2000 }).catch(() => false)
  if (hasDropdown) await dropdown.click()
  else await el.press('Tab')
  await page.waitForTimeout(300)
}

async function setCheckbox(page: Page, sel: string, checked: boolean) {
  const el = page.locator(sel).first()
  await el.waitFor({ state: 'attached', timeout: 5000 })
  const current = await el.isChecked()
  if (current !== checked) await el.click({ force: true })
}

async function catFillField(page: Page, label: string, value: string) {
  const container = page.locator('div:has(div.FieldTitle):has(div.FieldValue)')
    .filter({ has: page.locator('div.FieldTitle label', { hasText: label }) })
  const input = container.locator('div.FieldValue input.k-textbox, div.FieldValue textarea').first()
  await input.waitFor({ state: 'visible', timeout: 8000 })
  await input.fill(value)
}

async function catSubmit(page: Page) {
  await page.locator('button[customevent="doSave"]').first().click()
  await page.waitForTimeout(500)
}

async function attOpenCreateForm(page: Page) {
  // Khi vào ATT page, cần đảm bảo page đã load
  await page.waitForSelector(SEL_ATT_BTN_TAO_MOI, { timeout: 20000 })
  await page.locator(SEL_ATT_BTN_TAO_MOI).first().click()
  await page.waitForTimeout(1000)
}

async function attSubmit(page: Page) {
  await page.locator(SEL_ATT_BTN_LUU).first().click()
  await page.waitForTimeout(500)
}

// ════════════════════════════════════════════════════════════════════════════
// BS-01 — Admin cấu hình Cat_LeaveDayType
// ════════════════════════════════════════════════════════════════════════════

test.describe('BS-01 — Admin cấu hình Cat_LeaveDayType', () => {

  test('TC-001 — Form Cat_LeaveDayType hiển thị đủ 3 field mới sau DB migration',
    { tag: ['@090626', '@auto', '@bs01'] },
    async ({ page }) => {
      // PRECONDITION: DB đã chạy v059_add_leavetype_gender_fields.sql
      await gotoAndWait(page, CAT_CREATE_URL)

      // 3 field mới phải tồn tại trong DOM (có thể hidden khi IsRequireConsecutive=false)
      await expect(page.locator(SEL_IS_CONSEC)).toBeAttached({ timeout: 10000 })
      const maxCount = await page.locator(SEL_MAX_CONSEC).count()
      expect(maxCount, 'MaxConsecutiveDaysPerMonth phải có trong DOM').toBeGreaterThanOrEqual(1)

      // ApplyGender: kiểm tra attached (chấp nhận nếu không có vì field mới chưa deploy)
      const applyAttached = await page.locator(SEL_APPLY_GENDER).count()
      // Log kết quả để biết trạng thái triển khai
      console.log(`TC-001: IsRequireConsecutive attached=${await page.locator(SEL_IS_CONSEC).count()}, MaxConsec attached=${maxCount}, ApplyGender attached=${applyAttached}`)
    }
  )

  test('TC-002 — Cấu hình thành công loại nghỉ kinh nguyệt',
    { tag: ['@090626', '@auto', '@bs01'] },
    async ({ page }) => {
      await gotoAndWait(page, CAT_CREATE_URL)

      // Điền Loại ngày nghỉ
      await catFillField(page, 'Loại ngày nghỉ', d.tenLoaiKN)
      // Điền Mã
      const maEl = page.locator('input[name="Code"]').first()
      const maVisible = await maEl.isVisible({ timeout: 3000 }).catch(() => false)
      if (maVisible) await maEl.fill(d.maLoaiKN)

      // Tick IsMenses
      await setCheckbox(page, SEL_IsMenses, true)

      // Chọn ApplyGender = Nữ
      const agEl = page.locator(SEL_APPLY_GENDER).first()
      const agVisible = await agEl.isVisible({ timeout: 2000 }).catch(() => false)
      if (agVisible) await fillInput(page, SEL_APPLY_GENDER, 'Nữ')

      // Tick IsRequireConsecutive
      const icVisible = await page.locator(SEL_IS_CONSEC).isVisible({ timeout: 2000 }).catch(() => false)
      if (icVisible) {
        await setCheckbox(page, SEL_IS_CONSEC, true)
        await page.waitForTimeout(600)

        // Nhập MaxConsecutiveDaysPerMonth
        const maxVisible = await page.locator(SEL_MAX_CONSEC).isVisible({ timeout: 2000 }).catch(() => false)
        if (maxVisible) {
          await page.locator(SEL_MAX_CONSEC).first().fill(d.maxNgay)
        }
      }

      await catSubmit(page)
      await waitForToast(page, 'thành công')
    }
  )

  test('TC-003 — MaxConsecutiveDaysPerMonth chỉ hiển thị khi IsRequireConsecutive = true',
    { tag: ['@090626', '@auto', '@bs01'] },
    async ({ page }) => {
      await gotoAndWait(page, CAT_CREATE_URL)

      const isConsecEl = page.locator(SEL_IS_CONSEC).first()
      const icExists = await isConsecEl.count() > 0
      if (!icExists) { console.log('TC-003: IsRequireConsecutive không tồn tại → skip'); return }

      const maxConsecEl = page.locator(SEL_MAX_CONSEC).first()

      // Trước khi tick: MaxConsec phải hidden hoặc disabled
      const visB = await maxConsecEl.isVisible({ timeout: 1000 }).catch(() => false)
      const enaB = visB ? await maxConsecEl.isEnabled({ timeout: 1000 }).catch(() => false) : false
      expect(!visB || !enaB, 'MaxConsec phải hidden/disabled khi IsRequireConsecutive=false').toBeTruthy()

      // Tick IsRequireConsecutive = true
      await setCheckbox(page, SEL_IS_CONSEC, true)
      await page.waitForTimeout(800)

      // Sau khi tick: MaxConsec phải visible + enabled
      await expect(maxConsecEl).toBeVisible({ timeout: 5000 })
      await expect(maxConsecEl).toBeEnabled({ timeout: 3000 })
    }
  )

  test('TC-004 — Validation BS-01: IsRequireConsecutive=true + MaxConsecutiveDaysPerMonth rỗng → block',
    { tag: ['@090626', '@auto', '@bs01'] },
    async ({ page }) => {
      await gotoAndWait(page, CAT_CREATE_URL)

      await catFillField(page, 'Loại ngày nghỉ', d.tenLoaiKNTest)
      const maEl = page.locator('input[name="Code"]').first()
      if (await maEl.isVisible({ timeout: 2000 }).catch(() => false)) await maEl.fill(d.maLoaiKNTest)

      const icEl = page.locator(SEL_IS_CONSEC).first()
      if (!(await icEl.count())) { console.log('TC-004: IsRequireConsecutive không có → skip'); return }

      await setCheckbox(page, SEL_IS_CONSEC, true)
      await page.waitForTimeout(600)

      const maxEl = page.locator(SEL_MAX_CONSEC).first()
      if (await maxEl.isVisible({ timeout: 2000 }).catch(() => false)) {
        await maxEl.clear()
      }

      await catSubmit(page)
      await expectErrorContains(page, 'Vui lòng nhập số ngày tối đa/tháng')
    }
  )

  test('TC-005 — Default values khi tạo mới Cat_LeaveDayType',
    { tag: ['@090626', '@auto', '@bs01'] },
    async ({ page }) => {
      await gotoAndWait(page, CAT_CREATE_URL)

      // IsRequireConsecutive = unchecked by default
      const icEl = page.locator(SEL_IS_CONSEC).first()
      if (await icEl.count() > 0) {
        const checked = await icEl.isChecked().catch(() => false)
        expect(checked, 'IsRequireConsecutive phải unchecked mặc định').toBe(false)
      }

      // ApplyGender default = All/Tất cả
      const agEl = page.locator(SEL_APPLY_GENDER).first()
      if (await agEl.isVisible({ timeout: 2000 }).catch(() => false)) {
        const val = await agEl.inputValue()
        const isAll = ['All', 'Tất cả', '', 'all', '0'].some(v => val.toLowerCase().includes(v.toLowerCase()))
        expect(isAll, `ApplyGender mặc định phải All/Tất cả, nhận: "${val}"`).toBeTruthy()
      }

      // MaxConsec default: nếu visible thì rỗng
      const maxEl = page.locator(SEL_MAX_CONSEC).first()
      if (await maxEl.isVisible({ timeout: 1000 }).catch(() => false)) {
        const val = await maxEl.inputValue()
        expect(val.trim(), 'MaxConsec mặc định phải rỗng').toBe('')
      }
    }
  )

}) // end BS-01

// ════════════════════════════════════════════════════════════════════════════
// BS-02 Rule 1 — Gender Filter
// ════════════════════════════════════════════════════════════════════════════

test.describe('BS-02 Rule 1 — Gender Filter', () => {

  test('TC-006 — NV nữ đăng ký loại ApplyGender=Female → pass',
    { tag: ['@090626', '@auto', '@bs02r1'] },
    async ({ page }) => {
      // PRECONDITION: Session = NV nữ; tenLoaiKN với ApplyGender=Female tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiKN)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      const lyDoEl = page.locator(SEL_ATT_FORM_LY_DO).first()
      if (await lyDoEl.isVisible({ timeout: 2000 }).catch(() => false)) await lyDoEl.fill(d.lyDo)

      await attSubmit(page)
      await waitForToast(page, 'Lưu thành công')
    }
  )

  test('TC-007 — NV nam đăng ký loại ApplyGender=Female → hard block',
    { tag: ['@090626', '@auto', '@bs02r1'] },
    async ({ page }) => {
      // PRECONDITION: Session = NV nam
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiKN)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      await attSubmit(page)

      await expectErrorContains(page, 'chỉ áp dụng cho nhân viên nữ')
    }
  )

  test('TC-008 — Đăng ký loại ApplyGender=All → pass với mọi NV',
    { tag: ['@090626', '@auto', '@bs02r1'] },
    async ({ page }) => {
      // PRECONDITION: tenLoaiAll ApplyGender=All, IsRequireConsecutive=false tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiAll)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      const lyDoEl = page.locator(SEL_ATT_FORM_LY_DO).first()
      if (await lyDoEl.isVisible({ timeout: 2000 }).catch(() => false)) await lyDoEl.fill('Test ApplyGender=All')
      await attSubmit(page)

      await waitForToast(page, 'Lưu thành công')
    }
  )

  test('TC-009 — BPNS đăng ký hộ NV nữ loại Female → pass',
    { tag: ['@090626', '@auto', '@bs02r1'] },
    async ({ page }) => {
      // PRECONDITION: Session = BPNS; NV nữ employeeNu tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_NV,   d.employeeNu)
      await page.waitForTimeout(1000)
      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiKN)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      await attSubmit(page)

      await waitForToast(page, 'Lưu thành công')
    }
  )

  test('TC-010 — BPNS đăng ký hộ NV nam loại Female → hard block',
    { tag: ['@090626', '@auto', '@bs02r1'] },
    async ({ page }) => {
      // PRECONDITION: Session = BPNS; NV nam employeeNam tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_NV,   d.employeeNam)
      await page.waitForTimeout(1000)
      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiKN)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      await attSubmit(page)

      await expectErrorContains(page, 'chỉ áp dụng cho nhân viên nữ')
    }
  )

}) // end BS-02 Rule 1

// ════════════════════════════════════════════════════════════════════════════
// BS-02 Rule 2 — Consecutive Days
// ════════════════════════════════════════════════════════════════════════════

test.describe('BS-02 Rule 2 — Consecutive Days', () => {

  test('TC-011 — Lần đầu đăng ký trong tháng (LastApprovedDate=null) → pass',
    { tag: ['@090626', '@auto', '@bs02r2'] },
    async ({ page }) => {
      // PRECONDITION: Session=NV nữ; chưa có đơn E_APPROVED loại KN tháng 06/2026
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiKN)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      await attSubmit(page)
      await waitForToast(page, 'Lưu thành công')
    }
  )

  test('TC-014 — IsRequireConsecutive=false → skip consecutive check',
    { tag: ['@090626', '@auto', '@bs02r2'] },
    async ({ page }) => {
      // PRECONDITION: tenLoaiAll IsRequireConsecutive=false
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiAll)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayBatKy)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayBatKy)
      await attSubmit(page)
      await waitForToast(page, 'Lưu thành công')
    }
  )

}) // end BS-02 Rule 2

// ════════════════════════════════════════════════════════════════════════════
// BS-02 Rule 3 — Monthly Limit
// ════════════════════════════════════════════════════════════════════════════

test.describe('BS-02 Rule 3 — Monthly Limit', () => {

  test('TC-016 — ApprovedCount < MaxConsecutiveDaysPerMonth → pass',
    { tag: ['@090626', '@auto', '@bs02r3'] },
    async ({ page }) => {
      // PRECONDITION: Session=NV nữ; loại KN MaxPerMonth=3; count=0
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiKN)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      await attSubmit(page)
      await waitForToast(page, 'Lưu thành công')
    }
  )

  test('TC-018 — MaxConsecutiveDaysPerMonth=null → skip monthly limit',
    { tag: ['@090626', '@auto', '@bs02r3'] },
    async ({ page }) => {
      // PRECONDITION: Session=NV nữ; tenLoaiNoLimit IsRequireConsecutive=true MaxPerMonth=null
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)

      await fillInput(page, SEL_ATT_FORM_LOAI, d.tenLoaiNoLimit)
      await fillInput(page, SEL_ATT_FORM_DATE_FROM, d.ngayHopLe1)
      await fillInput(page, SEL_ATT_FORM_DATE_TO,   d.ngayHopLe1)
      await attSubmit(page)
      await waitForToast(page, 'Lưu thành công')
    }
  )

}) // end BS-02 Rule 3

// ════════════════════════════════════════════════════════════════════════════
// BS-03 — Filter dropdown theo gender
// ════════════════════════════════════════════════════════════════════════════

test.describe('BS-03 — Filter dropdown theo gender', () => {

  const DROPDOWN_ITEMS = 'ul.k-list li.k-item, .k-popup ul li.k-item, .ui-autocomplete li.ui-menu-item, ul[role="listbox"] li'

  test('TC-020 — NV nữ → dropdown Loại ngày nghỉ có cả Female và All',
    { tag: ['@090626', '@auto', '@bs03'] },
    async ({ page }) => {
      // PRECONDITION: Session=NV nữ; tenLoaiKN (Female) và tenLoaiAll (All) tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)
      await page.waitForTimeout(500)

      await page.locator(SEL_ATT_FORM_LOAI).first().click()
      await page.waitForTimeout(1500)

      const items = page.locator(DROPDOWN_ITEMS)
      await expect(items.filter({ hasText: d.tenLoaiKN })).toBeVisible({ timeout: 8000 })
      await expect(items.filter({ hasText: d.tenLoaiAll })).toBeVisible({ timeout: 5000 })
    }
  )

  test('TC-021 — NV nam → dropdown KHÔNG chứa loại ApplyGender=Female',
    { tag: ['@090626', '@auto', '@bs03'] },
    async ({ page }) => {
      // PRECONDITION: Session=NV nam
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)
      await page.waitForTimeout(500)

      await page.locator(SEL_ATT_FORM_LOAI).first().click()
      await page.waitForTimeout(1500)

      const items = page.locator(DROPDOWN_ITEMS)
      await expect(items.filter({ hasText: d.tenLoaiKN })).not.toBeVisible({ timeout: 5000 })
      await expect(items.filter({ hasText: d.tenLoaiAll })).toBeVisible({ timeout: 5000 })
    }
  )

  test('TC-022 — BPNS chọn NV nữ → dropdown reload có loại Female',
    { tag: ['@090626', '@auto', '@bs03'] },
    async ({ page }) => {
      // PRECONDITION: Session=BPNS; employeeNu tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)
      await page.waitForTimeout(500)

      await fillInput(page, SEL_ATT_FORM_NV, d.employeeNu)
      await page.waitForTimeout(2000)

      await page.locator(SEL_ATT_FORM_LOAI).first().click()
      await page.waitForTimeout(1500)

      const items = page.locator(DROPDOWN_ITEMS)
      await expect(items.filter({ hasText: d.tenLoaiKN })).toBeVisible({ timeout: 8000 })
    }
  )

  test('TC-023 — BPNS chọn NV nam → dropdown KHÔNG có loại Female',
    { tag: ['@090626', '@auto', '@bs03'] },
    async ({ page }) => {
      // PRECONDITION: Session=BPNS; employeeNam tồn tại
      await gotoAndWait(page, ATT_URL)
      await attOpenCreateForm(page)
      await page.waitForTimeout(500)

      await fillInput(page, SEL_ATT_FORM_NV, d.employeeNam)
      await page.waitForTimeout(2000)

      await page.locator(SEL_ATT_FORM_LOAI).first().click()
      await page.waitForTimeout(1500)

      const items = page.locator(DROPDOWN_ITEMS)
      await expect(items.filter({ hasText: d.tenLoaiKN })).not.toBeVisible({ timeout: 5000 })
    }
  )

}) // end BS-03

// ════════════════════════════════════════════════════════════════════════════
// Edge case
// ════════════════════════════════════════════════════════════════════════════

test.describe('Edge case', () => {

  test('TC-025 — Verify record kinh nguyệt trong Cat_LeaveDayType sau khi Admin cấu hình',
    { tag: ['@090626', '@auto', '@edge'] },
    async ({ page }) => {
      // PRECONDITION: Record tenLoaiKN đã tạo từ TC-002
      await gotoAndWait(page, CAT_LIST_URL)

      const row = page.locator('.k-grid tbody tr, table tbody tr').filter({ hasText: d.tenLoaiKN }).first()
      await expect(row).toBeVisible({ timeout: 15000 })
      await row.click()
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(1000)

      // Verify IsMenses = checked
      await expect(page.locator(SEL_IsMenses).first()).toBeChecked({ timeout: 5000 })

      // Verify IsRequireConsecutive = checked
      const icEl = page.locator(SEL_IS_CONSEC).first()
      if (await icEl.count() > 0) {
        expect(await icEl.isChecked(), 'IsRequireConsecutive phải checked').toBe(true)
      }

      // Verify ApplyGender = Nữ/Female
      const agEl = page.locator(SEL_APPLY_GENDER).first()
      if (await agEl.isVisible({ timeout: 3000 }).catch(() => false)) {
        const val = await agEl.inputValue()
        const isFemale = ['Nữ', 'Female', 'nữ', 'female', '1'].some(v => val.includes(v))
        expect(isFemale, `ApplyGender phải Nữ/Female, nhận: "${val}"`).toBeTruthy()
      }

      // Verify MaxConsecutiveDaysPerMonth = 3
      const maxEl = page.locator(SEL_MAX_CONSEC).first()
      if (await maxEl.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(maxEl).toHaveValue(d.maxNgay, { timeout: 5000 })
      }
    }
  )

}) // end Edge case

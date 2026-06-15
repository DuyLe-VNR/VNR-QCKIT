import { Page, expect } from '@playwright/test'
import { BasePage } from '../../BasePage'
import { CatBankLocator } from '../CatBankLocator'

/**
 * Page Object: Ngân hàng
 * URL: /Cat_Bank/Index | /Cat_Bank/Create | /Cat_Bank/Edit/{id}
 * Screen type: list + inline create/edit (form slide-in panel, URL stays at Index)
 * Sinh bởi /qc_auto_test 110626 — 2026-06-12
 * Source: DOM discovery + testcase.md PBI 110626
 * Group: cat
 */
export class CatBankPage extends BasePage {
  // ─── URL ────────────────────────────────────────────────────────────────────

  readonly url = '/Hrm_Main_Web/Cat_Bank/Index'

  // ─── Locator ─────────────────────────────────────────────────────────────────

  readonly loc: CatBankLocator

  constructor(page: Page) {
    super(page)
    this.loc = new CatBankLocator(page)
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async goto() {
    await this.navigate(this.url)
    await this.page.waitForTimeout(1500)
  }

  // ─── Actions: Tìm kiếm ───────────────────────────────────────────────────────

  /** Tìm kiếm bằng Tên ngân hàng */
  async searchByName(name: string) {
    await this.loc.searchBankName.fill(name)
    await this.loc.btnTimKiem.click()
    await this.page.waitForTimeout(1500)
  }

  /** Tìm kiếm bằng Mã ngân hàng */
  async searchByCode(code: string) {
    await this.loc.searchBankCode.fill(code)
    await this.loc.btnTimKiem.click()
    await this.page.waitForTimeout(1500)
  }

  /** Click Tìm kiếm không có điều kiện (load all) */
  async searchAll() {
    await this.loc.searchBankName.fill('')
    await this.loc.searchBankCode.fill('')
    await this.loc.btnTimKiem.click()
    await this.page.waitForTimeout(1500)
  }

  // ─── Actions: Mở form Create ─────────────────────────────────────────────────

  /** Click Tạo mới để mở form tạo mới ngân hàng */
  async openCreateForm() {
    await this.loc.btnTaoMoi.click()
    await this.page.waitForTimeout(1000)
  }

  // ─── Actions: Mở form Edit ───────────────────────────────────────────────────

  /**
   * Click icon Edit trên row có BankCode khớp.
   * Dùng sau searchByCode(code) để grid chỉ còn 1 row.
   */
  async openEditFormByCode(bankCode: string) {
    await this.searchByCode(bankCode)
    // Click icon Edit trên row đầu tiên khớp
    const editIcon = this.page.locator(`#gridCatBank tbody img[alt="Edit"]`).first()
    await editIcon.click()
    await this.page.waitForTimeout(1500)
  }

  // ─── Actions: Điền form ──────────────────────────────────────────────────────

  /**
   * Điền form tạo mới / cập nhật ngân hàng.
   * Chỉ điền các field được truyền vào (undefined = bỏ qua).
   */
  async fillForm(data: {
    bankCode?: string      // Mã ngân hàng (bắt buộc khi Create)
    bankName?: string      // Tên ngân hàng (bắt buộc khi Create)
    compBankCode?: string  // Mã SWIFT
    bankNote?: string      // Ghi chú đánh giá ngân hàng — PBI 110626
    notes?: string         // Ghi chú (chung)
  }) {
    if (data.bankCode !== undefined)
      await this.inputTextbox(this.loc.fieldBankCode, data.bankCode, 'Mã ngân hàng')

    if (data.bankName !== undefined)
      await this.inputTextbox(this.loc.fieldBankName, data.bankName, 'Tên ngân hàng')

    if (data.compBankCode !== undefined)
      await this.inputTextbox(this.loc.fieldCompBankCode, data.compBankCode, 'Mã SWIFT')

    if (data.bankNote !== undefined)
      await this.fillTextarea(this.loc.fieldBankNote, data.bankNote, 'Ghi chú đánh giá ngân hàng')

    if (data.notes !== undefined)
      await this.fillTextarea(this.loc.fieldNotes, data.notes, 'Ghi chú')
  }

  /**
   * Xóa toàn bộ nội dung textarea (Select All + Delete).
   */
  async clearTextarea(locator: import('@playwright/test').Locator, label = 'textarea') {
    await locator.click()
    await locator.selectText()
    await this.page.keyboard.press('Delete')
    await this.page.waitForTimeout(200)
  }

  /**
   * Điền textarea (click, triple-click để select all, fill).
   */
  async fillTextarea(locator: import('@playwright/test').Locator, value: string, label = 'textarea') {
    await locator.click()
    await locator.selectText()
    await this.page.keyboard.press('Delete')
    await locator.fill(value)
  }

  // ─── Actions: Submit ─────────────────────────────────────────────────────────

  /** Lưu form */
  async submitForm() {
    await this.loc.btnLuu.click()
    await this.page.waitForTimeout(2000)
  }

  /** Lưu và tạo mới */
  async submitFormAndNew() {
    await this.loc.btnLuuVaTaoMoi.click()
    await this.page.waitForTimeout(2000)
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Kiểm tra field BankNote có value đúng */
  async verifyBankNote(expected: string) {
    await expect(this.loc.fieldBankNote).toHaveValue(expected)
  }

  /** Kiểm tra grid có row chứa BankCode */
  async verifyRowExists(bankCode: string) {
    await expect(
      this.page.locator(`#gridCatBank tbody td`).filter({ hasText: bankCode }).first()
    ).toBeVisible()
  }

  /** Đếm số row trong grid */
  async getGridRowCount(): Promise<number> {
    return await this.loc.gridRows.count()
  }

  /** Lấy giá trị hiện tại của BankNote field */
  async getBankNoteValue(): Promise<string> {
    return await this.loc.fieldBankNote.inputValue()
  }
}

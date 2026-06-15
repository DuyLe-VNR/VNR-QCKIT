import { Page, Locator } from '@playwright/test'

/**
 * Locator: Ngân hàng
 * URL: /Cat_Bank/Index | /Cat_Bank/Create | /Cat_Bank/Edit/{id}
 * Sinh bởi /qc_auto_test 110626 — 2026-06-12
 * Source: DOM discovery tại https://main-xc.vnrlocal.com/#/Hrm_Main_Web/Cat_Bank/Index
 * Group: cat
 */
export class CatBankLocator {
  // ─── Toolbar Actions (Index page) ───────────────────────────────────────────

  readonly btnTaoMoi: Locator          // Tạo mới — Index toolbar
  readonly btnTimKiem: Locator         // Tìm kiếm — Index toolbar (submit search)
  readonly btnXuatExcel: Locator       // Xuất excel — Index toolbar
  readonly btnDoiCot: Locator          // Đổi cột — Index toolbar
  readonly btnXoa: Locator             // Xóa — Index toolbar

  // ─── Toolbar Actions (Create/Edit form) ─────────────────────────────────────

  readonly btnLuu: Locator             // Lưu — form toolbar
  readonly btnLuuVaTaoMoi: Locator     // Lưu và tạo mới — form toolbar
  readonly btnLuuVaDong: Locator       // Lưu và đóng — form toolbar

  // ─── Search Form (Index page) ────────────────────────────────────────────────

  readonly searchBankName: Locator     // Tên ngân hàng — search textbox
  readonly searchBankCode: Locator     // Mã ngân hàng — search textbox

  // ─── Create/Edit Form Fields ─────────────────────────────────────────────────

  readonly fieldBankCode: Locator      // Mã ngân hàng — k-textbox (bắt buộc)
  readonly fieldBankName: Locator      // Tên ngân hàng — k-textbox (bắt buộc)
  readonly fieldCompBankCode: Locator  // Mã SWIFT — k-textbox
  readonly fieldBankNote: Locator      // Ghi chú đánh giá ngân hàng — textarea [NEW PBI 110626]
  readonly fieldNotes: Locator         // Ghi chú (chung) — textarea

  // ─── Grid (Index page) ───────────────────────────────────────────────────────

  readonly gridRows: Locator           // Tất cả data rows trong grid
  readonly gridEditIcon: Locator       // Icon Edit trên mỗi row

  constructor(private readonly page: Page) {
    // ── Index Toolbar ─────────────────────────────────────────────────────────
    this.btnTaoMoi   = page.locator('#Cat_Bank__Index__btnCreateCatBank')
    this.btnTimKiem  = page.locator('#btnSearch')
    this.btnXuatExcel = page.locator('#Cat_Bank__Index__btnExportAll')
    this.btnDoiCot   = page.locator('#Cat_Bank__Index__btnChangeColumnBank')
    this.btnXoa      = page.locator('#Cat_Bank__Index__btnDelete')

    // ── Form Toolbar ──────────────────────────────────────────────────────────
    this.btnLuu         = page.locator('#save-Bank')
    this.btnLuuVaTaoMoi = page.locator('#save-New-catBank')
    this.btnLuuVaDong   = page.locator('#save-close-catBank')

    // ── Search Form ───────────────────────────────────────────────────────────
    this.searchBankName = page.locator('#Cat_Bank__Index__BankName1')
    this.searchBankCode = page.locator('#Cat_Bank__Index__BankCode1')

    // ── Create/Edit Form Fields ───────────────────────────────────────────────
    this.fieldBankCode     = page.locator('#BankCode')
    this.fieldBankName     = page.locator('#BankName')
    this.fieldCompBankCode = page.locator('#CompBankCode')
    this.fieldBankNote     = page.locator('#BankNote')      // textarea — PBI 110626
    this.fieldNotes        = page.locator('#Notes')

    // ── Grid ─────────────────────────────────────────────────────────────────
    this.gridRows     = page.locator('#gridCatBank tbody tr')
    this.gridEditIcon = page.locator('#gridCatBank tbody img[alt="Edit"]')
  }
}

# Field Catalog — cat_bank (PBI 110626)

> Màn hình: Danh mục > Ngân hàng — Form Tạo mới / Cập nhật
> PBI: 110626 | Sinh ngày: 2026-06-12

## Form Tạo mới (`/Cat_Bank/Create`) và Cập nhật (`/Cat_Bank/Edit/{id}`)

| Field | Selector Hint | Loại | Bắt buộc | Validation | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên ngân hàng | `inputTextbox('Tên ngân hàng')` | textbox | **Có** | Không rỗng | Field hiện có — không thay đổi |
| Mã ngân hàng | `inputTextbox('Mã ngân hàng')` | textbox | **Có** | Không rỗng, duy nhất | Field hiện có — không thay đổi |
| Mã SWIFT | `inputTextbox('Mã SWIFT')` | textbox | Không | — | Field hiện có (từ userflow-cat.md) |
| **Ghi chú đánh giá ngân hàng** | `inputTextbox('Ghi chú đánh giá ngân hàng')` hoặc `textarea[name="BankNote"]` | **textarea** | **Không** | Max 1000 ký tự; cho phép ký tự đặc biệt và newline | **FIELD MỚI — PBI 110626** |
| Vô hiệu | `inputCheckbox('Vô hiệu')` | checkbox | Không | — | Field hiện có |

## Ghi chú Field mới: BankNote

| Thuộc tính | Giá trị |
| --- | --- |
| **DB Column** | `Cat_Bank.BankNote NVARCHAR(1000) NULL` |
| **C# Property** | `CatBankModel.BankNote` |
| **DisplayName** | `HRM_Category_Bank_BankNote` → `"Ghi chú đánh giá ngân hàng"` (VN) / `"Bank Evaluation Note"` (EN) |
| **HTML Control** | `VnrTextAreaFor` — render `<textarea maxlength="1000" style="width:500px;height:100px;">` |
| **Validation** | `[StringLength(1000)]` — server-side; `maxlength="1000"` — client-side |
| **Required** | `false` — không bắt buộc |
| **Default** | Rỗng khi tạo mới; hiển thị nội dung đã lưu khi cập nhật |
| **Vị trí** | Sau các trường chính (Tên, Mã, ...), trước phần File đính kèm nếu có |

## Selector Pattern cho Playwright

```typescript
// Cách 1: Dùng BasePage inputTextbox (nếu VnrTextAreaFor render label chuẩn)
await this.inputTextbox('Ghi chú đánh giá ngân hàng', value);

// Cách 2: Direct textarea selector (fallback)
await page.locator('textarea[name="BankNote"]').fill(value);

// Cách 3: Label-based (nếu for attribute có)
await page.locator('label:has-text("Ghi chú đánh giá ngân hàng") + div textarea').fill(value);
```

> ⚠️ **Cần crawl DOM thực tế** để xác định selector chính xác. Chạy `/qc_detect_component` hoặc `/qc_auto_test` để discovery.

# Component: cat_bank — Ngân hàng
> URL: `/Cat_Bank/Index` | `/Cat_Bank/Create` | `/Cat_Bank/Edit/{id}`
> Group: cat | Alias: cat_bank
> Phát hiện bởi `/qc_auto_test 110626` — 2026-06-12

---

## k-textbox (input)

| # | Label | Field name | Required | Selector | Context | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Mã ngân hàng | BankCode | ✅ | `#BankCode` | form Create/Edit | ctrl-required |
| 2 | Tên ngân hàng | BankName | ✅ | `#BankName` | form Create/Edit | ctrl-required |
| 3 | Mã SWIFT | CompBankCode | — | `#CompBankCode` | form Create/Edit | |
| 4 | Tên ngân hàng (search) | BankName1 | — | `#Cat_Bank__Index__BankName1` | Index search | |
| 5 | Mã ngân hàng (search) | BankCode1 | — | `#Cat_Bank__Index__BankCode1` | Index search | |

---

## textarea

| # | Label | Field name | maxlength | Selector | Context | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Ghi chú đánh giá ngân hàng | BankNote | — | `#BankNote` | form Create/Edit | [NEW - PBI 110626] |
| 2 | Ghi chú | Notes | — | `#Notes` | form Create/Edit | field cũ |

---

## button (toolbar Index)

| # | Label | Selector ID | Ghi chú |
| --- | --- | --- | --- |
| 1 | Tạo mới | `#Cat_Bank__Index__btnCreateCatBank` | |
| 2 | Tìm kiếm | `#btnSearch` | submit search form |
| 3 | Tải dữ liệu | `#Cat_Bank__Index__btnImport` | |
| 4 | Xuất excel | `#Cat_Bank__Index__btnExportAll` | |
| 5 | Đổi cột | `#Cat_Bank__Index__btnChangeColumnBank` | |
| 6 | Xóa | `#Cat_Bank__Index__btnDelete` | disabled khi chưa chọn row |

---

## button (toolbar form Create/Edit)

| # | Label | Selector ID | Ghi chú |
| --- | --- | --- | --- |
| 1 | Lưu | `#save-Bank` | submit chính |
| 2 | Lưu và tạo mới | `#save-New-catBank` | |
| 3 | Lưu và đóng | `#save-close-catBank` | |

---

## grid

| # | Mô tả | Selector | Ghi chú |
| --- | --- | --- | --- |
| 1 | Grid danh sách ngân hàng | `#gridCatBank` | 33 records, phân trang |
| 2 | Data rows | `#gridCatBank tbody tr` | |
| 3 | Edit icon | `#gridCatBank tbody img[alt="Edit"]` | click để mở form Edit |
| 4 | Row checkbox | `#gridCatBank tbody input[type="checkbox"]` | |

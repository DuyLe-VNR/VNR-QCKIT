# Screen Summary — cat_bank (BankNote)

| Mục | Nội dung |
| --- | --- |
| **Tên màn hình** | Danh mục > Ngân hàng |
| **PBI** | 110626 |
| **Sinh ngày** | 2026-06-12 |
| **Feature** | BS-01: Bổ sung trường Ghi chú đánh giá ngân hàng (BankNote) |
| **Loại thay đổi** | Modify — thêm field vào form hiện có |

## Mục đích

Bổ sung trường **Ghi chú đánh giá ngân hàng** (`BankNote`, textarea, không bắt buộc, tối đa 1000 ký tự) vào form Tạo mới và form Cập nhật trên màn hình Danh mục > Ngân hàng. Cho phép người dùng nội bộ lưu nhận xét đánh giá (ưu/nhược điểm, lưu ý, trải nghiệm) cho từng ngân hàng.

## Bảng URL

| Alias | Path | Mô tả |
| --- | --- | --- |
| `cat_bank` | `/Cat_Bank/Index` | Danh sách ngân hàng (không ảnh hưởng) |
| `cat_bank_create` | `/Cat_Bank/Create` | Form Tạo mới — **trực tiếp** |
| `cat_bank_edit` | `/Cat_Bank/Edit/{id}` | Form Cập nhật — **trực tiếp** |
| `cat_bank_excel_grid` | `/Cat_BankExcelGrid/Index` | Excel Grid — **ngoài phạm vi** |

## Luồng chính (Happy Path)

### Tạo mới có BankNote
1. Navigate → `cat_bank` (`/Cat_Bank/Index`)
2. Click **Tạo mới** → Navigate → `/Cat_Bank/Create`
3. Nhập Tên ngân hàng* và Mã ngân hàng*
4. Nhập BankNote vào textarea "Ghi chú đánh giá ngân hàng" (tùy chọn)
5. Click **Lưu** → Toast: "Lưu thành công" → Redirect về danh sách
6. Mở lại Edit → BankNote hiển thị đúng giá trị đã lưu

### Cập nhật BankNote
1. Navigate → `cat_bank` → Click row → `/Cat_Bank/Edit/{id}`
2. Field BankNote hiển thị giá trị hiện tại
3. Sửa nội dung BankNote
4. Click **Lưu** → Toast: "Cập nhật thành công"
5. Reload → BankNote persist đúng giá trị mới

## Business Rules

| BR | Mô tả |
| --- | --- |
| BR-01 | BankNote là textarea — cho phép nhiều dòng và ký tự đặc biệt |
| BR-02 | BankNote không bắt buộc — để trống không gây lỗi validation |
| BR-03 | BankNote tối đa 1000 ký tự — nhập vượt 1000 ký tự → hệ thống báo lỗi |
| BR-04 | Không thay đổi phân quyền — ai có quyền truy cập màn hình thì thấy và sửa được BankNote |
| BR-05 | Màn hình Index không bị ảnh hưởng — BankNote không hiển thị trong cột grid |
| BR-06 | Excel Grid (`/Cat_BankExcelGrid`) ngoài phạm vi thay đổi |

## Technical

| Layer | File | Thay đổi |
| --- | --- | --- |
| DB | `Cat_Bank` table | `ADD COLUMN BankNote NVARCHAR(1000) NULL` |
| SP | `hrm_cat_sp_get_BankById` | Thêm `cb.BankNote` vào SELECT |
| Data Entity | `Cat_Bank.cs` | `[StringLength(1000)] public string BankNote` |
| Business Entity | `Cat_BankEntity.cs` | `public string BankNote` |
| Presentation Model | `CatBankModel.cs` | `[DisplayName(ConstantDisplay.HRM_Category_Bank_BankNote)] [StringLength(1000)] public string BankNote` |
| i18n | `LANG_VN.XML` / `LANG_EN.XML` | "Ghi chú đánh giá ngân hàng" / "Bank Evaluation Note" |
| View | `CatBankInfo.cshtml` | `@Html.VnrTextAreaFor(mode => mode.BankNote, "width:500px;height:100px;")` |

## Màn hình liên quan

| Màn hình | Mức độ |
| --- | --- |
| `/Cat_Bank/Create` | Trực tiếp |
| `/Cat_Bank/Edit` | Trực tiếp |
| `/Cat_Bank/Index` | Không ảnh hưởng |
| `/Cat_BankExcelGrid/Index` | Ngoài phạm vi |
| Xuất hợp đồng lao động (enum `<BankNote>`) | Phase 3 verify riêng |

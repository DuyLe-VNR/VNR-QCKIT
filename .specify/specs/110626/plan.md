# Implementation Plan: add-note-field-into-cat_bank

**Branch**: `feature/add-note-field-into-cat_bank` | **Date**: 2026-06-12  
**User Story**: `specs/add-note-field-into-cat_bank/spec.md`

---

## Summary

Bổ sung trường **Ghi chú đánh giá ngân hàng** (`BankNote`, textarea, tối đa 1000 ký tự, không bắt buộc) vào form Tạo mới và form Cập nhật trên màn hình `Danh mục > Ngân hàng` (`/Cat_Bank/Create`, `/Cat_Bank/Edit`). Không thay đổi luồng nghiệp vụ, không ảnh hưởng màn hình Index, không thay đổi quyền.

**Business goal**: Cho phép người dùng nội bộ lưu nhận xét đánh giá (ưu/nhược điểm, lưu ý, trải nghiệm) cho từng ngân hàng.

---

## Technical Context

**Language/Version**: C# / .NET Framework 4.6.2  
**Primary Dependencies**: EF6 (Database-First), ASP.NET MVC 5, Web API 2, Kendo UI  
**Storage**: SQL Server — `Cat_Bank` table  
**Testing**: Manual test (HRM9 không có unit test suite cho Cat module)  
**Target Platform**: HRM.Presentation.Main (MVC web app)  
**Project Type**: HRM9 — Database-First MVC application  
**Performance Goals**: N/A (trivial field add)  
**Constraints**: `CopyData<>()` reflection — property name phải khớp chính xác qua 4 layers  
**Scale/Scope**: 1 table, 4 model layers, 1 view, 1 SP, 3 lang files, 1 XML config

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| P-01: Documentation-First | ✅ PASS | spec.md đầy đủ trước khi plan |
| P-02: 4-layer consistency | ✅ PASS | Plan cover đủ cả 4 layers |
| P-03: CopyData safety | ✅ PASS | `BankNote` khớp tên qua tất cả layers |
| P-04: No business logic in Controller | ✅ PASS | Controller chỉ gọi service |
| P-05: Auth/Permission | ✅ PASS | Không thay đổi, kế thừa quyền màn hình |
| P-06: i18n | ✅ PASS | Cập nhật VN/EN (và CN/JA/KR theo pattern) |
| P-07: SQL migration safety | ✅ PASS | `IF NOT EXISTS` guard trong migration |
| P-08: Scope creep | ✅ PASS | Chỉ thay đổi đúng những gì spec yêu cầu |

---

## Project Structure

### Documentation (this feature)

```
specs/add-note-field-into-cat_bank/
├── spec.md                ← BA input — SOURCE OF TRUTH
├── research.md            ← Phase 0 output
├── data-model.md          ← Phase 1 output
├── contracts/
│   └── api-commitments.md ← Phase 1 output
├── plan.md                ← this file
└── tasks.md               ← /vnr-tasks output (pending)
```

### Source Code

```
src/HRM9/Main/Source/
├── Updates/Scripts/SQL/
│   └── 20260611_01.sql                                ← ✅ DONE (migration đã có)
├── Updates/Stores/SQL2012/
│   └── 03904_hrm_cat_sp_get_BankById.sql              ← ❌ cần tạo mới (SP update)
├── Data/HRM.Data.Entity/Models/
│   └── Cat_Bank.cs                                    ← ❌ thêm BankNote property
├── Business/HRM.Business.Category.Models/
│   └── Cat_BankEntity.cs                              ← ❌ thêm BankNote property
├── Presentation/HRM.Presentation.Category.Models/
│   └── CatBankModel.cs                                ← ❌ thêm BankNote + DisplayName + StringLength
├── Infrastructure/HRM.Infrastructure.Utilities/
│   └── ConstantDisplay.cs                             ← ❌ thêm HRM_Category_Bank_BankNote const
└── Presentation/HRM.Presentation.Main/
    ├── Settings/LANG_VN.XML                           ← ❌ thêm label VN
    ├── Settings/LANG_EN.XML                           ← ❌ thêm label EN
    ├── Settings/FIELD_INFO.XML                        ← ❌ thêm Field entry
    └── Views/Cat_Bank/CatBankInfo.cshtml              ← ❌ thêm VnrTextAreaFor control
```

---

## Architecture Decision

### Không thay đổi kiến trúc

> **Note (P-08/P-13)**: Feature này thuộc **HRM9 MVC pattern** (HRM.Presentation.Main — ASP.NET MVC 5 + Kendo UI), **không phải** ServiceCenter pattern. Response trả về `Json(model)` trực tiếp, không wrap `IApiResult<T>`. Angular lazy-load/authGuard không áp dụng. Permission key kế thừa từ màn hình Cat_Bank hiện tại — không tạo key mới.

Feature này là một **field addition** thuần túy. Không cần:
- Controller mới
- Service mới
- Endpoint mới
- Permission key mới

### Data flow (hiện tại, vẫn giữ)

```
POST api/CatBank (CatBankModel)
  → ValidatorService.OnValidateData (DataAnnotations)
  → ActionService.UpdateOrCreate<Cat_BankEntity, CatBankModel>
      → CopyData<CatBankModel, Cat_BankEntity> (reflection)
      → CopyData<Cat_BankEntity, Cat_Bank> (reflection)
      → EF6 DbContext.SaveChanges()
      → SQL Server: UPDATE Cat_Bank SET BankNote = ...

GET api/CatBank/{id}
  → ActionService.GetByIdUseStore<Cat_BankEntity>(id, "hrm_cat_sp_get_BankById")
      → Execute SP → Map to Cat_BankEntity (reflection)
      → CopyData<Cat_BankEntity, CatBankModel> (reflection)
  → Return CatBankModel (includes BankNote)
```

### SP Update pattern

Không sửa trực tiếp file SP cũ (`00815_...`). Tạo file mới `03904_hrm_cat_sp_get_BankById.sql` theo pattern numbered SP — số tiếp theo sau `03903`.

---

## Phase Breakdown

### Phase 0 — Database (dependency cho mọi phase sau)

**Goal**: Column `BankNote` tồn tại trong DB

| Task | File | Status |
|------|------|--------|
| SQL migration: ADD COLUMN | `Updates/Scripts/SQL/20260611_01.sql` | ✅ DONE |
| SP update: GetById include BankNote | `Updates/Stores/SQL2012/03904_hrm_cat_sp_get_BankById.sql` | ❌ TODO |

**Verify**: `SELECT BankNote FROM Cat_Bank WHERE 1=0` không lỗi; SP return `BankNote`.

---

### Phase 1 — Data Layer

**Goal**: EF6 entity có property `BankNote`

| Task | File |
|------|------|
| Thêm `BankNote` property | `Data/HRM.Data.Entity/Models/Cat_Bank.cs` |

```csharp
[StringLength(1000)]
public string BankNote { get; set; }
```

**Verify**: Build solution không lỗi tại project `HRM.Data.Entity`.

---

### Phase 2 — Business Layer

**Goal**: Business entity DTO có property `BankNote` để `CopyData` reflection copy được

| Task | File |
|------|------|
| Thêm `BankNote` property | `Business/HRM.Business.Category.Models/Cat_BankEntity.cs` |

```csharp
public string BankNote { get; set; }
```

**Verify**: Build `HRM.Business.Category.Models` không lỗi.

---

### Phase 3 — Presentation Model

**Goal**: ViewModel có `BankNote` với `[DisplayName]` và `[StringLength]`

| Task | File |
|------|------|
| Thêm `BankNote` vào `CatBankModel` | `Presentation/HRM.Presentation.Category.Models/CatBankModel.cs` |
| Thêm i18n const | `Infrastructure/HRM.Infrastructure.Utilities/ConstantDisplay.cs` |

```csharp
// CatBankModel:
[DisplayName(ConstantDisplay.HRM_Category_Bank_BankNote)]
[StringLength(1000, ErrorMessageResourceType = typeof(HRM.Infrastructure.Utilities.ConstantMessages), ErrorMessageResourceName = "...")]
public string BankNote { get; set; }

// ConstantDisplay.cs (sau HRM_Category_Bank_Notes_StringLength line 24135):
public const string HRM_Category_Bank_BankNote = "HRM_Category_Bank_BankNote";
```

**Verify**: Build `HRM.Presentation.Category.Models` và `HRM.Infrastructure.Utilities` không lỗi.

---

### Phase 4 — i18n & Config

**Goal**: Labels hiển thị đúng ngôn ngữ; FIELD_INFO.XML nhận diện field

| Task | File | Nội dung |
|------|------|---------|
| Label VN | `Settings/LANG_VN.XML` | `<Language Name="HRM_Category_Bank_BankNote" Value="Ghi chú đánh giá ngân hàng" />` |
| Label EN | `Settings/LANG_EN.XML` | `<Language Name="HRM_Category_Bank_BankNote" Value="Bank Evaluation Note" />` |
| Field config | `Settings/FIELD_INFO.XML` | `<Field Name="BankNote" Alias="HRM_Category_Bank_BankNote" />` trong block `<Table Name="Cat_Bank">` |

**Verify**: Khởi động app → màn hình ngân hàng → label "Ghi chú đánh giá ngân hàng" hiển thị đúng.

---

### Phase 5 — UI View

**Goal**: Textarea `BankNote` xuất hiện trên form Create/Edit, sau các trường chính

| Task | File |
|------|------|
| Thêm `VnrTextAreaFor` | `Views/Cat_Bank/CatBankInfo.cshtml` |

**Vị trí**: Thêm sau block `IsInactive` (dòng 122), trước block `Notes` hiện có (hoặc sau block `Notes` — theo spec "sau các trường thông tin chính").

```html
<div>
    <div class="FieldTitle150">
        @Html.VnrLabelFor(mode => mode.BankNote)
    </div>
    <div class="FieldValue">
        @{ var _bankNote = new TextAreaBuilderInfo()
           {
               Value = Model == null ? "" : Model.BankNote,
               HtmlAttributes = new { maxlength = "1000" }
           };
        }
        @Html.VnrTextAreaFor(mode => mode.BankNote, "width:500px;height:100px;")
    </div>
</div>
```

**Verify**: Form tạo mới / cập nhật hiển thị Textarea "Ghi chú đánh giá ngân hàng". Nhập > 1000 ký tự → browser block (maxlength). Save → dữ liệu lưu đúng. Reload → hiển thị lại đúng giá trị.

---

## Dependencies

### Không cần NuGet/npm mới

Tất cả pattern đã có trong codebase.

### Thứ tự thực hiện bắt buộc

```
Phase 0 (SP) → Phase 1 (Data Entity) → Phase 2 (Business Entity)
                                                        ↓
Phase 5 (View) ← Phase 4 (i18n) ← Phase 3 (Presentation Model)
```

Phase 0 có thể song song với Phases 1-2-3-4. Phase 5 phụ thuộc Phase 3+4.

---

## Database Migration

| File | Nội dung | Status |
|------|---------|--------|
| `Updates/Scripts/SQL/20260611_01.sql` | `ALTER TABLE Cat_Bank ADD BankNote NVARCHAR(1000) NULL` | ✅ DONE |
| `Updates/Stores/SQL2012/03904_hrm_cat_sp_get_BankById.sql` | `CREATE OR ALTER PROCEDURE hrm_cat_sp_get_BankById` + `cb.BankNote` | ❌ TODO |

> **SP naming convention**: Codebase dùng numbered prefix (ví dụ `00815_hrm_cat_sp_get_BankById.sql`). File update SP mới được đánh số `03904` (tiếp theo sau `03903_hrm_hre_sp_get_PractisingCertificateId.sql`). ✅ Confirmed đúng pattern.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| CopyData silent fail nếu thiếu layer | High | Checklist 4-layer verification bắt buộc |
| SP không được deploy → GetById trả null | Medium | Verify SP bằng SSMS sau deploy |
| `FIELD_INFO.XML` không được reload | Low | IIS restart sau deploy |
| Contract export enum `BankNote` tương thích | Low | Spec xếp vào "Ngoài phạm vi Phase 3" — verify riêng |

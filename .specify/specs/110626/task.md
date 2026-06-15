# Tasks: add-note-field-into-cat_bank — Bo sung truong Ghi chu danh gia ngan hang

**Input**: `specs/add-note-field-into-cat_bank/` — spec.md, plan.md, data-model.md, contracts/, research.md
**Prerequisites**: plan.md (approved), spec.md (source of truth)

**Tests**: Not explicitly requested in spec. Manual testing only (per AC mapping in plan.md).

**Organization**: Shape A — per AC group (Happy-Path → Validation). Single-repo HRM9.

## Format: `[ID] [P?] [AC] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[AC]**: Traces to Acceptance Criteria from spec

## Path Conventions (HRM9 Single-Repo)

> `src/HRM9/` is one git repository. All paths relative to `src/HRM9/Main/Source/`.

---

## Phase 1: Setup

**Purpose**: Branch already created. No additional setup needed for this feature.

- [x] T001 Verify feature branch `feature/add-note-field-into-cat_bank` exists in `src/HRM9/`

---

## Phase 2: Foundational — Database & Data Layer

**Purpose**: SQL migration + Data Entity — BLOCKS all subsequent phases (EF6 must see the column).

**Independent test criteria**: Column exists in DB; `Cat_Bank.cs` builds with new property.

- [x] T002 Create SQL migration `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Updates/Scripts/SQL/20260611_01.sql` — ALTER TABLE Cat_Bank ADD BankNote NVARCHAR(1000) NULL with IF NOT EXISTS guard and Sys_Version insert
- [x] T003 Add `[StringLength(1000)] public string BankNote { get; set; }` to Data Entity `src/HRM9/Main/Source/Data/HRM.Data.Entity/Models/Cat_Bank.cs` — place before navigation properties (before line with `virtual ICollection`)

---

## Phase 3: Happy-Path — Create & Edit with BankNote field

**Purpose**: Full CRUD cycle works — user can enter, save, and retrieve BankNote value.

**AC mapping**: AC1 (textarea visible on Create), AC2 (textarea visible on Edit), AC3 (save empty OK), AC4 (save 1000 chars OK), AC6 (existing data unaffected)

**Independent test criteria**: Open Create form → textarea visible; Enter text → Save → Reload → text persists; Existing banks load without error.

- [x] T004 [P] Add `public string BankNote { get; set; }` to Business Entity `src/HRM9/Main/Source/Business/HRM.Business.Category.Models/Cat_BankEntity.cs`
- [x] T005 [P] Add `public const string HRM_Category_Bank_BankNote = "HRM_Category_Bank_BankNote";` to `src/HRM9/Main/Source/Infrastructure/HRM.Infrastructure.Utilities/ConstantDisplay.cs`
- [x] T006 [AC-001] Add BankNote property to Presentation Model `src/HRM9/Main/Source/Presentation/HRM.Presentation.Category.Models/CatBankModel.cs` — with `[DisplayName(ConstantDisplay.HRM_Category_Bank_BankNote)]` and `[StringLength(1000, ErrorMessage = "Ghi chu danh gia khong duoc vuot qua 1000 ky tu")]`; also add `BankNote` to inner `FieldNames` class
- [x] T007 [P] [AC-001] Add Vietnamese label `<HRM_Category_Bank_BankNote>Ghi chú đánh giá ngân hàng</HRM_Category_Bank_BankNote>` to `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Settings/Lang_VN.xml`
- [x] T008 [P] [AC-001] Add English label `<HRM_Category_Bank_BankNote>Bank Evaluation Note</HRM_Category_Bank_BankNote>` to `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Settings/Lang_EN.xml`
- [x] T009 [AC-001] Add textarea block to `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Views/Cat_Bank/CatBankInfo.cshtml` — insert after IsInactive div, before existing Notes div: `@Html.VnrLabelFor(mode => mode.BankNote)` + `@Html.VnrTextAreaFor(mode => mode.BankNote, "width:500px;height:100px;")`

---

## Phase 4: Validation — Max length enforcement

**Purpose**: User cannot save more than 1000 chars; friendly error message displayed.

**AC mapping**: AC5 (save 1001+ chars → error message)

**Independent test criteria**: Enter >1000 chars → client-side validation fires before submit; If bypassed, server returns validation error.

- [x] T010 [AC-005] Verify `[StringLength(1000)]` on CatBankModel triggers jQuery Unobtrusive Validation on form submit (no code change expected — `VnrTextAreaFor` auto-wires `data-val-*` attributes from model annotations). If not auto-wired, add `@Html.ValidationMessageFor(model => model.BankNote)` below the textarea in `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Views/Cat_Bank/CatBankInfo.cshtml`

---

## Phase 5: Polish & Verification

**Purpose**: Final build verification and cleanup.

- [x] T011 Build full solution `src/HRM9/Main/Source/VnResourceHRM 8.sln` — verify 0 errors
- [x] T012 [P] Verify all 4 model layers have `BankNote` property with exact same name (Data Entity, Business Entity, Presentation Model, CSHTML binding) — CopyData reflection requires name match

---

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (SQL + Data Entity) — BLOCKS Phase 3
    ↓
Phase 3 (Happy-Path: Business Entity + ConstantDisplay + Model + i18n + View)
    ↓
Phase 4 (Validation: verify StringLength wiring)
    ↓
Phase 5 (Build verification)
```

## Parallel Execution

**Within Phase 3**:
- T004 (Business Entity) ‖ T005 (ConstantDisplay) ‖ T007 (Lang_VN) ‖ T008 (Lang_EN) — all independent files
- T006 (CatBankModel) depends on T005 (ConstantDisplay must exist first)
- T009 (CSHTML) depends on T006 (model property must exist for VnrTextAreaFor)

**Within Phase 5**:
- T011 ‖ T012 — independent checks

## Implementation Strategy

**MVP**: Phase 2 + Phase 3 = complete working feature (create, save, read BankNote)
**Full**: Add Phase 4 (validation) + Phase 5 (build verify) for production-ready

**Estimated effort**: ~30 minutes (standard "add-field-to-entity" pattern per docs/raw/how-to-add-field-to-hrm9-entity.md)

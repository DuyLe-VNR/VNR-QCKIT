# Implementation Plan: 059 — Leave Type Validation (DAESANG)

**Branch**: `feature/059-leave-type-validation-DAESANG`  
**Date**: 2026-06-11  
**User Story**: `specs/059-leave-type-validation-DAESANG/spec.md`

---

## Summary

Thêm loại ngày nghỉ kinh nguyệt với 3 validate rule mới (gender filter, consecutive days, monthly limit) vào hệ thống HRM9. Phạm vi: 3 field mới vào `Cat_LeaveDayType`, 3 validate method mới trong `Att_LeavedayServices`, filter dropdown theo giới tính trên Portal + Web Main, cập nhật form Admin MVC Kendo UI.

**Actors**: NV nữ (đăng ký), BPNS/HR (đăng ký hộ), Admin (cấu hình loại nghỉ).

---

## Technical Context

**Language/Version**: C# .NET Framework 4.6.2  
**Primary Dependencies**: ASP.NET MVC 5, ASP.NET Web API 5.2.9, Entity Framework 6.4.4 (Database-First), Kendo UI Telerik  
**Storage**: SQL Server — `Cat_LeaveDayType` (ALTER +3 cols), `Att_LeaveDay` (READ-ONLY), `Hre_Profile` (READ-ONLY)  
**Testing**: NUnit 2.6.3  
**Target Platform**: Web server (.NET Framework 4.6.2)  
**Performance Goals**: Validate thêm 2 LINQ queries per LeaveDay item — acceptable; batch validate dùng `IN` clause cho ProfileIDs như pattern hiện tại  
**Constraints**: Không Code-First migration; không tạo file constant/enum mới  
**Scale/Scope**: Modify 2 existing services + 1 SP + 1 form view + i18n XML

---

## Constitution Check

| Principle | Status | Ghi chú |
|-----------|--------|---------|
| I. Database-First | PASS | Script SQL thủ công `20260611_01.sql`; partial class thêm property |
| II. SP Authority | PASS | Grid list query qua SP; new validate dùng LINQ (in-memory filter nhẹ) OK |
| III. Data Permission | PASS | Validate query dùng ProfileID — scoped đúng NV; SP dropdown nhận @UserLogin |
| IV. vnr-module First | N/A | Không có Angular component mới — chỉ logic trong existing form |
| V. Separation of Concerns | PASS | Validate logic trong Business layer; Controller gọi qua ActionService |
| VI. MFE Independence | N/A | Angular attendance MFE chỉ nhận data từ API — không thêm filtering logic |
| VII. Speckit SDLC | PASS | spec.md → plan.md → tasks.md → implement |
| VIII. Reflection Safety | WARN | Thêm 3 property vào Cat_LeaveDayType entity — thêm mới không phá reflection; verify CalcEngine grep trước implement |

### Reflection Risk Analysis

`Cat_LeaveDayType` được dùng trong CalcEngine cho formula `IsMenses` (line ~11513 trong `Att_LeavedayServices`). Thêm property mới không phá vỡ reflection — chỉ rename/delete mới nguy hiểm. Risk: LOW.

---

## Project Structure

### Documentation

```
specs/059-leave-type-validation-DAESANG/
├── spec.md                           # BA User Story (input)
├── UI.jpg                            # UI mockup
├── plan.md                           # This file
├── research.md                       # Phase 0
├── data-model.md                     # Phase 1
├── contracts/api-commitments.md      # Phase 1
└── tasks.md                          # Phase 2 (vnr-tasks output)
```

### Source Code

```
src/HRM9/Main/Source/
├── Data/HRM.Data.Entity/
│   └── Models/Cat_LeaveDayType.cs           # MODIFY — thêm 3 property (partial)
├── Business/
│   ├── HRM.Business.Category.Models/
│   │   └── Cat_LeaveDayTypeEntity.cs        # MODIFY — thêm 3 property
│   └── HRM.Business.Attendance.Domain/
│       └── Att_LeavedayServices.cs          # MODIFY — thêm 3 validate method
├── Presentation/
│   ├── HRM.Presentation.Main/
│   │   ├── Controllers/Cat_LeaveDayTypeController.cs    # VERIFY — kiểm tra model binding
│   │   ├── Views/Cat_LeaveDayType/Edit.cshtml           # MODIFY — thêm 3 field vào form
│   │   ├── Updates/Scripts/SQL/20260611_01.sql          # NEW — ALTER TABLE + UPDATE default
│   │   └── Updates/Stores/SQL2012/                      # MODIFY — SP dropdown + get list
│   └── HRM.Presentation.Attendance.Models/
│       └── Att_LeaveDayModel.cs              # VERIFY — không cần thay đổi
├── Infrastructure/HRM.Infrastructure.Utilities/
│   ├── ConstantMessage.cs            # MODIFY — thêm 3 message key
│   ├── ConstantDisplay.cs            # MODIFY — thêm 3 label key
│   └── Settings/Lang_VN.xml          # MODIFY
│       Settings/Lang_EN.xml          # MODIFY
```

---

## Phase Breakdown

### Phase 0 — Database Schema

**Files thay đổi**:
- `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Updates/Scripts/SQL/20260611_01.sql`

**Tasks**:
1. Tạo script ALTER TABLE thêm 3 cột vào `Cat_LeaveDayType`
2. UPDATE default `ApplyGender = 'All'` cho records hiện có

### Phase 1 — Entity & Model

**Files thay đổi**:
- `HRM.Data.Entity/Models/Cat_LeaveDayType.cs` — partial class thêm 3 property
- `HRM.Business.Category.Models/Cat_LeaveDayTypeEntity.cs` — thêm 3 property
- `HRM.Infrastructure.Utilities/ConstantMessage.cs` — thêm 3 message key
- `HRM.Infrastructure.Utilities/ConstantDisplay.cs` — thêm 3 label key

**Tasks**:
1. Thêm property `ApplyGender`, `IsRequireConsecutive`, `MaxConsecutiveDaysPerMonth` vào EF6 entity (partial class)
2. Thêm 3 property vào `Cat_LeaveDayTypeEntity`
3. Thêm message keys vào `ConstantMessage.cs`:
   - `Cat_LeaveDayType_GenderNotAllow`: "Loại ngày nghỉ {0} chỉ áp dụng cho nhân viên nữ"
   - `Cat_LeaveDayType_MustConsecutive`: "Ngày đăng ký phải là {0}. Các ngày nghỉ {1} phải liên tiếp nhau."
   - `Cat_LeaveDayType_MonthlyLimitExceeded`: "Bạn đã đăng ký đủ {0} ngày {1} trong tháng {2}."
4. Thêm label keys vào `ConstantDisplay.cs` và XML ngôn ngữ (VN + EN)

### Phase 2 — Business Logic (Validate Service)

**Files thay đổi**:
- `HRM.Business.Attendance.Domain/Att_LeavedayServices.cs`

**3 method mới**:

```csharp
// Rule 1 — Gender Filter
public List<Att_LeaveDayEntity> ValidateGenderApplyFilter(
    List<Att_LeaveDayEntity> listLeaveDayItemSave,
    List<Hre_ProfileMultiField> listProfile,
    List<Cat_LeaveDayTypeEntity> listLeaveDayType,
    string userLogin)

// Rule 2 — Consecutive Days
public List<Att_LeaveDayEntity> ValidateConsecutiveDays(
    List<Att_LeaveDayEntity> listLeaveDayItemSave,
    List<Cat_LeaveDayTypeEntity> listLeaveDayType,
    string userLogin)

// Rule 3 — Monthly Limit
public List<Att_LeaveDayEntity> ValidateMonthlyConsecutiveLimit(
    List<Att_LeaveDayEntity> listLeaveDayItemSave,
    List<Cat_LeaveDayTypeEntity> listLeaveDayType,
    string userLogin)
```

Gọi sau validate #3 (`ValidateMaternityLeaveLimit`) trong pipeline BLOCK.

**Implementation notes**:
- `ValidateConsecutiveDays`: dùng LINQ trực tiếp trên `unitOfWork.CreateQueryable<Att_LeaveDay>` với filter ProfileID + LeaveDayTypeID + tháng + `Status = E_APPROVED` + `IsDelete IS NULL`
- Batch query theo ProfileID: `.Where(x => profileIds.Contains(x.ProfileID))` để tránh N+1

### Phase 3 — SP & Presentation Model

**Files thay đổi**:
- SP `hrm_cat_sp_get_Cat_LeaveDayType` — thêm 3 cột vào SELECT
- SP dropdown `Cat_LeaveDayType` cho Portal — thêm filter `@ProfileGender`
- Model binding thêm 3 field trong Presentation.Main

### Phase 4 — Admin UI (Kendo MVC View)

**Files thay đổi**:
- `HRM.Presentation.Main/Views/Cat_LeaveDayType/Edit.cshtml`

**Tasks**:
1. Thêm dropdown `ApplyGender` (Tất cả / Nữ) — Kendo DropDownList
2. Thêm checkbox `IsRequireConsecutive`
3. Thêm input number `MaxConsecutiveDaysPerMonth` — show/hide theo checkbox (JS)
4. Client-side validate: `MaxConsecutiveDaysPerMonth` required khi checkbox checked

### Phase 5 — i18n

**Files thay đổi**:
- `Lang_VN.xml`, `Lang_EN.xml` trong `HRM.Presentation.Main/Settings/`

---

## Dependencies

**NuGet/npm mới**: Không có.

---

## Database Migration

| Loại | File | Nội dung |
|------|------|---------|
| ALTER TABLE | `Updates/Scripts/SQL/20260611_01.sql` | Thêm `ApplyGender nvarchar(50)`, `IsRequireConsecutive bit`, `MaxConsecutiveDaysPerMonth int` vào `Cat_LeaveDayType` |
| SP modify | `Updates/Stores/SQL2012/hrm_cat_sp_get_Cat_LeaveDayType.sql` | Thêm 3 cột vào SELECT |
| SP modify | SP dropdown Cat_LeaveDayType cho Portal | Thêm filter `ApplyGender` theo `@ProfileGender` |

---

## Risk & Rollback

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Reflection break trong CalcEngine | LOW | Thêm mới property không phá reflection; grep verify trước |
| ValidateConsecutiveDays N+1 query | MEDIUM | Batch query với `profileIds.Contains` |
| SP dropdown Portal chưa biết tên chính xác | LOW | Xác định bằng grep/code search trong Phase 3 |
| ATT03.02 bypass validate | LOW | Cùng gọi Att_LeavedayServices qua RestServiceClient |

**Rollback**: `ALTER TABLE Cat_LeaveDayType DROP COLUMN ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth` + git revert các file thay đổi.

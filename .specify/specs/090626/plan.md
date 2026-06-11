# Implementation Plan: 059-leave-type-validation-DAESANG

**Branch**: `059-leave-type-validation-DAESANG` | **Date**: 2026-06-10 | **User Story**: `specs/059-leave-type-validation-DAESANG/spec.md`
**Input**: User Story file at `specs/059-leave-type-validation-DAESANG/spec.md`.

---

## Summary

**Yêu cầu**: Thêm loại ngày nghỉ kinh nguyệt cho NV nữ với 3 validate rule mới: giới tính, ngày liên tục, giới hạn tháng.

**3 Business Scopes (BS-01 → BS-03)**:
- **BS-01**: Bổ sung 3 field vào `Cat_LeaveDayType` (ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth) + cập nhật form Admin
- **BS-02**: Thêm 3 validate rule vào `Att_LeavedayServices.CreateOrUpdateLeaveday()` — gender filter, consecutive days, monthly limit
- **BS-03**: Filter dropdown loại nghỉ theo gender NV trên Portal form đăng ký

**Scope**: BE (HRM9 — .NET Framework 4.6.2) + FE (Vnr.Dev.HrmPortal — Angular 15 MFE)
**No mobile scope**: Spec không đề cập mobile screens.

---

## Technical Context

**Language/Version**: .NET Framework 4.6.2 (BE) + Angular 15 (FE)
**Primary Dependencies**: EF6 Database-First, ASP.NET MVC 5, ServiceCenter (`HRM.SC.Module.Att.*`), vnr-module design system
**Storage**: SQL Server — `Cat_LeaveDayType` (ALTER TABLE), `Att_LeaveDay` (read-only query)
**Testing**: Manual testcases
**Target Platform**: Web (HRM9 Main + EmpPortal)
**Performance Goals**: Validate rule thêm max 1–2 DB roundtrips per save — acceptable
**Constraints**: Database-First — không dùng EF migration, SQL file là nguồn sự thật. SQL files UTF-16 LE
**Scale/Scope**: 2 entities sửa đổi, 2 endpoints sửa đổi, 2 FE surfaces sửa đổi (Angular Portal + MVC Web Main)

---

## Constitution Check

| Gate | Status | Ghi chú |
|------|--------|---------|
| Spec đầy đủ (mọi thay đổi có mô tả) | ✅ PASS | BS-01/02/03 đầy đủ |
| Data model không Code-First | ✅ PASS | SQL ALTER TABLE → EF partial |
| Controller không có business logic | ✅ PASS | Logic trong Att_LeavedayServices |
| Permission key theo convention | ✅ PASS | Dùng key hiện có |
| No hardcode secrets/URLs | ✅ PASS | |
| SP là nguồn sự thật cho query phức tạp | ✅ PASS | Validate LINQ đơn giản — không cần SP |
| Data permission filter | ✅ PASS | Validate trong CreateOrUpdateLeaveday đã có context |

---

## Project Structure

### Documentation (this feature)

```
specs/059-leave-type-validation-DAESANG/
├── spec.md                         ← BA input
├── plan.md                         ← This file
├── research.md                     ← Phase 0
├── data-model.md                   ← Phase 1
├── contracts/api-commitments.md    ← Phase 1
└── tasks.md                        ← Phase 2 (vnr-tasks output)
```

### Source Code

```
src/HRM9/Main/Source/
├── Data/HRM.Data.Entity/
│   ├── Models/Cat_LeaveDayType.cs                              ← +3 fields (partial)
│   └── FluentConfigurations/Cat_LeaveDayTypeConfiguration.cs  ← +3 property configs
├── Presentation/HRM.Presentation.Category.Models/
│   └── CatLeaveDayTypeModel.cs                                 ← +3 fields
└── Projects/HRM.ServiceCenter/Modules/Attendance/
    ├── HRM.SC.Module.Att.Business/
    │   └── Att_LeavedayServices.cs                             ← +3 validate rules
    ├── HRM.SC.Module.Att.Api/
    │   └── (Att_LeaveDayType controller — genderFilter param)
    └── HRM.SC.Module.Att.Models/
        └── (Cat_LeaveDayType model extend)

src/HRM9/Updates/Stores/SQL2012/
└── v059_add_leavetype_gender_fields.sql                        ← ALTER TABLE

src/Vnr.Dev.HrmPortal/projects/attendance/
└── src/app/pages/att-leaveday/
    └── (dropdown API call + genderFilter param)

src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/
└── (MVC Attendance LeaveDay form — dropdown loại nghỉ filter theo gender NV được chọn)
```

**Structure Decision**: Modify existing — không tạo project mới. Thay đổi nhỏ-vừa phân tán qua 5–6 files.

---

## Phase Breakdown

### Phase 0 — Database Schema

**Mục tiêu**: Thêm 3 column mới vào `Cat_LeaveDayType`

**Việc làm**:
- Tạo SQL script (UTF-16 LE via PowerShell) với IF NOT EXISTS guard:
  ```sql
  IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Cat_LeaveDayType') AND name = 'ApplyGender')
      ALTER TABLE Cat_LeaveDayType ADD ApplyGender varchar(50) NULL CONSTRAINT DF_Cat_LeaveDayType_ApplyGender DEFAULT ('All');
  IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Cat_LeaveDayType') AND name = 'IsRequireConsecutive')
      ALTER TABLE Cat_LeaveDayType ADD IsRequireConsecutive bit NULL CONSTRAINT DF_Cat_LeaveDayType_IsRequireConsecutive DEFAULT (0);
  IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Cat_LeaveDayType') AND name = 'MaxConsecutiveDaysPerMonth')
      ALTER TABLE Cat_LeaveDayType ADD MaxConsecutiveDaysPerMonth int NULL;
  ```

---

### Phase 1 — EF6 Entity + Presentation Model

**Mục tiêu**: Sync EF entity với DB schema mới, update presentation model

**Việc làm**:
1. Thêm 3 property vào `Cat_LeaveDayType.cs` (partial class): `ApplyGender`, `IsRequireConsecutive`, `MaxConsecutiveDaysPerMonth`
2. Thêm config vào `Cat_LeaveDayTypeConfiguration.cs`
3. Thêm 3 property + `[DisplayName]` vào `CatLeaveDayTypeModel.cs`
4. Thêm 3 error message constants

---

### Phase 2 — Backend Validate Rules (BS-02)

**Mục tiêu**: Inject 3 validate rule vào `CreateOrUpdateLeaveday()`

**Inject point**: `Att_LeavedayServices.cs` → `CreateOrUpdateLeaveday()` sau khi `listLeavedayType` được load (line ~6422), trước vòng lặp xử lý profile.

**Rule 1 — Gender Filter**:
- Lấy `selectedLeaveDayType` từ `listLeavedayType` theo `model.LeaveDayTypeID`
- Nếu `ApplyGender == "Female"`: loop `listProfile` → check `profile.Gender != "Female"` → return error

**Rule 2 — Consecutive Days** (chỉ khi `IsRequireConsecutive == true`):
- Với từng profile + từng `DateStart` trong `ListLeaveDayItem`:
- Query `Att_LeaveDay`: `MAX(DateEnd)` WHERE ProfileID, LeaveDayTypeID, tháng/năm = tháng đăng ký, Status = `E_APPROVED`, IsDelete IS NULL
- Nếu `lastApprovedDate != null` AND `DateStart.Date != lastApprovedDate.Value.Date.AddDays(1)` → error

**Rule 3 — Monthly Limit** (chỉ khi `IsRequireConsecutive == true` AND `MaxConsecutiveDaysPerMonth != null`):
- Query `Att_LeaveDay`: `COUNT(*)` cùng điều kiện (không bao gồm E_CANCEL/E_REJECT)
- Nếu `approvedCount >= MaxConsecutiveDaysPerMonth` → error

---

### Phase 3 — Dropdown Gender Filter (BS-03) — Portal + Web Main

**Mục tiêu**: Filter dropdown loại nghỉ theo gender NV trên **cả 2 surface**: Angular Portal (ATT03.01) và MVC Web Main (ATT03.02 — BPNS đăng ký hộ)

**BE** (dùng chung 1 API):
- Thêm `genderFilter` param vào endpoint lấy danh sách `Cat_LeaveDayType` cho dropdown
- Filter logic: `genderFilter = 'Female'` → trả `ApplyGender IN ('All', 'Female')`; `genderFilter = 'Male'` → trả chỉ `ApplyGender = 'All'`; `genderFilter = null` → trả tất cả

**FE 1 — Angular Portal** (ATT03.01 — NV tự đăng ký):
- Khi load dropdown loại nghỉ: lấy `gender` của NV đang đăng nhập từ user profile state → truyền `genderFilter` vào API call

**FE 2 — MVC Web Main** (ATT03.02 — BPNS đăng ký hộ):
- Khi BPNS chọn NV → trigger reload dropdown loại nghỉ kèm `genderFilter = gender của NV được chọn`
- Cần xác định MVC controller/view load dropdown loại nghỉ trong form đăng ký hộ → sửa AJAX call truyền thêm gender NV
- Gender NV lấy từ API `Hre_Profile` khi BPNS chọn NV (hoặc từ data đã có trên form)

**Đồng bộ validate**: BE `CreateOrUpdateLeaveday()` (Phase 2 Rule 1) vẫn là tầng bảo vệ cuối — filter FE chỉ là UX, không thay thế BE validate.

---

### Phase 4 — Admin Form UI (BS-01)

**Mục tiêu**: Thêm 3 field mới vào form Cat_LeaveDayType (Admin)

**Việc làm**:
- Xác định form hiện tại (Kendo MVC hoặc Angular)
- Thêm `ApplyGender` dropdown (Tất cả / Nữ), `IsRequireConsecutive` checkbox, `MaxConsecutiveDaysPerMonth` input number (conditional show)
- Validate: `IsRequireConsecutive = true` → `MaxConsecutiveDaysPerMonth` required

---

## Error Messages

```
HRM_Att_LeaveDay_GenderNotAllowed = "Loại ngày nghỉ {0} chỉ áp dụng cho nhân viên nữ"
HRM_Att_LeaveDay_ConsecutiveRequired = "Ngày đăng ký phải là {0}. Các ngày nghỉ {1} phải liên tiếp nhau."
HRM_Att_LeaveDay_MonthlyLimitExceeded = "Bạn đã đăng ký đủ {0} ngày {1} trong tháng {2}."
```

---

## Risk Assessment

| Rủi ro | Mức độ | Mitigation |
|--------|--------|------------|
| `CreateOrUpdateLeaveday` rất lớn | MEDIUM | Inject vào đúng region, không refactor toàn bộ |
| BPNS đăng ký hộ nhiều NV | MEDIUM | Loop qua `listProfile`, check từng NV |
| MVC Web Main — xác định đúng AJAX endpoint load dropdown | MEDIUM | Trace từ form view → JS call → controller trước khi sửa |
| Admin form — MVC vs Angular chưa xác định | LOW | Kiểm tra trước khi implement Phase 4 |

---

## Checklist artifacts

- [x] `research.md`
- [x] `data-model.md`
- [x] `contracts/api-commitments.md`
- [x] `plan.md`
- [ ] `tasks.md` (Phase 2 — vnr-tasks)

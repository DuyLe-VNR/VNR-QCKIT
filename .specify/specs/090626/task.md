---
description: "Task list for 059-leave-type-validation-DAESANG"
---

# Tasks: 059 — Leave Type Validation (DAESANG)

**Feature**: `059-leave-type-validation-DAESANG`
**Input**: `specs/059-leave-type-validation-DAESANG/spec.md`, `plan.md`, `data-model.md`, `contracts/api-commitments.md`, `research.md`
**Shape**: **Shape A — per BS scope** (BS-01 Admin schema, BS-02 Validate rules, BS-03 Dropdown filter)

---

## Phase 1: Setup

**Purpose**: SQL migration script, branches verified.

- [x] T-01 Tạo SQL migration script (UTF-16 LE via PowerShell) — `src/HRM9/Updates/Stores/SQL2012/v059_add_leavetype_gender_fields.sql`
  - **Action**: Tạo mới
  - **Chi tiết**: Dùng PowerShell `[System.IO.File]::WriteAllText(path, content, [System.Text.Encoding]::Unicode)` để tạo file encoding UTF-16 LE. Nội dung:
    ```sql
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Cat_LeaveDayType') AND name = 'ApplyGender')
        ALTER TABLE Cat_LeaveDayType ADD ApplyGender varchar(50) NULL CONSTRAINT DF_Cat_LeaveDayType_ApplyGender DEFAULT ('All');
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Cat_LeaveDayType') AND name = 'IsRequireConsecutive')
        ALTER TABLE Cat_LeaveDayType ADD IsRequireConsecutive bit NULL CONSTRAINT DF_Cat_LeaveDayType_IsRequireConsecutive DEFAULT (0);
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Cat_LeaveDayType') AND name = 'MaxConsecutiveDaysPerMonth')
        ALTER TABLE Cat_LeaveDayType ADD MaxConsecutiveDaysPerMonth int NULL;
    ```
  - **Done khi**: File tồn tại, encoding UTF-16 LE with BOM, chạy OK trên SQL Server test không lỗi.

- [x] T-02 [P] Verify feature branches tồn tại trong cả 2 repo
  - **File**: n/a
  - **Action**: Verify
  - **Chi tiết**: `cd src/HRM9 && git branch --show-current` → phải là `feature/059-leave-type-validation-DAESANG`. `cd src/Vnr.Dev.HrmPortal && git branch --show-current` → phải là `feature/059-leave-type-validation-DAESANG`.
  - **Done khi**: Cả 2 repo đang ở đúng branch.

---

## Phase 2: Foundational — EF6 Entity + Model (Blocking)

**Purpose**: Sync EF entity + presentation models với DB schema mới. Blocks tất cả phase BE sau.

**⚠️ CRITICAL**: Phase 3–5 không bắt đầu được cho đến khi Phase 2 hoàn thành.

- [x] T-03 Thêm 3 property mới vào EF6 entity `Cat_LeaveDayType` (partial class)
  - **File**: `src/HRM9/Main/Source/Data/HRM.Data.Entity/Models/Cat_LeaveDayType.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm vào partial class (không xóa existing code):
    ```csharp
    public string ApplyGender { get; set; }
    public bool? IsRequireConsecutive { get; set; }
    public int? MaxConsecutiveDaysPerMonth { get; set; }
    ```
  - **Done khi**: File compile không lỗi, 3 property mới tồn tại trong class.

- [x] T-04 [P] Thêm config EF6 FluentAPI cho 3 field mới
  - **File**: `src/HRM9/Main/Source/Data/HRM.Data.Entity/FluentConfigurations/Cat_LeaveDayTypeConfiguration.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm vào `Configure()` method:
    ```csharp
    Property(t => t.ApplyGender).HasMaxLength(50);
    Property(t => t.IsRequireConsecutive);
    Property(t => t.MaxConsecutiveDaysPerMonth);
    ```
  - **Done khi**: File compile không lỗi.

- [x] T-05 [P] Thêm 3 property vào `CatLeaveDayTypeModel` (Presentation model)
  - **File**: `src/HRM9/Main/Source/Presentation/HRM.Presentation.Category.Models/CatLeaveDayTypeModel.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm vào class `CatLeaveDayTypeModel` (sau các property hiện có):
    ```csharp
    [DisplayName("HRM_Category_LeaveDayType_ApplyGender")]
    public string ApplyGender { get; set; }

    [DisplayName("HRM_Category_LeaveDayType_IsRequireConsecutive")]
    public bool? IsRequireConsecutive { get; set; }

    [DisplayName("HRM_Category_LeaveDayType_MaxConsecutiveDaysPerMonth")]
    public int? MaxConsecutiveDaysPerMonth { get; set; }
    ```
    Thêm vào `FieldNames` inner class:
    ```csharp
    public const string ApplyGender = "ApplyGender";
    public const string IsRequireConsecutive = "IsRequireConsecutive";
    public const string MaxConsecutiveDaysPerMonth = "MaxConsecutiveDaysPerMonth";
    ```
  - **Done khi**: File compile không lỗi, 3 field tồn tại trong model.

- [x] T-06 [P] Thêm 3 property vào `Cat_LeaveDayTypeMultiModel` (SC Shared model dùng cho dropdown)
  - **File**: `src/HRM9/Main/Source/Projects/HRM.ServiceCenter/Modules/Shared/HRM.SC.Module.Shared.Models/Category/Cat_LeaveDayTypeModel.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm vào class `Cat_LeaveDayTypeMultiModel`:
    ```csharp
    public string ApplyGender { get; set; }
    public bool? IsRequireConsecutive { get; set; }
    public int? MaxConsecutiveDaysPerMonth { get; set; }
    ```
  - **Done khi**: File compile không lỗi.

- [x] T-07 [P] Thêm field `GenderFilter` vào `Att_FilterLeavedayTypeByGrade` model
  - **File**: `src/HRM9/Main/Source/Projects/HRM.ServiceCenter/Modules/Attendance/HRM.SC.Module.Att.Models/Att_LeaveDayModel.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm vào class `Att_FilterLeavedayTypeByGrade`:
    ```csharp
    /// <summary>
    /// Gender filter: 'Male', 'Female', null = tất cả
    /// </summary>
    public string GenderFilter { get; set; }
    ```
  - **Done khi**: File compile không lỗi.

**Checkpoint**: Foundation ready — BC phần BE có thể bắt đầu.

---

## Phase 3: BS-01 — Admin Form Cat_LeaveDayType (MVC Web Main)

**Goal**: Admin có thể cấu hình 3 field mới trên form quản lý loại ngày nghỉ.

**Independent Test**: Admin vào Cat_LeaveDayType → tạo/sửa record → thấy dropdown ApplyGender + checkbox IsRequireConsecutive + input MaxConsecutiveDaysPerMonth → save thành công.

- [x] T-08 [BS-01] Xác định và trace MVC controller action load/save Cat_LeaveDayType form
  - **File**: `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Controllers/Cat_LeaveDayTypeController.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Kiểm tra action `GetDataById` hoặc `CreateOrUpdate` — đảm bảo `CatLeaveDayTypeModel` trả về/nhận 3 field mới (ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth). Nếu có mapping thủ công → thêm mapping cho 3 field mới.
  - **Done khi**: Controller action đọc/ghi 3 field mới từ/vào entity qua model binding.

- [x] T-09 [BS-01] Thêm 3 field mới vào Razor view form Cat_LeaveDayType (CreateOrUpdate)
  - **File**: `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Views/Cat_LeaveDayType/CreateOrUpdate.cshtml` (hoặc file tương đương — xác định trước khi edit)
  - **Action**: Cập nhật
  - **Chi tiết**:
    - `ApplyGender`: Kendo ComboBox dropdown với 2 option: `{ Text: 'Tất cả', Value: 'All' }`, `{ Text: 'Nữ', Value: 'Female' }`. Default: `All`.
    - `IsRequireConsecutive`: Kendo CheckBox. Default: unchecked.
    - `MaxConsecutiveDaysPerMonth`: Kendo NumericTextBox, min=1, hiển thị **chỉ khi** `IsRequireConsecutive` = checked (ẩn/hiện bằng JS toggle).
    - JS validate: nếu `IsRequireConsecutive = true` AND `MaxConsecutiveDaysPerMonth` rỗng → block submit + hiển thị message `"Vui lòng nhập số ngày tối đa/tháng"`.
  - **Done khi**: 3 field hiển thị đúng, conditional show/hide hoạt động, validate chặn submit khi thiếu MaxConsecutiveDaysPerMonth.

- [x] T-10 [BS-01] Đảm bảo Cat_LeaveDayType SP save nhận 3 field mới (hoặc EF SaveChanges cover)
  - **File**: `src/HRM9/Main/Source/Business/HRM.Business.Category.Domain/Cat_LeaveDayTypeServices.cs` (hoặc SP file nếu save qua SP)
  - **Action**: Cập nhật
  - **Chi tiết**: Trace luồng save Cat_LeaveDayType (EF SaveChanges hoặc SP). Nếu dùng EF SaveChanges → 3 field mới tự động được lưu sau khi entity update xong (Phase 2 T-03). Nếu dùng SP riêng → thêm 3 tham số vào SP và call code. Ghi lại approach thực tế.
  - **Done khi**: Save từ Admin form persist 3 field mới vào DB.

---

## Phase 4: BS-02 — Validate Rules trong CreateOrUpdateLeaveday

**Goal**: 3 validate rules (gender, consecutive, monthly limit) được enforce khi NV đăng ký nghỉ qua Portal hoặc BPNS đăng ký hộ qua Web Main.

**Independent Test**: Portal → chọn loại nghỉ KN → submit đơn → system trả đúng error message theo từng rule vi phạm.

- [x] T-11 [BS-02] Thêm Rule 1 — Gender Filter vào `CreateOrUpdateLeaveday()`
  - **File**: `src/HRM9/Main/Source/Projects/HRM.ServiceCenter/Modules/Attendance/HRM.SC.Module.Att.Business/Att_LeavedayServices.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Inject sau khi `listLeavedayType` được load (khoảng line 6422). Sau khi `var listLeavedayType = commonServices.GetLeavedayTypeRawData();`:
    ```csharp
    // [059] Rule 1 — Gender Filter
    var selectedLeaveDayType = listLeavedayType.FirstOrDefault(t => t.ID == model.LeaveDayTypeID);
    if (selectedLeaveDayType != null && selectedLeaveDayType.ApplyGender == "Female")
    {
        var invalidProfiles = listProfile.Where(p => p.Gender != "Female").ToList();
        if (invalidProfiles.Any())
        {
            message = string.Format(
                ConstantMessages.HRM_Att_LeaveDay_GenderNotAllowed ?? "Loại ngày nghỉ {0} chỉ áp dụng cho nhân viên nữ",
                selectedLeaveDayType.LeaveDayTypeName);
            return result;
        }
    }
    ```
  - **Done khi**: NV nam chọn loại nghỉ `ApplyGender = Female` → nhận error message đúng, không save được.

- [x] T-12 [BS-02] Thêm Rule 2 — Consecutive Days vào `CreateOrUpdateLeaveday()`
  - **File**: `src/HRM9/Main/Source/Projects/HRM.ServiceCenter/Modules/Attendance/HRM.SC.Module.Att.Business/Att_LeavedayServices.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Tiếp nối sau Rule 1:
    ```csharp
    // [059] Rule 2 — Consecutive Days
    if (selectedLeaveDayType?.IsRequireConsecutive == true)
    {
        foreach (var profile in listProfile)
        {
            foreach (var item in model.ListLeaveDayItem)
            {
                var regMonth = item.DateStart.Month;
                var regYear = item.DateStart.Year;
                using (var context = new VnrHrmDataContext())
                {
                    var unitOfWork = (IUnitOfWork)new UnitOfWork(context);
                    var lastApprovedDate = unitOfWork.CreateQueryable<Att_LeaveDay>(
                        d => d.ProfileID == profile.ID
                          && d.LeaveDayTypeID == selectedLeaveDayType.ID
                          && d.DateStart.Month == regMonth
                          && d.DateStart.Year == regYear
                          && d.Status == LeaveDayStatus.E_APPROVED.ToString()
                          && d.IsDelete == null
                    ).Max(d => (DateTime?)d.DateEnd);

                    if (lastApprovedDate.HasValue
                        && item.DateStart.Date != lastApprovedDate.Value.Date.AddDays(1))
                    {
                        message = string.Format(
                            ConstantMessages.HRM_Att_LeaveDay_ConsecutiveRequired
                            ?? "Ngày đăng ký phải là {0}. Các ngày nghỉ {1} phải liên tiếp nhau.",
                            lastApprovedDate.Value.AddDays(1).ToString("dd/MM/yyyy"),
                            selectedLeaveDayType.LeaveDayTypeName);
                        return result;
                    }
                }
            }
        }
    }
    ```
  - **Done khi**: Đăng ký ngày không liên tiếp với lần cuối approved → nhận error với ngày cần đăng ký đúng.

- [x] T-13 [BS-02] Thêm Rule 3 — Monthly Limit vào `CreateOrUpdateLeaveday()`
  - **File**: `src/HRM9/Main/Source/Projects/HRM.ServiceCenter/Modules/Attendance/HRM.SC.Module.Att.Business/Att_LeavedayServices.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Tiếp nối sau Rule 2:
    ```csharp
    // [059] Rule 3 — Monthly Limit
    if (selectedLeaveDayType?.IsRequireConsecutive == true
        && selectedLeaveDayType.MaxConsecutiveDaysPerMonth.HasValue)
    {
        foreach (var profile in listProfile)
        {
            var firstItem = model.ListLeaveDayItem?.FirstOrDefault();
            if (firstItem == null) continue;
            var regMonth = firstItem.DateStart.Month;
            var regYear = firstItem.DateStart.Year;
            using (var context = new VnrHrmDataContext())
            {
                var unitOfWork = (IUnitOfWork)new UnitOfWork(context);
                var approvedCount = unitOfWork.CreateQueryable<Att_LeaveDay>(
                    d => d.ProfileID == profile.ID
                      && d.LeaveDayTypeID == selectedLeaveDayType.ID
                      && d.DateStart.Month == regMonth
                      && d.DateStart.Year == regYear
                      && d.Status == LeaveDayStatus.E_APPROVED.ToString()
                      && d.IsDelete == null
                ).Count();

                if (approvedCount >= selectedLeaveDayType.MaxConsecutiveDaysPerMonth.Value)
                {
                    message = string.Format(
                        ConstantMessages.HRM_Att_LeaveDay_MonthlyLimitExceeded
                        ?? "Bạn đã đăng ký đủ {0} ngày {1} trong tháng {2}.",
                        selectedLeaveDayType.MaxConsecutiveDaysPerMonth.Value,
                        selectedLeaveDayType.LeaveDayTypeName,
                        regMonth.ToString("00") + "/" + regYear);
                    return result;
                }
            }
        }
    }
    ```
  - **Done khi**: Đăng ký vượt quá MaxConsecutiveDaysPerMonth → nhận error với số ngày và tháng đúng.

- [x] T-14 [P] [BS-02] Thêm 3 error message constants
  - **File**: Tìm file `ConstantMessages.cs` hoặc tương đương trong `src/HRM9/Main/Source/Infrastructure/` hoặc `Business/`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm 3 constant:
    ```csharp
    public const string HRM_Att_LeaveDay_GenderNotAllowed = "HRM_Att_LeaveDay_GenderNotAllowed";
    public const string HRM_Att_LeaveDay_ConsecutiveRequired = "HRM_Att_LeaveDay_ConsecutiveRequired";
    public const string HRM_Att_LeaveDay_MonthlyLimitExceeded = "HRM_Att_LeaveDay_MonthlyLimitExceeded";
    ```
    Thêm resource string tương ứng (vi-VN):
    - `HRM_Att_LeaveDay_GenderNotAllowed` = `"Loại ngày nghỉ {0} chỉ áp dụng cho nhân viên nữ"`
    - `HRM_Att_LeaveDay_ConsecutiveRequired` = `"Ngày đăng ký phải là {0}. Các ngày nghỉ {1} phải liên tiếp nhau."`
    - `HRM_Att_LeaveDay_MonthlyLimitExceeded` = `"Bạn đã đăng ký đủ {0} ngày {1} trong tháng {2}."`
  - **Done khi**: Constant tồn tại, compile không lỗi.

---

## Phase 5: BS-03 — Dropdown Filter theo Gender (Portal Angular + MVC Web Main)

**Goal**: Dropdown loại nghỉ chỉ hiển thị loại phù hợp giới tính NV trên cả 2 surface.

**Independent Test**:
- Portal: NV nữ đăng nhập → dropdown loại nghỉ có loại KN (`ApplyGender=Female`). NV nam → không thấy loại KN.
- Web Main: BPNS chọn NV nữ → dropdown có loại KN. BPNS chọn NV nam → không có.

### BE — Mở rộng `GetLeaveTypeByGrade` hỗ trợ GenderFilter

- [x] T-15 [BS-03] Thêm gender filter logic vào `GetLeaveTypeByGrade()` trong `Att_LeavedayServices`
  - **File**: `src/HRM9/Main/Source/Projects/HRM.ServiceCenter/Modules/Attendance/HRM.SC.Module.Att.Business/Att_LeavedayServices.cs`
  - **Action**: Cập nhật
  - **Chi tiết**: Trong method `GetLeaveTypeByGrade(Att_FilterLeavedayTypeByGrade model)`, sau khi `result` được load từ SP (khoảng line 5994–6007), thêm filter:
    ```csharp
    // [059] BS-03: Gender filter
    if (!string.IsNullOrEmpty(model.GenderFilter))
    {
        result = result.Where(s =>
            string.IsNullOrEmpty(s.ApplyGender)
            || s.ApplyGender == "All"
            || s.ApplyGender == model.GenderFilter
        ).ToList();
    }
    ```
  - **Done khi**: Call `GetLeaveTypeByGrade` với `GenderFilter = "Male"` → không trả loại có `ApplyGender = "Female"`. `GenderFilter = "Female"` → trả cả `All` và `Female`. `GenderFilter = null` → trả tất cả.

### FE Angular Portal

- [x] T-16 [P] [BS-03] Thêm `genderFilter` param vào API service call load loại nghỉ — Angular Portal
  - **File**: Tìm file API service trong `src/Vnr.Dev.HrmPortal/projects/attendance/src/app/` gọi `GetLeaveTypeByGrade` (tìm bằng grep) → cập nhật file đó
  - **Action**: Cập nhật
  - **Chi tiết**: Trong method gọi `GetLeaveTypeByGrade`, thêm `genderFilter` vào body request:
    ```typescript
    // Lấy gender của NV đang đăng nhập từ NgRx store user state
    // store.pipe(select(Reducers.getUser)).subscribe(u => this.userGender = u.gender ?? null)
    // Truyền vào model:
    model.GenderFilter = this.userGender; // 'Male' | 'Female' | null
    ```
    Cần xác định cách lấy gender user: kiểm tra `user state` trong NgRx store, hoặc gọi thêm profile API nếu chưa có.
  - **Done khi**: Request tới `GetLeaveTypeByGrade` kèm `GenderFilter` = gender NV đang đăng nhập.

- [x] T-17 [BS-03] Kiểm tra và cập nhật interface/model TypeScript cho `GetLeaveTypeByGrade` request
  - **File**: Tìm model TS tương ứng với `Att_FilterLeavedayTypeByGrade` trong `src/Vnr.Dev.HrmPortal/projects/attendance/src/app/`
  - **Action**: Cập nhật
  - **Chi tiết**: Thêm field `GenderFilter?: string` vào interface. Nếu không có file model riêng → thêm inline.
  - **Done khi**: TypeScript compile không lỗi, field `GenderFilter` tồn tại trong type.

### FE MVC Web Main (BPNS đăng ký hộ)

- [x] T-18 [BS-03] Thêm gender filter vào AJAX call load dropdown loại nghỉ — MVC Web Main BPNS form
  - **File**: `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Views/Att_Leaveday/CreateOrUpdate.cshtml`
  - **Action**: Cập nhật
  - **Chi tiết**:
    1. Tìm JS function load `#LeaveDayTypeID` Kendo ComboBox (hiện tại là `LoadLeaveDayTypeByGrade()` hoặc tương đương — xem line 148 của view).
    2. Khi BPNS chọn NV (onChange sự kiện của Profile dropdown): lấy `gender` của NV được chọn từ profile data (nếu chưa có trong form data → thêm AJAX call lấy gender từ `Hre_Profile` hoặc từ data đã load).
    3. Khi call `GetLeaveTypeByGrade`, thêm `GenderFilter: genderOfSelectedProfile` vào POST body.
    4. Nếu NV thay đổi → trigger reload dropdown loại nghỉ với gender mới.
  - **Done khi**: BPNS chọn NV nữ → dropdown có loại KN. Chọn NV nam → dropdown không có loại KN.

- [x] T-19 [P] [BS-03] Đảm bảo profile data load trong Web Main form có chứa field Gender
  - **File**: `src/HRM9/Main/Source/Presentation/HRM.Presentation.Main/Controllers/Att_PersonalSubmitLeaveDayController.cs` (hoặc BPNS controller tương đương)
  - **Action**: Cập nhật (nếu cần)
  - **Chi tiết**: Kiểm tra action load profile data cho BPNS form — đảm bảo `Hre_Profile.Gender` được trả về trong response để JS có thể đọc. Nếu thiếu → thêm `Gender` vào ViewModel/DTO.
  - **Done khi**: Profile data response chứa `Gender` field, JS có thể truy xuất sau khi BPNS chọn NV.

---

## Phase 6: Polish & Verification

- [x] T-20 [P] Verify build BE solution không lỗi
  - **File**: n/a
  - **Action**: Build
  - **Chi tiết**: `cd src/HRM9 && msbuild HRM9.sln /p:Configuration=Debug /t:Build` (hoặc dùng Visual Studio). Không có compile error.
  - **Done khi**: Build SUCCESS, 0 errors.

- [x] T-21 [P] Verify build FE Angular Portal không lỗi
  - **File**: n/a
  - **Action**: Build
  - **Chi tiết**: `cd src/Vnr.Dev.HrmPortal && ng build attendance` (hoặc `yarn build:attendance`). TypeScript compile không lỗi.
  - **Done khi**: Build SUCCESS, 0 TypeScript errors.

- [x] T-22 Traceability audit — xác nhận mọi BS scope được cover
  - **File**: n/a
  - **Action**: Verify
  - **Chi tiết**:
    - BS-01: T-08 + T-09 + T-10 ✓
    - BS-02 Rule 1: T-11 ✓ | Rule 2: T-12 ✓ | Rule 3: T-13 ✓
    - BS-03 Portal: T-15 + T-16 + T-17 ✓ | Web Main: T-18 + T-19 ✓
  - **Done khi**: Tất cả BS scope có task, không có gap.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Bắt đầu ngay.
- **Phase 2 (Foundational)**: Sau Phase 1. **BLOCKS** Phase 3–5.
- **Phase 3 (BS-01 Admin)**: Sau Phase 2.
- **Phase 4 (BS-02 Validate)**: Sau Phase 2. Chạy song song với Phase 3.
- **Phase 5 (BS-03 Dropdown)**: T-15 (BE) sau Phase 2. T-16/17/18/19 (FE) sau T-15.
- **Phase 6 (Polish)**: Sau tất cả.

### Parallel Opportunities

- T-03, T-04, T-05, T-06, T-07 trong Phase 2 — different files, chạy song song.
- Phase 3 và Phase 4 chạy song song (khác nhau về layer/file).
- T-16, T-17, T-18, T-19 trong Phase 5 — BE done trước, FE Portal và FE Web Main song song nhau.

### Critical Path

`T-01 → T-03 → T-11 → T-12 → T-13 → T-15 → T-18 → T-20`

---

## Implementation Strategy

### MVP First

1. **Phase 1** Setup → **Phase 2** Foundation (T-03 đến T-07)
2. **Phase 4** BS-02 validate rules (T-11, T-12, T-13, T-14) — đây là core business value, không phụ thuộc FE
3. **STOP & VALIDATE**: Test qua Portal — submit đơn nghỉ KN sai gender/ngày/limit → xác nhận 3 error messages đúng
4. **Phase 3** BS-01 Admin form (T-08, T-09, T-10)
5. **Phase 5** BS-03 dropdown filter (T-15–T-19)
6. **Phase 6** Polish

### Parallel Team

- **BE dev**: Phase 2 + Phase 4 (validate rules) + Phase 5 T-15 (BE gender filter)
- **FE dev**: Phase 3 (Admin form) + Phase 5 T-16/17/18/19 (dropdown filter)
- Converge: API contract `GetLeaveTypeByGrade + GenderFilter` đã defined trong `contracts/api-commitments.md`

---

## Execution Summary

- **Tổng số task**: 22
- **Phase 1 (Setup)**: 2 tasks
- **Phase 2 (Foundational)**: 5 tasks (parallel)
- **Phase 3 (BS-01 Admin)**: 3 tasks
- **Phase 4 (BS-02 Validate)**: 4 tasks
- **Phase 5 (BS-03 Dropdown)**: 5 tasks
- **Phase 6 (Polish)**: 3 tasks
- **Parallel groups**: 5 groups
- **Critical path**: T-01 → T-03 → T-11 → T-12 → T-13 → T-15 → T-18 → T-20
- **BS coverage**: BS-01 ✅ (T-08/09/10) | BS-02 ✅ (T-11/12/13/14) | BS-03 ✅ (T-15/16/17/18/19)

---
artifact_type: implementation-plan
artifact_version: 1
version: 1
pbi_id: 1973
generated_by: plan-generator
generated_at: "2026-05-13T16:30:00Z"
confidence: 0.92
---

# Kế hoạch Triển khai — PBI #1973
## GOAL-E03-F03-U06: Phát hiện & Xử lý Vòng lặp Vô hạng trong Rollup Engine (BE only)

---

## Tóm tắt phạm vi

| Hạng mục | Chi tiết |
|----------|---------|
| Phạm vi | Backend only — `VNR.Service.Evaluation` + `VNR.Core.Domain` + EF migrations |
| Ngoài phạm vi | Frontend, màn hình Admin/HR xem cảnh báo (thuộc U08), sửa cây mục tiêu (thuộc GOAL-E02) |
| Vấn đề cốt lõi | `UpdateParentGoalProgressAsync` kiểm tra sai node (current thay vì next), không rollback, không ghi cảnh báo |
| Kết quả mong đợi | Cycle detection đúng + rollback atomic + warning entity đầy đủ + response trung lập cho FE |

---

## Phân tích lỗ hổng hiện tại

### Bug 1 — Kiểm tra visited set sai node (Logic Error)

```
Hiện tại:  if (!visited.Add(goal.Id))   → kiểm tra node HIỆN TẠI
Cần sửa:   if (visited.Contains(goalParent.Id)) → kiểm tra node TIẾP THEO trước khi bước vào
```

Hậu quả: Vòng `MT-A → MT-B → MT-C → MT-A` bị phát hiện **sau khi** MT-A đã được xử lý lần 2 (partial write đã xảy ra).

### Bug 2 — Không rollback khi phát hiện vòng (Atomicity Violation)

```
Hiện tại:  return; (bình thường) → transaction vẫn commit
Cần sửa:   throw GoalCycleDetectedException → UnitOfWork tự rollback toàn bộ
```

### Bug 3 — Không ghi cảnh báo (Missing Warning Record)

Không có entity `Eva_GoalCycleWarning`, không có log có cấu trúc, Admin/HR không biết vòng lặp xảy ra ở đâu.

---

## Chiến lược triển khai

### Lựa chọn phương án

**Phương án được chọn: Exception-driven rollback + Post-rollback warning write**

1. Throw `GoalCycleDetectedException` trong `UpdateParentGoalProgressAsync` khi phát hiện vòng → `UnitOfWork.ExecuteInTransactionAsync` tự động gọi `RollbackAsync()`.
2. `UpdateGoalProgressCommandHandler` bắt exception, gọi `IGoalCycleWarningService.CreateWarningAsync()` trong **transaction độc lập** (ngoài transaction rollup gốc đã bị rollback).
3. Handler trả về response trung lập cho FE theo NFR-004.

**Lý do chọn phương án này:** Tái sử dụng cơ chế rollback có sẵn trong `UnitOfWork`, không cần quản lý transaction thủ công, tách biệt concerns rõ ràng. Chi tiết ADR trong `architecture_decisions_v1.md`.

---

## Kế hoạch theo Phase

---

### Phase 1 — Domain Layer: Entity + Exception + Enum

**Mục tiêu:** Tạo các building block domain cần thiết, không phụ thuộc vào layer nào khác.

#### Công việc

| # | Hành động | File | Ghi chú |
|---|-----------|------|---------|
| 1.1 | Tạo enum `GoalCycleWarningStatus` | `VNR.Core.Domain/Enums/GoalCycleWarningStatus.cs` | Giá trị: `PendingReview = 0`, `Resolved = 1` |
| 1.2 | Tạo custom exception `GoalCycleDetectedException` | `VNR.Core.Domain/Exceptions/GoalCycleDetectedException.cs` | Chứa: `List<Guid> CycleChain`, `Guid TriggerGoalId`, `Guid PeriodId`, `Guid? ProfileId`, `DateTimeOffset DetectedAt`, `string CycleChainDisplay` (chuỗi "MT-A → MT-B → ...") |
| 1.3 | Tạo entity `Eva_GoalCycleWarning` | `VNR.Core.Domain/Entities/Evaluation/Eva_GoalCycleWarning.cs` | Kế thừa `EntityBase<Guid>`, immutable fields: `CycleChain`, `TriggerSource`, `DetectedAt`; mutable: `Status`, `ResolvedByProfileId`, `ResolvedAt` |

#### Thiết kế `GoalCycleDetectedException`

```csharp
public class GoalCycleDetectedException : Exception
{
    public List<Guid> CycleChain { get; }       // Danh sách Id theo thứ tự vòng
    public string CycleChainDisplay { get; }    // "MT-A → MT-B → MT-C → MT-A"
    public Guid TriggerGoalId { get; }          // Goal nguồn kích hoạt rollup
    public Guid PeriodId { get; }
    public Guid? ProfileId { get; }             // Nhân viên nhập tiến độ
    public DateTimeOffset DetectedAt { get; }

    public GoalCycleDetectedException(
        List<Guid> cycleChain,
        string cycleChainDisplay,
        Guid triggerGoalId,
        Guid periodId,
        Guid? profileId)
        : base($"Goal cycle detected: {cycleChainDisplay}")
    { ... }
}
```

#### Thiết kế `Eva_GoalCycleWarning`

```csharp
public class Eva_GoalCycleWarning : EntityBase<Guid>
{
    public string CycleChain { get; private set; }        // immutable
    public string TriggerSource { get; private set; }     // immutable: "GoalId={x}, PeriodId={y}, ProfileId={z}"
    public DateTimeOffset DetectedAt { get; private set; } // immutable
    public GoalCycleWarningStatus Status { get; private set; }
    public Guid? ResolvedByProfileId { get; private set; }
    public DateTimeOffset? ResolvedAt { get; private set; }

    // Factory method để đảm bảo immutability
    public static Eva_GoalCycleWarning Create(...) { ... }

    // Chỉ method này được phép thay đổi trạng thái
    public void Resolve(Guid resolvedByProfileId) { ... }
}
```

#### Exit Criteria Phase 1

- [ ] Enum `GoalCycleWarningStatus` biên dịch thành công, có 2 giá trị `PendingReview` và `Resolved`
- [ ] `GoalCycleDetectedException` kế thừa `Exception` (không phải `DbException`), chứa đầy đủ 5 properties
- [ ] `Eva_GoalCycleWarning` có `private set` cho các immutable fields, có `Create()` factory method và `Resolve()` method
- [ ] Không có circular dependency mới trong `VNR.Core.Domain`
- [ ] `dotnet build VNR.Core.Domain` thành công (0 error, 0 warning mới)

---

### Phase 2 — Application Layer: Interface + Handler Fix

**Mục tiêu:** Định nghĩa contract service, sửa handler để bắt exception và ghi warning.

**Phụ thuộc:** Phase 1 hoàn thành.

#### Công việc

| # | Hành động | File | Ghi chú |
|---|-----------|------|---------|
| 2.1 | Tạo interface `IGoalCycleWarningService` | `VNR.Service.Evaluation.Application/Evaluation/GoalCycle/Services/IGoalCycleWarningService.cs` | 2 methods: `CreateWarningAsync`, `ResolveWarningAsync` |
| 2.2 | Tạo DTO `GoalCycleWarningCreateDto` | Cùng thư mục | Map từ exception data |
| 2.3 | Sửa `UpdateGoalProgressCommandHandler` | `Evaluation/GoalProgress/Handlers/UpdateGoalProgressCommandHandler.cs` | Bắt `GoalCycleDetectedException`, gọi service, trả về response trung lập |

#### Thiết kế `IGoalCycleWarningService`

```csharp
public interface IGoalCycleWarningService
{
    Task<Guid> CreateWarningAsync(GoalCycleWarningCreateDto dto, CancellationToken ct = default);
    Task ResolveWarningAsync(Guid warningId, Guid resolvedByProfileId, CancellationToken ct = default);
}

public record GoalCycleWarningCreateDto(
    string CycleChain,
    string TriggerSource,
    DateTimeOffset DetectedAt
);
```

#### Sửa `UpdateGoalProgressCommandHandler`

```csharp
// Trước: chỉ bắt Exception chung
// Sau: bắt GoalCycleDetectedException TRƯỚC, xử lý riêng

try
{
    await _goalProgressService.UpdateGoalProgressAsync(request.Request, ct);
    return Success(true);
}
catch (GoalCycleDetectedException ex)
{
    // Transaction rollup đã bị rollback bởi UnitOfWork
    // Ghi warning trong transaction mới, độc lập
    await _goalCycleWarningService.CreateWarningAsync(new GoalCycleWarningCreateDto(
        ex.CycleChainDisplay,
        $"GoalId={ex.TriggerGoalId}, PeriodId={ex.PeriodId}, ProfileId={ex.ProfileId}",
        ex.DetectedAt
    ), ct);

    await _loggingService.LogWarningAsync($"[CYCLE-DETECTION] {ex.Message}", ct);

    // Trả về response trung lập (NFR-004) — không expose thông tin kỹ thuật
    return Success(true); // hoặc Success với flag "pending_update"
}
catch (Exception ex)
{
    // Xử lý lỗi chung như hiện tại
    return Error<bool>(ex.Message);
}
```

**Lưu ý quan trọng:** Trả về `Success(true)` cho FE để tránh hiển thị lỗi kỹ thuật (NFR-004). FE hiển thị trạng thái "Kết quả đang chờ cập nhật" dựa trên state của phiếu cha (không thay đổi vì đã rollback).

#### Exit Criteria Phase 2

- [ ] `IGoalCycleWarningService` có đúng 2 method signature
- [ ] `UpdateGoalProgressCommandHandler` có 2 catch block riêng biệt: `GoalCycleDetectedException` và `Exception`
- [ ] Handler inject `IGoalCycleWarningService` qua constructor
- [ ] `dotnet build VNR.Service.Evaluation.Application` thành công

---

### Phase 3 — Infrastructure Layer: Service Implementation + Rollup Engine Fix

**Mục tiêu:** Sửa bug cốt lõi trong Rollup Engine và implement GoalCycleWarningService.

**Phụ thuộc:** Phase 1 + Phase 2 hoàn thành.

#### Công việc

| # | Hành động | File | Ghi chú |
|---|-----------|------|---------|
| 3.1 | **[QUAN TRỌNG NHẤT]** Sửa `UpdateParentGoalProgressAsync` | `GoalProgressService.cs` | Sửa 3 điểm: visited logic, throw exception, build cycle chain |
| 3.2 | Tạo `GoalCycleWarningService` | `Services/Evaluation/GoalCycle/GoalCycleWarningService.cs` | Ghi `Eva_GoalCycleWarning` vào DB, gọi `ILoggingService` |
| 3.3 | Đăng ký DI | `ServiceCollectionExtensions.cs` hoặc module DI tương đương | `services.AddScoped<IGoalCycleWarningService, GoalCycleWarningService>()` |

#### Sửa `UpdateParentGoalProgressAsync` — Chi tiết thay đổi

**TRƯỚC (code hiện tại — có lỗi):**
```csharp
private async Task UpdateParentGoalProgressAsync(
    Eva_Goal goal, Guid monthPeriodId, decimal latestActual,
    decimal latestProcess, List<dynamic> attachments,
    HashSet<Guid>? visited = null)
{
    visited ??= new HashSet<Guid>();
    if (!visited.Add(goal.Id))   // ← SAI: kiểm tra node hiện tại
    {
        return;   // ← SAI: không rollback, không log
    }
    // ... xử lý goal ...
    await UpdateParentGoalProgressAsync(goalParent, ..., visited);
}
```

**SAU (code đúng):**
```csharp
private async Task UpdateParentGoalProgressAsync(
    Eva_Goal goal, Guid monthPeriodId, decimal latestActual,
    decimal latestProcess, List<dynamic> attachments,
    HashSet<Guid>? visited = null,
    List<Guid>? visitedChain = null,  // ← THÊM: để build chuỗi vòng
    Guid triggerGoalId = default,
    Guid periodId = default,
    Guid? profileId = null)
{
    visited ??= new HashSet<Guid>();
    visitedChain ??= new List<Guid>();

    // Khởi tạo: thêm node gốc vào tập ở lần gọi đầu tiên
    if (visited.Count == 0)
    {
        visited.Add(goal.Id);
        visitedChain.Add(goal.Id);
    }

    var goalParent = await _goalRepository.GetByIdAsync(goal.ParentId.Value);
    if (goalParent == null) return;

    // ← ĐÚNG: kiểm tra node TIẾP THEO trước khi bước vào
    if (visited.Contains(goalParent.Id))
    {
        // Build cycle chain display: "MT-A → MT-B → MT-C → MT-A"
        var chain = new List<Guid>(visitedChain) { goalParent.Id };
        var chainDisplay = string.Join(" → ", chain.Select(id => id.ToString("N")[..8]));
        // (trong thực tế, nên map sang GoalCode nếu có)

        throw new GoalCycleDetectedException(
            cycleChain: chain,
            cycleChainDisplay: chainDisplay,
            triggerGoalId: triggerGoalId,
            periodId: periodId,
            profileId: profileId
        );
    }

    // Đã an toàn → thêm goalParent vào visited
    visited.Add(goalParent.Id);
    visitedChain.Add(goalParent.Id);

    // ... xử lý goalParent như cũ ...

    if (goalParent.ParentId != null)
    {
        await UpdateParentGoalProgressAsync(
            goalParent, monthPeriodId, lastestParentActual,
            lastestParentProcess, attachments,
            visited, visitedChain, triggerGoalId, periodId, profileId);
    }
}
```

**Lưu ý:** `triggerGoalId`, `periodId`, `profileId` được truyền xuống từ `UpdateGoalProgressAsync` (nơi biết context nhân viên đang nhập).

#### Thiết kế `GoalCycleWarningService`

```csharp
public class GoalCycleWarningService : IGoalCycleWarningService
{
    private readonly IRepository<Eva_GoalCycleWarning> _warningRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILoggingService _loggingService;

    public async Task<Guid> CreateWarningAsync(GoalCycleWarningCreateDto dto, CancellationToken ct)
    {
        Guid warningId = default;
        await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var warning = Eva_GoalCycleWarning.Create(
                dto.CycleChain,
                dto.TriggerSource,
                dto.DetectedAt
            );
            await _warningRepository.AddAsync(warning);
            warningId = warning.Id;
        });

        await _loggingService.LogWarningAsync(
            $"[GoalCycleWarning] Created warningId={warningId}, chain={dto.CycleChain}");

        return warningId;
    }
}
```

#### Exit Criteria Phase 3

- [ ] `UpdateParentGoalProgressAsync` kiểm tra `visited.Contains(goalParent.Id)` TRƯỚC khi xử lý
- [ ] Khi phát hiện vòng, throw `GoalCycleDetectedException` với đầy đủ thông tin (chain, triggerGoalId, periodId, profileId, detectedAt)
- [ ] `visited.Add(goalParent.Id)` chỉ được gọi SAU khi đã qua check (không phải trước)
- [ ] `GoalCycleWarningService.CreateWarningAsync` ghi vào DB trong transaction độc lập
- [ ] `GoalCycleWarningService` đăng ký DI thành công
- [ ] `dotnet build VNR.Service.Evaluation.Infrastructure` thành công

---

### Phase 4 — Database Layer: EF Config + Migration

**Mục tiêu:** Tạo bảng `Eva_GoalCycleWarning` trong cả hai database engine.

**Phụ thuộc:** Phase 1 (entity đã tồn tại).

#### Công việc

| # | Hành động | File | Ghi chú |
|---|-----------|------|---------|
| 4.1 | Thêm `DbSet` vào `VnrHrmDataContext` | `VnrHrmDataContext.cs` (PostgreSQL) | `public DbSet<Eva_GoalCycleWarning> GoalCycleWarnings { get; set; }` |
| 4.2 | Tạo EF Fluent API config | `EntityConfigurations/Evaluation/Eva_GoalCycleWarningConfiguration.cs` | Tên bảng, index, max length cho string columns |
| 4.3 | Tạo migration PostgreSQL | `dotnet ef migrations add AddGoalCycleWarning` | Trong project `VNR.Infrastructure.EntityFramework.PostgreSQL` |
| 4.4 | Thêm `DbSet` vào `VnrHrmDataContext` | `VnrHrmDataContext.cs` (SQL Server) | Tương tự 4.1 |
| 4.5 | Tạo migration SQL Server | `dotnet ef migrations add AddGoalCycleWarning` | Trong project `VNR.Infrastructure.EntityFramework.SqlServer` |
| 4.6 | Chạy migrate | `VNR.Tool.UpdateMigrateDb` | Theo workflow trong `/Docs/DatabaseMigration_Workflow_Guide.md` |

#### Thiết kế bảng `Eva_GoalCycleWarning`

```sql
CREATE TABLE Eva_GoalCycleWarning (
    Id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    CycleChain          VARCHAR(2000) NOT NULL,    -- "MT-A → MT-B → ..."
    TriggerSource       VARCHAR(500)  NOT NULL,    -- "GoalId=..., PeriodId=..., ProfileId=..."
    DetectedAt          TIMESTAMPTZ   NOT NULL,
    Status              SMALLINT      NOT NULL DEFAULT 0,  -- 0=PendingReview, 1=Resolved
    ResolvedByProfileId UUID          NULL,
    ResolvedAt          TIMESTAMPTZ   NULL,
    -- Audit fields từ EntityBase
    CreatedAt           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CreatedBy           UUID          NULL,
    UpdatedAt           TIMESTAMPTZ   NULL,
    UpdatedBy           UUID          NULL,
    IsDeleted           BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE INDEX IX_Eva_GoalCycleWarning_Status ON Eva_GoalCycleWarning(Status);
CREATE INDEX IX_Eva_GoalCycleWarning_DetectedAt ON Eva_GoalCycleWarning(DetectedAt DESC);
```

#### Exit Criteria Phase 4

- [ ] Migration file được tạo thành công cho cả PostgreSQL và SQL Server
- [ ] Migration `Up()` tạo bảng với đúng schema, migration `Down()` drop bảng
- [ ] `dotnet ef database update` chạy thành công trên môi trường dev (PostgreSQL)
- [ ] Bảng xuất hiện đúng trong DB với các index đã thiết kế
- [ ] Không có breaking change với các migration trước

---

### Phase 5 — Testing

**Mục tiêu:** Xác minh tất cả acceptance criteria qua unit test và integration test.

**Phụ thuộc:** Phase 1–4 hoàn thành.

#### Công việc

| # | Test Case | Loại | AC Coverage |
|---|-----------|------|-------------|
| 5.1 | Vòng lặp 3 node: A→B→C→A — phải throw exception, không commit | Unit | FR-002, FR-003, AC-002 |
| 5.2 | Vòng lặp tự liên kết: A→A — phải detect ngay lần đầu | Unit | FR-002, AC-003, NFR-002 |
| 5.3 | Vòng lặp 2 node: A→B→A — phải detect | Unit | FR-002, AC-001 |
| 5.4 | Vòng lặp xuất hiện ở giữa chuỗi dài (A→B→C→D→E→B) — phải detect | Unit | FR-002, NFR-002 |
| 5.5 | Rollup bình thường (không có vòng) — không được ảnh hưởng | Unit | NFR-001 |
| 5.6 | `Eva_GoalCycleWarning` được ghi sau khi phát hiện vòng | Unit/Integration | FR-004 |
| 5.7 | Warning có đủ fields: CycleChain, TriggerSource, DetectedAt, Status=PendingReview | Unit | FR-004, FR-005 |
| 5.8 | ProgressLog của nhân viên không bị ảnh hưởng (không bị rollback) | Integration | FR-006 |
| 5.9 | Visited set tạo mới cho mỗi sự kiện rollup (không share state) | Unit | FR-001 |
| 5.10 | `GoalCycleDetectedException` không phải `DbException` — không bị retry | Unit | Dependency Risk |

#### Cấu trúc test được đề xuất

```
Tests/VNR.Service.Evaluation.Tests/
  Evaluation/GoalProgress/
    GoalProgressService_CycleDetection_Tests.cs  ← Phase 3 unit tests (5.1-5.5, 5.9-5.10)
    GoalCycleWarningService_Tests.cs             ← Phase 3 unit tests (5.6-5.7)
  Integration/
    GoalProgress_CycleDetection_Integration_Tests.cs  ← (5.8)
```

#### Exit Criteria Phase 5

- [ ] Tất cả 10 test case pass
- [ ] Test coverage cho `UpdateParentGoalProgressAsync` ≥ 80%
- [ ] Không có regression test nào fail
- [ ] Integration test xác nhận rollback atomic (ProgressLog gốc không bị xóa)

---

## Tổng hợp file thay đổi

| File | Hành động | Phase |
|------|-----------|-------|
| `VNR.Core.Domain/Enums/GoalCycleWarningStatus.cs` | 🟡 Tạo mới | 1 |
| `VNR.Core.Domain/Exceptions/GoalCycleDetectedException.cs` | 🟡 Tạo mới | 1 |
| `VNR.Core.Domain/Entities/Evaluation/Eva_GoalCycleWarning.cs` | 🟡 Tạo mới | 1 |
| `VNR.Service.Evaluation.Application/.../IGoalCycleWarningService.cs` | 🟡 Tạo mới | 2 |
| `VNR.Service.Evaluation.Application/.../GoalCycleWarningCreateDto.cs` | 🟡 Tạo mới | 2 |
| `VNR.Service.Evaluation.Application/.../UpdateGoalProgressCommandHandler.cs` | 🔴 Sửa | 2 |
| `VNR.Service.Evaluation.Infrastructure/.../GoalProgressService.cs` | 🔴 Sửa | 3 |
| `VNR.Service.Evaluation.Infrastructure/.../GoalCycleWarningService.cs` | 🟡 Tạo mới | 3 |
| `VNR.Infrastructure.EntityFramework.PostgreSQL/VnrHrmDataContext.cs` | 🔴 Sửa | 4 |
| `VNR.Infrastructure.EntityFramework.PostgreSQL/Migrations/AddGoalCycleWarning` | 🟡 Tạo mới | 4 |
| `VNR.Infrastructure.EntityFramework.SqlServer/VnrHrmDataContext.cs` | 🔴 Sửa | 4 |
| `VNR.Infrastructure.EntityFramework.SqlServer/Migrations/AddGoalCycleWarning` | 🟡 Tạo mới | 4 |
| `Tests/.../GoalProgressService_CycleDetection_Tests.cs` | 🟡 Tạo mới | 5 |
| `Tests/.../GoalCycleWarningService_Tests.cs` | 🟡 Tạo mới | 5 |

**Tổng: 5 file sửa, 9 file tạo mới**

---

## Rủi ro & Biện pháp giảm thiểu

| Rủi ro | Mức | Biện pháp |
|--------|-----|-----------|
| Migration conflict giữa PostgreSQL và SQL Server | TRUNG BÌNH | Tạo và test migration trên cả hai trước khi merge; dùng `VNR.Tool.UpdateMigrateDb` theo đúng workflow |
| `ExecuteInTransactionAsync` retry strategy có thể re-throw `GoalCycleDetectedException` | THẤP | `GoalCycleDetectedException` kế thừa `Exception` (không phải `DbException`), EF execution strategy không retry non-transient exceptions |
| Warning ghi thất bại sau rollback (mất cảnh báo) | THẤP | Log `LogWarningAsync` là fallback — dù DB ghi thất bại, vẫn có log text. Cân nhắc retry policy cho `CreateWarningAsync` |
| `visitedChain` parameter làm thay đổi signature `UpdateParentGoalProgressAsync` | THẤP | Method là `private` — không có caller bên ngoài `GoalProgressService`, thay đổi signature an toàn |
| Kafka notification fire khi cycle detected | THẤP | Notification handler hiện đang không active; handler catch `GoalCycleDetectedException` trả về `Success(true)` không trigger Kafka notification flow |
| Test môi trường thiếu DB | THẤP | Unit test dùng mock `IRepository`, `IUnitOfWork`; integration test cần Docker PostgreSQL |

---

## Ước tính nỗ lực

| Phase | Nỗ lực ước tính | Độ phức tạp |
|-------|-----------------|-------------|
| Phase 1 — Domain | 2–3 giờ | Thấp |
| Phase 2 — Application | 2–3 giờ | Thấp–Trung bình |
| Phase 3 — Infrastructure | 4–6 giờ | Cao (sửa bug cốt lõi + implement service) |
| Phase 4 — Database | 1–2 giờ | Thấp–Trung bình |
| Phase 5 — Testing | 4–5 giờ | Trung bình |
| **Tổng** | **13–19 giờ** | |

---

## Acceptance Criteria Mapping

| AC | FR | Phase xử lý |
|----|-----|-------------|
| Vòng 2 node bị detect | FR-002 | Phase 3 (5.3) |
| Vòng N node bị detect | FR-002 | Phase 3 (5.1) |
| Tự liên kết bị detect | FR-002 | Phase 3 (5.2) |
| Toàn bộ transaction rollback | FR-003 | Phase 3 (UnitOfWork + exception) |
| Warning ghi đầy đủ thông tin | FR-004 | Phase 1+3 (entity + service) |
| Warning trạng thái PendingReview | FR-005 | Phase 1 (entity default) |
| ProgressLog không bị ảnh hưởng | FR-006 | Phase 3 (rollback chỉ affect rollup transaction) |
| Audit log được ghi | FR-007 | Phase 3 (LogWarningAsync) |

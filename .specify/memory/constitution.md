<!--
Sync Impact Report
- Version change: NEW (1.0.0 — initial ratification)
- Modified sections: N/A (first write)
- Added sections:
  - Metadata
  - Core Principles (I–VIII)
  - Backend Workflow Rules
  - Frontend Workflow Rules
  - Data & Permission Rules
  - i18n Rules
  - Governance
- Removed sections: N/A
- Downstream files reviewed:
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-specify.md
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-plan.md
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-tasks.md
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-implement.md
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-clarify.md
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-analyze.md
  - ✅ reviewed-no-change vnr-plugin/commands/vnr-checklist.md
  - ✅ reviewed-no-change vnr-plugin/skills/vnr-context-retrieval/SKILL.md
  - ✅ reviewed-no-change vnr-plugin/hooks/pre-flight-check.md
- Follow-up TODOs:
  - Bổ sung RATIFIED_DATE khi team xác nhận ngày thông qua chính thức
-->

# Vnr Frontend — Project Constitution

## Metadata

| Field | Value |
|-------|-------|
| `CONSTITUTION_VERSION` | `1.0.0` |
| `RATIFIED_DATE` | TODO(RATIFIED_DATE): chưa xác định ngày thông qua ban đầu |
| `LAST_AMENDED_DATE` | `2026-04-03` |
| `SCOPE` | Frontend Angular repo (`./Frontend/`) + Backend HRM9 (`./HRM9/Main/Source/`) |
| `DOMAIN` | Human Resources Management (HRM) — Quản lý Nhân sự |

---

## Core Principles

### I. Database-First (NON-NEGOTIABLE)

Database schema và Stored Procedures là **nguồn sự thật duy nhất**. Không được dùng EF Code-First migrations. Mọi thay đổi schema PHẢI là file `.sql` thủ công.

- **MUST** viết file migration tại `HRM.Presentation.Main/Updates/Scripts/SQL/[YYYYMMDD_No].sql`
- **MUST** lưu Stored Procedure tại `HRM.Presentation.Main/Updates/Stores/SQL2012/[stored_proc_name].sql`
- **MUST NOT** dùng `Add-Migration`, `Update-Database`, hoặc bất kỳ Code-First command nào

### II. Stored Procedure Authority

Heavy business logic và data aggregation **MUST** xử lý qua Stored Procedures.

- **MUST** dùng SP cho mọi query list/grid phức tạp — không viết LINQ thay thế SP
- **SHOULD** dùng LINQ chỉ cho in-memory filtering nhẹ hoặc CRUD đơn giản
- SP nhận `@UserLogin` và tự xử lý data permission filter nếu liên quan đến nhân viên

### III. Data Permission Mandatory (NON-NEGOTIABLE)

Mọi query liên quan đến dữ liệu nhân viên (`Hre_Profile`) **MUST** áp dụng data permission filter.

- **MUST** gọi `unitOfWork.GetDataPermission<Hre_Profile>(userLogin)` trước khi query nhân viên
- **MUST** pass `@UserLogin` vào SP nếu SP đã implement `Get_Data_Permission_New`
- **MUST NOT** skip data permission filter ở tầng business logic
- **MUST NOT** implement data filtering ở frontend — đây là server-side responsibility
- SP trả về rỗng = user không có quyền → controller trả empty result, không raise lỗi

### IV. vnr-module First (PRIORITY #1 cho UI)

Mọi màn hình Angular mới **MUST** ưu tiên `vnr-module` (design system nội bộ).

**Thứ tự ưu tiên bắt buộc:**
1. `vnr-module` — luôn dùng trước
2. `ng-zorro-antd` (NG-Zorro) — fallback khi `vnr-module` không có component phù hợp
3. `Kendo UI for Angular` — chỉ dùng cho trường hợp đặc thù nặng (grid cực lớn, scheduler, export nặng)

- **MUST** import `vnr-module` qua `VnrModuleModule` (re-exported từ `@shared-module`)
- Màn hình tham chiếu chuẩn: `projects/recruitment/src/app/pages/rec-vacancies/rec-vacancies-list/`

### V. Separation of Concerns

- **MUST** giữ Admin MVC (legacy) hoàn toàn cách ly với Angular MFEs
- **MUST** tách HTTP calls (API service) và business logic (facade service) thành 2 lớp riêng biệt
- **MUST** phân tách Container (smart) và Presentational (dumb) components trong mỗi feature page
- Container chứa state, API calls, ngOnInit logic; Presentational chỉ nhận `@Input/@Output`

### VI. Micro-frontend Independence

Mỗi MFE là một Angular remote app độc lập expose qua Webpack Module Federation.

- **MUST** mỗi MFE expose một NgModule qua `remoteEntry.js`
- **MUST** dùng `loadRemoteModule()` để load remote — không import trực tiếp giữa các MFE
- **MUST** khai báo singleton (Angular core, NgRx, RxJS, ngx-translate) trong `shared` của webpack config
- Shell (port 4200) là host; remotes chạy port 4201–4210

### VII. Speckit SDLC

Mọi feature mới **MUST** đi qua workflow: **Specify → Plan → Tasks → Implement**.

- **MUST** có `spec.md` trước khi plan
- **MUST** có `plan.md` trước khi tạo tasks
- **MUST** có `tasks.md` trước khi implement
- Không được implement trực tiếp mà không qua các bước trên

### VIII. Reflection Safety

Hệ thống backend sử dụng Reflection rộng rãi (EF6 entity mapping, CalcEngine, Import/Export).

- **MUST** kiểm tra `GetProperty`, `GetValue`, `SetValue`, `typeof(...)` trong codebase trước khi đổi tên property, field hoặc class
- **MUST NOT** đổi tên property của EF6 entity mà không kiểm tra Reflection impact

---

## Backend Workflow Rules

### Controller Pattern

- **MUST** kế thừa `BaseController` (service layer) hoặc `MainBaseController` (main web) — không kế thừa `Controller` trực tiếp
- **MUST** dùng `GetListDataAndReturn<TModel, TEntity, TSearch>(request, model, "sp_name")` cho mọi grid/list action — không tự fetch data trong controller
- **MUST** dùng `BaseApiController` + `IApiResult<T>` cho ServiceCenter modules mới

### Data Access Pattern

- **MUST** wrap mọi data access trong `using (var context = new VnrHrmDataContext())` + `IUnitOfWork`
- **MUST NOT** dùng EF DbContext trực tiếp ngoài UnitOfWork
- **MUST NOT** dùng IoC container (Autofac, Unity) — service được `new` thủ công

### Soft Delete

- **MUST** dùng soft delete: `entity.IsDelete = true`, không xóa vật lý
- **MUST** filter `IsDelete IS NULL` trong mọi query — không dùng `IsDelete == false` hay bỏ qua
- `CreateQueryable<TEntity>` trong UnitOfWork tự động áp dụng IsDelete filter

### Audit Fields

- **MUST NOT** tự set `DateCreate`, `UserCreate`, `DateUpdate`, `UserUpdate` trong code
- UnitOfWork tự động set qua Reflection trong `OnExecuteModifyData` trước `SaveChanges()`

### Function Permission (Backend)

- **MUST** dùng `UnitOfWork.CheckPermissionWithCache(userID, PrivilegeType.X, "ResourceKey")` — không hardcode logic thay thế
- **MUST** thêm resource mới vào `EnumResource.cs` (enum `OtherResource`, format `[Module]__[ResourceKey]`) trước khi insert `Sys_Resource` record trên DB
- **MUST NOT** tạo enum hoặc constant file mới — chỉ thêm vào `EnumConstant.cs`, `ConstantDisplay.cs`, `ConstantMessage.cs` hiện có

### Response Format

- **MUST** dùng `.ToDataSourceResult(request)` cho Kendo Grid response (MVC)
- **MUST** dùng `Result(data)` / `ResultKendoGrid(requestModel, data)` cho ServiceCenter API
- ServiceCenter response envelope: `{ status, code, message, data }`

---

## Frontend Workflow Rules

**Golden rule**Khi implement frontend, đọc file `vnr-plugin/standards/05-internal-fe-framework-and-flow.md` để hiểu và ưu tiên dùng framework nội bộ (vnr-module). Lưới dữ liệu phải dùng các component liên quan đến lưới trong bộ vnr-module (ví dụ: vnr-grid[-*], vnr-toolbar), các form control phải dùng bộ control của vnr-module (ví dụ: vnr-button, vnr-select, vnr-input).

### Component Conventions

- **MUST** dùng `UntypedFormBuilder` / `UntypedFormGroup` — không dùng strongly-typed FormBuilder
- **MUST** unsubscribe bằng `destroy$` Subject pattern:
  ```typescript
  destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void { this.destroy$.next(true); this.destroy$.complete(); }
  ```
- **MUST** dùng hash-based routing (`useHash: true`)

### API + Facade Pattern

```
api.service.ts     → chỉ HTTP calls, trả Observable<any>
facade.service.ts  → response transformation, map(res => res['Data'])
```

- **MUST** tách API layer (HTTP only) và Facade layer (business logic + transformation)
- **MUST** extract response qua `.map(res => res['Data'])` trong facade — API responses wrap trong property `Data`

### Permission (Frontend)

- **MUST** dùng `*vnrPermission="'key'; role:['View']"` cho Portal v3 (AUTH_API_URL mode)
- **MUST** dùng `*checkPermission="'key'"` hoặc `*vnrPermission` cho Portal v2 (isHrmPortal)
- **MUST** thêm `canActivate: [AuthGuard]` và `data: { permission: 'ScreenKey' }` vào mọi route nhạy cảm
- **MUST** dùng permission key từ enum file (`permission.enum.ts`, `screen-permission.enum.ts`) — không dùng string literal trực tiếp trong template
- **MUST NOT** implement data filtering ở frontend — server đã lọc trước khi response
- **MUST NOT** gọi `checkPermissionByKey$` hay `checkScreenPermission` trong vòng lặp (mỗi call hit server)

### NgRx Conventions

- **MUST** dùng class-based actions (không dùng `createAction`):
  ```typescript
  export const LOGIN = '[Auth] Login';
  export class Login implements Action { readonly type = LOGIN; constructor(public payload: any) {} }
  ```
- Root store slices: `user`, `settings`, `systems` — chỉ `UserEffects` tồn tại ở root level
- Feature modules có thể thêm local store slices

### Module Federation

- **MUST** khai báo tất cả singleton modules trong `shared` (webpack config) — Angular core, NgRx, RxJS, ngx-translate, ng-zorro-antd
- **MUST NOT** import trực tiếp giữa các MFE — chỉ dùng `@shared`, `@shared-module`, `@shared-components`, `@shared-resources`

---

## Data & Permission Rules

### PrivilegeType Bitfield

| Bit | Giá trị | Ý nghĩa |
|-----|---------|---------|
| View | 1 | Xem |
| Delete | 2 | Xóa |
| Create | 4 | Tạo mới |
| Modify | 8 | Sửa |
| Export | 64 | Xuất file |
| Import | 128 | Nhập file |
| Template | 512 | Template |
| ChangeColumn | 1024 | Cấu hình cột grid |
| Access | 100 | Truy cập (FE only) |

- Frontend lưu PrivilegeNumber dưới dạng chuỗi hex 16 ký tự (ví dụ: `"000000000000004f"`)
- **MUST** dùng enum string key (`'View'`, `'Modify'`) khi gọi `approvePermission` — không dùng số trực tiếp

### Permission Modes (FE)

| Chế độ | Điều kiện | Source |
|--------|-----------|--------|
| Portal v2 (isHrmPortal) | `!AUTH_API_URL` | `AngularPortal_UserPermission` → flat string[] |
| Portal v3 (SC mode) | `AUTH_API_URL` có giá trị | `TestPermission` → dict `{ key: hexString }` |

### Authentication Flow

```
App init → getSession() (decode JWT) → dispatch LoginPotal
         → loadPermissions$() → VnrPermissionState.setPermissions()/setPermissionsData()
         → AuthGuard.canActivate() → check permission key
```

---

## i18n Rules

### Backend Legacy MVC

- **MUST** thêm key display/label vào `HRM.Infrastructure.Utilities/ConstantDisplay.cs`
- **MUST** thêm key thông báo vào `HRM.Infrastructure.Utilities/ConstantMessage.cs`
- **MUST** thêm translation vào cả `Lang_VN.xml` VÀ `Lang_EN.xml` cùng lúc
- `Lang_[cc]_Spec.xml` có độ ưu tiên cao hơn file gốc (admin có thể override)
- **MUST NOT** tạo file XML ngôn ngữ mới

### Backend Service Center

- **MUST** thêm translation vào cả `LANG_VN.XML` VÀ `LANG_EN.XML` tại `HRM.SC.Service.Api/Resources/Settings/`

### Frontend Angular

- **MUST** chỉnh sửa TypeScript files (`VN.ts`, `EN.ts`) tại `projects/shared-resources/[domain]/i18n/` cho text thuộc micro-frontend
- **MUST NOT** dùng global JSON (`src/assets/i18n/`) cho feature-level text — global chỉ dành cho shell/layout/common
- **MUST** thêm key vào cả `VN.ts` VÀ `EN.ts` cùng lúc
- Key format trong template: `'[module].[key]'` — ví dụ: `'recruitment.someKey'`
- Ngôn ngữ hỗ trợ: **VN** và **EN** (CN.ts tồn tại nhưng không active)

---

## Governance

1. **Constitution là nguồn sự thật cao nhất** — supersedes mọi convention ngầm định khác trong codebase.
2. **Sửa đổi constitution** — yêu cầu: lý do rõ ràng + tăng version đúng semantic versioning + cập nhật `LAST_AMENDED_DATE`.
3. **MAJOR**: thay đổi phá vỡ quy tắc cũ, thay đổi lớn về governance / principles.
4. **MINOR**: thêm principle mới hoặc mở rộng đáng kể quy định hiện có.
5. **PATCH**: chỉnh câu chữ, làm rõ nội dung, sửa định dạng.
6. **Mọi PR** phải kiểm tra tuân thủ constitution trước khi merge.
7. **HIGH/CRITICAL risk** từ impact analysis → phải báo cáo user trước khi tiến hành thay đổi.
8. Sử dụng `/vnr-specify` cho feature mới, `/vnr-plan` cho technical planning, `/vnr-tasks` cho task breakdown.

---

**Version**: `1.0.0` | **Ratified**: TODO | **Last Amended**: `2026-04-03`

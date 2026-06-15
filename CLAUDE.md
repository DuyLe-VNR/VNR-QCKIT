# AutomationProcess — Project Conventions

## vnr-qckit Path Conventions

Khi sử dụng các skill `vnr-qckit` (qc_auto_test, qc_generate, qc_map_flow, v.v.), tuân theo cấu trúc thư mục sau:

| Loại file | Đường dẫn |
|-----------|-----------|
| File spec Playwright (`.spec.ts`) | `.specify/tests/playwright/{pbi}/` |
| File dữ liệu giả (`datafake.json`) | `.specify/tests/playwright/{pbi}/` |
| Kết quả auto test (testcase.md, HISTORY.md, v.v.) | `.specify/specs/{pbi}/` |

**Ví dụ với PBI-123:**
- Spec file: `.specify/tests/playwright/PBI-123/login.spec.ts`
- Datafake: `.specify/tests/playwright/PBI-123/datafake.json`
- Kết quả test: `.specify/specs/PBI-123/testcase.md`

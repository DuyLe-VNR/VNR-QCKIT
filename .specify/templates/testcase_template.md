# Testcase Template - {{PBI_ID}} - {{FEATURE_CODE}}

> **Tính năng:** {{FEATURE_NAME}}  
> **Group:** {{GROUP}}  
> **Alias:** {{ALIAS}}  
> **Nguồn PBI/User Story:** {{PBI_ID}}  
> **Người tạo:** {{AUTHOR}}  
> **Ngày tạo:** {{CREATED_DATE}}  
> **Môi trường:** {{ENVIRONMENT}}  
> **Tổng TC:** {{TOTAL_TC}} · **Automation:** {{AUTO_TC}} · **Manual:** {{MANUAL_TC}} · **Chưa test:** {{NOT_RUN_TC}} · **Pass:** {{PASS_TC}} · **Fail:** {{FAIL_TC}}

---

## 1. Phạm Vi Kiểm Thử

| Hạng mục | Nội dung |
| --- | --- |
| Mục tiêu | {{TEST_OBJECTIVE}} |
| Trong phạm vi | {{IN_SCOPE}} |
| Ngoài phạm vi | {{OUT_OF_SCOPE}} |
| Điều kiện bắt đầu | {{ENTRY_CRITERIA}} |
| Điều kiện kết thúc | {{EXIT_CRITERIA}} |
| Tài liệu tham chiếu | {{REFERENCE_DOCS}} |

---

## 2. Tiền Điều Kiện Chung

- User có quyền truy cập: `{{ROLE_OR_PERMISSION}}`
- Alias màn hình: `{{ALIAS}}`
- Dữ liệu nền đã tồn tại: `{{MASTER_DATA}}`
- Trạng thái hệ thống trước khi test: `{{SYSTEM_STATE}}`

---

## 3. Test Data Chung

| Nhóm dữ liệu | Field | Giá trị mẫu | Ghi chú |
| --- | --- | --- | --- |
| {{DATA_GROUP}} | {{FIELD_NAME}} | `{{VALUE}}` | {{NOTE}} |
| {{DATA_GROUP}} | {{FIELD_NAME}} | `{{VALUE}}` | {{NOTE}} |

---

## 4. Mục Lục Testcase

| TC ID | Tên testcase | Loại | Auto/Manual | Độ ưu tiên | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| [{{PBI_ID}}_{{GROUP}}_{{FEATURE_CODE}}_001](#tc-001) | {{TC_001_NAME}} | Happy Path | Automation | Critical | Chưa test |
| [{{PBI_ID}}_{{GROUP}}_{{FEATURE_CODE}}_002](#tc-002) | {{TC_002_NAME}} | Validation | Automation | High | Chưa test |
| [{{PBI_ID}}_{{GROUP}}_{{FEATURE_CODE}}_003](#tc-003) | {{TC_003_NAME}} | Negative | Manual | Medium | Chưa test |

---

<a id="tc-001"></a>
## {{PBI_ID}}_{{GROUP}}_{{FEATURE_CODE}}_001

**Tên:** {{TC_001_NAME}}  
**Loại:** Happy Path  
**Group:** {{GROUP}} | **Alias:** {{ALIAS}} | **Tính năng:** {{FEATURE_CODE}}  
**Độ ưu tiên:** Critical  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation  
**Người thực hiện:** {{TESTER}}  
**Ngày thực hiện:** {{EXECUTED_DATE}}

### Tiền Điều Kiện

- {{PRECONDITION_1}}
- {{PRECONDITION_2}}

### Test Data

| Field | Giá trị |
| --- | --- |
| {{FIELD_NAME}} | `{{VALUE}}` |
| {{FIELD_NAME}} | `{{VALUE}}` |

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở màn hình `{{SCREEN_NAME}}` bằng alias `{{ALIAS}}` |  | Màn hình `{{SCREEN_NAME}}` hiển thị đúng |
| 2 | Nhấn nút `{{ACTION_BUTTON}}` |  | Form/Popup `{{FORM_NAME}}` hiển thị |
| 3 | Nhập/chọn thông tin bắt buộc | {{INPUT_DATA}} | Dữ liệu được nhập/chọn đúng |
| 4 | Nhấn `Lưu` |  | Hệ thống hiển thị thông báo `{{SUCCESS_MESSAGE}}` |
| 5 | Kiểm tra dữ liệu sau khi lưu | {{ASSERTION_DATA}} | Record mới hiển thị đúng trên danh sách/chi tiết |

### Kết Quả Thực Tế

{{ACTUAL_RESULT}}

### Bằng Chứng

| Loại | Đường dẫn/Ghi chú |
| --- | --- |
| Screenshot | {{SCREENSHOT_PATH}} |
| Video | {{VIDEO_PATH}} |
| Log | {{LOG_PATH}} |

### Ghi Chú

{{NOTE}}

---

<a id="tc-002"></a>
## {{PBI_ID}}_{{GROUP}}_{{FEATURE_CODE}}_002

**Tên:** {{TC_002_NAME}}  
**Loại:** Validation  
**Group:** {{GROUP}} | **Alias:** {{ALIAS}} | **Tính năng:** {{FEATURE_CODE}}  
**Độ ưu tiên:** High  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Automation

### Tiền Điều Kiện

- {{PRECONDITION}}

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | Mở màn hình `{{SCREEN_NAME}}` |  | Màn hình hiển thị đúng |
| 2 | Thực hiện thao tác `{{ACTION}}` | {{INVALID_OR_MISSING_DATA}} | Hệ thống không cho lưu/thực hiện |
| 3 | Kiểm tra thông báo validation |  | Hiển thị đúng thông báo `{{VALIDATION_MESSAGE}}` |

### Kết Quả Thực Tế

{{ACTUAL_RESULT}}

---

<a id="tc-003"></a>
## {{PBI_ID}}_{{GROUP}}_{{FEATURE_CODE}}_003

**Tên:** {{TC_003_NAME}}  
**Loại:** Negative / Edge Case  
**Group:** {{GROUP}} | **Alias:** {{ALIAS}} | **Tính năng:** {{FEATURE_CODE}}  
**Độ ưu tiên:** Medium  
**Trạng thái:** Chưa test  
**Cờ thực thi:** Manual

### Tiền Điều Kiện

- {{PRECONDITION}}

### Các Bước Thực Hiện

| # | Hành động | Test Data | Kết quả mong đợi |
| --- | --- | --- | --- |
| 1 | {{STEP_ACTION}} | {{TEST_DATA}} | {{EXPECTED_RESULT}} |
| 2 | {{STEP_ACTION}} | {{TEST_DATA}} | {{EXPECTED_RESULT}} |
| 3 | {{STEP_ACTION}} | {{TEST_DATA}} | {{EXPECTED_RESULT}} |

### Kết Quả Thực Tế

{{ACTUAL_RESULT}}

---

## 5. Checklist Review

| Tiêu chí | Đạt/Không đạt | Ghi chú |
| --- | --- | --- |
| TC bao phủ happy path chính | {{YES_NO}} | {{NOTE}} |
| TC bao phủ validation bắt buộc | {{YES_NO}} | {{NOTE}} |
| TC bao phủ negative/edge case | {{YES_NO}} | {{NOTE}} |
| Test data đủ rõ để chạy lại | {{YES_NO}} | {{NOTE}} |
| Expected result có thể assert được | {{YES_NO}} | {{NOTE}} |
| Phân loại Automation/Manual hợp lý | {{YES_NO}} | {{NOTE}} |

---

## 6. Quy Ước Placeholder

| Placeholder | Ý nghĩa |
| --- | --- |
| `{{PBI_ID}}` | Mã PBI/User Story, ví dụ `15552` |
| `{{GROUP}}` | Nhóm chức năng hoặc section, ví dụ `CAT`, `HRE`, `Payroll` |
| `{{ALIAS}}` | Alias màn hình trong `url-aliases.md`, ví dụ `cat_bank` |
| `{{FEATURE_CODE}}` | Mã tính năng viết liền không dấu, ví dụ `CHUYENKHO` |
| `{{FEATURE_NAME}}` | Tên tính năng đầy đủ bằng tiếng Việt |
| `{{ALIAS}}` | Alias trong `url-aliases.md` |
| `{{TC_001_NAME}}` | Tên testcase ngắn gọn, thể hiện hành vi cần kiểm thử |
| `{{ACTUAL_RESULT}}` | Kết quả thực tế sau khi chạy test |
| `{{YES_NO}}` | Điền `Đạt`, `Không đạt`, hoặc `N/A` |

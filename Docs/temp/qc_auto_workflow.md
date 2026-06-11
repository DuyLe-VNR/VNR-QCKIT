# Quy trình QC Auto

## Lệnh generate testcase

```bash
/qc-generate {PBI_ID}
```

**Input:**

- `PBI_ID`: số PBI
- `PLUGIN_DIR`: đường dẫn plugin

---

## Bước 1 – Đọc tài liệu song song

### Input đọc vào

| Tài liệu / Thư mục | Ghi chú |
|---|---|
| `.specify/specs/{PBI_ID}/spec.md` | Bắt buộc |
| `.specify/specs/{PBI_ID}/plan.md` | Nếu có |
| `.specify/memory/constitution.md` | Nếu có |
| `.specify/memory/domain-knowledge.md` | Nếu có |
| `.specify/tests/knowledge/_IMPACT_INDEX.json` | Mapping tới `business/**/*.md` và `impact/BL-*.md` |
| `.specify/specs/{PBI_ID}/assets/*.png/jpg` | UI mockup |
| `.specify/tests/data-catalog/categories/` | Vendors, customers, units... |
| `.specify/memory/flow-index.md` | Flow index |
| `.specify/memory/flow-{MA_PHAN_HE}.md` | Bắt buộc |
| Figma link | Nếu có trong `spec.md` |

### Điều kiện dừng

- Nếu `spec.md` không có → **Dừng**.
- Nếu flow file không có → **Dừng**, hỏi user tên màn hình.
- Nếu màn hình không có trong `sub-system-map.json` → **Dừng**, hỏi user.

### Output sẵn sàng

- `testcase.md`
- `datafake.json`
- `knowledge/*.md`

---

## User chạy QC Auto

```bash
/qc-auto {PBI_ID}
```

---

## Bước 0 – Khởi tạo song song

Thực hiện song song:

- **A:** Kiểm tra `testcase.md` tồn tại.
- **B:** Tạo `REPORT_DIR` và `.pipeline_ctx`.

### Luồng xử lý

```text
MISSING -> Xóa REPORT_DIR, DỪNG
EXISTS  -> Tiếp tục
```

---

## Bước 1 – Chạy nhóm ưu tiên

### Chạy lệnh

```bash
qc_parse = qc_spec + playwright
- grp @uutien-* --workers=1
- qc_triage --append run-log
```

### Input đọc song song

| Input | Mục đích |
|---|---|
| `.specify/test/.env` | Lấy ENV |
| `.ui-aliases.md` | Resolve `ALIAS=URL` |
| `.specify/tests/pages/BasePage.ts` | Luôn đọc |
| `.specify/tests/pages/url-page-map` | Kiểm tra Page Class |

### Tính toán

| Biến | Cách tính |
|---|---|
| `RELATIVE_URL` | Lookup `url-aliases.md` theo ENV |
| `SPEC_FILE` | `.specify/tests/script_auto/{PBI_ID}.spec.ts` |
| `DATA_FILE` | `.specify/tests/testdata/{PBI_ID}.json` |

### Kết quả có thể xảy ra

- `PASS`
- `APP_BUG`
- `INFRA`
- `SCRIPT_ISSUE`

### Luồng xử lý khi có `SCRIPT_ISSUE`

```text
SCRIPT_ISSUE
    |
    v
FIX_ROUND > 1?
    |-- Có  -> QC_AUTO_FAILED
    |-- Còn vòng
            |
            v
        qc_debug (sửa Page Object + spec)
            |
            v
        /qc_run_rerun
            |
            |-- PASS / APP_BUG / INFRA -> Tiếp tục
            |-- SCRIPT_ISSUE còn       -> QC_AUTO_FAILED
```

---

## Bước 2 – Chạy phần còn lại

### Cách chạy

- Batch 3 test case song song.
- Lặp đến hết toàn bộ test case còn lại.
- Sau mỗi batch chạy `qc_triage`.
- Nếu là `APP_BUG` hoặc `INFRA` thì ghi log và tiếp tục.

### Luồng xử lý

```text
Không SCRIPT_ISSUE
    -> Tiếp tục

Có SCRIPT_ISSUE
    |
    v
FIX_ROUND > 1?
    |-- Có  -> QC_AUTO_FAILED
    |-- Còn vòng
            |
            v
        qc_debug (gom TẤT CẢ SCRIPT_ISSUE, gọi 1 lần)
            |
            v
        /qc_run_rerun
            |
            |-- PASS / APP_BUG / INFRA -> Tiếp tục
            |-- SCRIPT_ISSUE còn       -> QC_AUTO_FAILED
```

---

## Bước 5 – Lọc happy path

```bash
/qc-filter_happy
```

Sinh file:

```text
help.md
```

Nội dung gồm:

- Happy Path
- Auto

---

## Báo cáo cuối

Sau khi hoàn tất pipeline, sinh/cập nhật các file:

- `pipeline-report.html`
- `pipeline-summary.json`
- Cập nhật `testcase.md`
- Mở Playwright report tại port `9324`

---

## Tổng quan luồng

```mermaid
flowchart TD
    A[User chạy /qc-generate PBI_ID] --> B[Đọc tài liệu song song]
    B --> C{Đủ tài liệu bắt buộc?}
    C -- Không --> C1[Dừng và hỏi user nếu cần]
    C -- Có --> D[Sinh output: testcase.md, datafake.json, knowledge/*.md]

    D --> E[User chạy /qc-auto PBI_ID]
    E --> F[Bước 0: Kiểm tra testcase.md và tạo REPORT_DIR + pipeline_ctx]
    F --> G{testcase.md tồn tại?}
    G -- Không --> G1[Xóa REPORT_DIR và dừng]
    G -- Có --> H[Bước 1: Chạy nhóm ưu tiên]

    H --> I{Có SCRIPT_ISSUE?}
    I -- Không --> J[Tiếp tục]
    I -- Có --> K{FIX_ROUND > 1?}
    K -- Có --> K1[QC_AUTO_FAILED]
    K -- Không --> L[qc_debug sửa Page Object + spec]
    L --> M[/qc_run_rerun]
    M --> N{Còn SCRIPT_ISSUE?}
    N -- Có --> K1
    N -- Không --> J

    J --> O[Bước 2: Chạy các test case còn lại theo batch]
    O --> P{Có SCRIPT_ISSUE?}
    P -- Không --> Q[Bước 5: /qc-filter_happy]
    P -- Có --> R{FIX_ROUND > 1?}
    R -- Có --> K1
    R -- Không --> S[qc_debug gom tất cả SCRIPT_ISSUE]
    S --> T[/qc_run_rerun]
    T --> U{Còn SCRIPT_ISSUE?}
    U -- Có --> K1
    U -- Không --> Q

    Q --> V[Sinh help.md]
    V --> W[Báo cáo cuối]
    W --> X[pipeline-report.html, pipeline-summary.json, cập nhật testcase.md, mở Playwright report]
```

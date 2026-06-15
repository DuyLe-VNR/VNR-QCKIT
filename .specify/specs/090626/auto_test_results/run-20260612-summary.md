# Run Summary — 090626

> Chạy lúc    : 2026-06-12T00:00:00
> Engine      : playwright-cli (execution) + playwright-mcp (discovery)
> Login check : ⛔ FAILED — user.json không tồn tại
> Spec        : specs/090626.spec.ts — **ĐÃ SINH** (chưa thực thi)

---

## Lý do dừng

```
⛔ Không tìm thấy .specify/tests/user.json
   → Login check không thể thực hiện
   → Toàn bộ 10 TC Auto chuyển sang trạng thái ⏸ NOT_RUN
```

---

## Thứ tự sẽ chạy (khi user.json có sẵn)

| # | TC ID | Nhóm | Độ ưu tiên | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| 1 | 090626_CAT_CATLEAVEDAY_001 | CAT | p0 (Critical) | ⏸ NOT_RUN | Cần BS-01 deployed + selector mới |
| 2 | 090626_CAT_CATLEAVEDAY_002 | CAT | p0 (Critical) | ⏸ NOT_RUN | Cần BS-01 deployed + selector mới |
| 3 | 090626_ATT_LEAVEDAY_001 | ATT | p0 (Critical) | ⏸ NOT_RUN | Cần NTN001, người duyệt |
| 4 | 090626_ATT_LEAVEDAY_002 | ATT | p0 (Critical) | ⏸ NOT_RUN | Cần precondition từ TC-001 |
| 5 | 090626_ATT_LEAVEDAY_003 | ATT | p0 (Critical) | ⏸ NOT_RUN | Cần NVN001 |
| 6 | 090626_ATT_LEAVEDAY_004 | ATT | p0 (Critical) | ⏸ NOT_RUN | Cần precondition từ TC-001 |
| 7 | 090626_ATT_LEAVEDAY_005 | ATT | p0 (Critical) | ⏸ NOT_RUN | Cần 3 đơn E_APPROVED sẵn |
| 8 | 090626_CAT_CATLEAVEDAY_003 | CAT | p0 (High) | ⏸ NOT_RUN | |
| 9 | 090626_ATT_LEAVEDAY_006 | ATT | p1 (High) | ⏸ NOT_RUN | Cần limit đã đạt tháng 06 |
| 10 | 090626_ATT_LEAVEDAY_012 | ATT | p2 (Medium) | ⏸ NOT_RUN | Regression |

*TC 090626_CAT_CATLEAVEDAY_004 bị skip do 100% phụ thuộc selector mới BS-01*

---

## Tổng kết

- ✅ PASSED  : 0
- ❌ FAILED  : 0
- ⏭ SKIPPED : 0
- ⏸ NOT_RUN : 10

---

## Việc cần làm để chạy được

### Bắt buộc ngay

1. **Tạo user.json** — đăng nhập tay 1 lần:
   ```bash
   cd .specify/tests
   npx playwright codegen --save-storage=user.json https://long-main.vnrlocal.com
   # Đăng nhập với support / Vnr@123 → đóng browser
   ```

2. **Điền người duyệt** vào `datafake.json`:
   ```json
   "nguoi_duyet_dau": "<tên người duyệt thực tế>",
   "nguoi_duyet_cuoi": "<tên người duyệt thực tế>"
   ```

3. **Tạo NV test** trong hệ thống nếu chưa có:
   - NTN001 — Nữ (dùng cho TC_001–006)
   - NVN001 — Nam (dùng cho TC_003, TC_012)

### Sau khi deploy BS-01

4. **Discovery 3 selector mới** (ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth):
   - Chạy `/qc_detect_component cat_leave_day_type`
   - Chạy `/qc_map_flow cat_leave_day_type` để update `CatLeaveDayTypeLocator.ts`
   - Bỏ comment `// [TODO]` trong spec.ts

---

## Output sinh trong lần này

| File | Mô tả |
| --- | --- |
| `specs/090626.spec.ts` | Spec đầy đủ cấu trúc — 10 TC, có comment TODO cho 3 selector mới |
| `testcase.md` | Mục 4 cập nhật thêm cột ⭐ |
| `HISTORY.md` | Append lần chạy #4 |

---

## Rerun sau khi đủ điều kiện

```bash
playwright-cli load_storage_state ".specify/tests/user.json"
playwright-cli run_test ".specify/specs/090626/auto_test_results/specs/090626.spec.ts"

# Chạy từng nhóm
playwright-cli run_test "specs/090626.spec.ts" --grep "090626_CAT_CATLEAVEDAY"
playwright-cli run_test "specs/090626.spec.ts" --grep "090626_ATT_LEAVEDAY"
playwright-cli run_test "specs/090626.spec.ts" --grep "@p0"
```

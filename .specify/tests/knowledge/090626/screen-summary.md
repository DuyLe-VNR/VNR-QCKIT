# Screen Summary — PBI 090626: Phép kinh nguyệt (Menstrual Leave)

> PBI: 090626  
> Sinh ngày: 2026-06-12  
> Spec: `.specify/specs/090626/spec.md`

---

## Mục Đích

Thêm tính năng nghỉ kinh nguyệt cho NV nữ theo Điều 137 BLLĐ 2019:
- Admin cấu hình loại ngày nghỉ với 3 field mới (ApplyGender, IsRequireConsecutive, MaxConsecutiveDaysPerMonth)
- Hệ thống tự động validate 3 rule khi NV/BPNS đăng ký: gender filter, consecutive days, monthly limit
- Dropdown loại nghỉ filter theo giới tính NV

---

## Bảng URL

| Alias | Path | Mô tả |
| --- | --- | --- |
| `cat_leave_day_type` | /Cat_LeaveDayType/Index | DS Loại ngày nghỉ — Admin cấu hình |
| `cat_leave_day_type_create` | /Cat_LeaveDayType/Create | Form tạo mới loại ngày nghỉ |
| `att_leave_day` | /Att_LeaveDay/Index | DS Ngày nghỉ — BPNS đăng ký hộ |

---

## Luồng Chính

### BS-01: Admin cấu hình loại KN
1. Admin vào `cat_leave_day_type` → Tạo mới
2. Nhập thông tin cơ bản: LeaveDayTypeName, Code
3. Cấu hình 3 field mới: ApplyGender=Female, IsRequireConsecutive=true, MaxConsecutiveDaysPerMonth=N
4. Lưu → record tạo thành công

### BS-02: Đăng ký ngày nghỉ KN (ATT03.02 Web Main)
1. BPNS mở `att_leave_day` → Tạo mới
2. Chọn NV nữ → dropdown loại nghỉ hiển thị loại KN
3. Chọn loại KN, ngày, người duyệt → Lưu
4. System validate Rule 1 (gender) → Rule 2 (consecutive) → Rule 3 (monthly limit)
5. Pass → Lưu E_APPROVED trực tiếp (ATT03.02 bypass workflow)

---

## Business Rules (BR)

| BR | Mô tả | Áp dụng |
| --- | --- | --- |
| BR-01 Gender | ApplyGender=Female → chỉ NV nữ được đăng ký | ATT03.01, ATT03.02 |
| BR-02 Consecutive | IsRequireConsecutive=true → ngày mới phải = LastApprovedDate+1 (nếu LastApprovedDate≠null) | ATT03.01, ATT03.02 |
| BR-03 Monthly Limit | ApprovedCount trong tháng < MaxConsecutiveDaysPerMonth | ATT03.01, ATT03.02 |
| BR-04 Counter Reset | Filter by tháng dương lịch → tháng mới counter=0 | ATT03.01, ATT03.02 |
| BR-05 Status Only | Chỉ đơn E_APPROVED tính vào LastApprovedDate và ApprovedCount | All |

---

## Error Messages

| Message | Điều kiện |
| --- | --- |
| *"Loại ngày nghỉ {TenLoai} chỉ áp dụng cho nhân viên nữ"* | Rule 1 fail |
| *"Ngày đăng ký phải là {NgayKeTiep}. Các ngày nghỉ {TenLoai} phải liên tiếp nhau."* | Rule 2 fail |
| *"Bạn đã đăng ký đủ {N} ngày {TenLoai} trong tháng {MM/YYYY}."* | Rule 3 fail |
| *"Vui lòng nhập số ngày tối đa/tháng"* | BS-01 form validate |

---

## Màn Hình Liên Quan

- `cat_leave_day_type` — cấu hình loại ngày nghỉ
- `att_leave_day` — đăng ký ngày nghỉ (Web Main, BPNS)
- Portal/App Att_LeaveDay — ATT03.01 NV tự đăng ký (ngoài scope PBI này)

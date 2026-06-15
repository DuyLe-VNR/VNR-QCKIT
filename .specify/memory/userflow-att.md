# User Flow — ATT (Cham cong)

> Sinh bởi /qc_user_flow — 2026-06-11T10:55:00
> Input: ATT | ENV: local | APP_URL: https://pehn02.vnresource.net:4406
> Crawl: 92 màn hình | 92 thành công | 0 thất bại

---

## Sơ đồ luồng

```
GROUP: ATT — Cham cong
│
├── [att_approved_roster] Ca làm việc đang chờ duyệt
│     URL: /Att_ApprovedRoster/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_waiting_approve_roster] Ca làm việc đã được bạn duyệt
│     URL: /Att_WaitingApproveRoster/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách (inline)
│
├── [att_approved_leaveday] Ngày nghỉ đang chờ duyệt
│     URL: /Att_ApprovedLeaveday/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_waiting_approve_leave_day] Ngày nghỉ đã được bạn duyệt
│     URL: /Att_WaitingApproveLeaveDay/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách (inline)
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_approved_overtime] Tăng ca đang chờ duyệt
│     URL: /Att_ApprovedOvertime/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Duyệt]-->    ✓ toast: "Duyệt thành công"
│             --[Từ chối]--> ✓ toast: "Từ chối thành công"
│
├── [att_waiting_approve_overtime] Tăng ca đã được bạn duyệt
│     URL: /Att_WaitingApproveOvertime/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách (inline)
│
├── [att_approved_tamscanlog] Quẹt thẻ chờ duyệt
│     URL: /Att_ApprovedTamscanlog/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Duyệt]-->    ✓ toast: "Duyệt thành công"
│             --[Từ chối]--> ✓ toast: "Từ chối thành công"
│
├── [att_waiting_approve_tamscanlog] Quẹt thẻ đã được bạn duyệt
│     URL: /Att_WaitingApproveTamscanlog/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách (inline)
│
├── [att_approve_pregnancy] Danh sách xác nhận chế độ
│     URL: /Att_ApprovePregnancy/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Xuất excel]--> tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_schedule] Dữ liệu công
│     URL: /Att_Schedule/Index  |  Loại: Dashboard/Calendar screen
│     │
│     └── FEATURE: Xem lịch công
│           SCREEN: Calendar view (Hôm nay/Tháng/Tuần/Ngày)
│             --[Hôm nay]--> chuyển về ngày hiện tại
│             --[Tháng/Tuần/Ngày]--> thay đổi chế độ xem
│
├── [att_compute_attendance] Tính công
│     URL: /Att_ComputeAttendance/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Tính công
│           SCREEN: Form điều kiện + danh sách
│             --[Kiểm tra dữ liệu]--> kiểm tra trước khi tính
│             --[Tính công]-->         ✓ tính công thành công
│             --[Tính công chờ xác nhận]--> tính công trạng thái chờ
│             --[Chờ duyệt]--> chuyển trạng thái chờ duyệt
│
├── [att_compute_recal_attendance] Tính công lại
│     URL: /Att_ComputeRecalAttendance/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Tính công lại
│           SCREEN: Form điều kiện
│             --[Tính công]--> ✓ tính công lại thành công
│
├── [att_compute_attendance_temp] Tính công ứng
│     URL: /Att_ComputeAttendanceTemp/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Tính công ứng
│           SCREEN: Form điều kiện
│             --[Tính công]--> ✓ tính công ứng thành công
│
├── [att_compute_compenstate_attendance] Tính bù công
│     URL: /Att_ComputeCompenstateAttendance/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Tính bù công
│           SCREEN: Form điều kiện + danh sách
│             --[Tìm kiếm]--> lọc danh sách
│             --[Tính bù công]--> ✓ tính bù công thành công
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_tam] Tải dữ liệu vào ra
│     URL: /Att_TAM/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Tải dữ liệu
│           SCREEN: Form cấu hình máy chấm công
│             --[Thiết lập máy chấm công]--> cấu hình kết nối
│             --[Tải dữ liệu]--> ✓ tải dữ liệu thành công
│
├── [att_tamfrom_file] Tải dữ liệu chấm công từ file
│     URL: /Att_TAMFromFile/Index  |  Loại: Import screen
│     │
│     └── FEATURE: Tải dữ liệu từ file
│           SCREEN: Form upload file
│             --[Tạo mới cấu hình]--> tạo cấu hình mới
│             --[Chỉnh cấu hình]-->   chỉnh sửa cấu hình
│             --[Xóa cấu hình]-->     xóa cấu hình
│             --[Tải dữ liệu]-->      ✓ tải dữ liệu thành công
│
├── [att_tamfrom_file_v2] Tải dữ liệu chấm công từ file V2
│     URL: /Att_TAMFromFileV2/Index  |  Loại: Import screen
│     │
│     └── FEATURE: Tải dữ liệu từ file V2
│           SCREEN: Form upload file
│             --[Tạo mới cấu hình]--> tạo cấu hình mới
│             --[Tải dữ liệu]-->      ✓ tải dữ liệu thành công
│
├── [att_tamfrom_file_v3] Tải dữ liệu chấm công từ file V3
│     URL: /Att_TAMFromFileV3/Index  |  Loại: Import screen
│     │
│     └── FEATURE: Tải dữ liệu từ file V3
│           SCREEN: Form upload file
│             --[Tải dữ liệu]--> ✓ tải dữ liệu thành công
│
├── [att_tamscan_log] DS Dữ liệu check-in/check-out
│     URL: /Att_TAMScanLog/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách (inline)
│
├── [att_tam_scan_log_register_v2] DS Đăng ký dữ liệu In/Out
│     URL: /Att_TamScanLogRegisterV2/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo mới đăng ký In/Out)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_compute_work_day] Tổng hợp ngày công
│     URL: /Att_ComputeWorkDay/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Tổng hợp ngày công
│           SCREEN: Form điều kiện + danh sách
│             --[Tổng hợp ngày công]--> ✓ tổng hợp thành công
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_compute_workday_adjust] Dữ liệu chấm công hàng ngày
│     URL: /Att_ComputeWorkdayAdjust/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Xem dữ liệu chấm công
│           SCREEN: Form điều kiện + danh sách
│             --[Tổng hợp ngày công]--> ✓ tổng hợp thành công
│
├── [att_time_sheet_by_employee] Bảng công nhân viên
│     URL: /Att_TimeSheetByEmployee/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Duyệt]-->    ✓ toast: "Duyệt thành công"
│             --[Từ chối]--> ✓ toast: "Từ chối thành công"
│
├── [att_import_attendance_import] Nhập bảng công tổng hợp
│     URL: /Att_ImportAttendance/Import_List  |  Loại: Import screen
│     │
│     └── FEATURE: Nhập dữ liệu
│           SCREEN: Form upload file
│             --[Tải dữ liệu]--> upload file
│             --[Lưu]-->         ✓ toast: "Lưu thành công"
│             --[Tạo mẫu]-->     tải file mẫu
│
├── [att_check_attendance] NV Thiếu dữ liệu chấm công
│     URL: /Att_CheckAttendance/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Xuất BC]-->   tải báo cáo
│
├── [att_profile_time_sheet] Công sản phẩm / Công việc hàng ngày
│     URL: /Att_ProfileTimeSheet/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tổng hợp ngày công]--> tổng hợp công
│
├── [att_profile_time_sheet_register] DS Đăng ký công việc hàng ngày
│     URL: /Att_ProfileTimeSheetRegister/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo mới đăng ký công việc)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Xác nhận]-->  ✓ toast: "Xác nhận thành công"
│
├── [att_late_early_allowed] Đăng ký xin trễ sớm
│     URL: /Att_LateEarlyAllowed/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Đăng ký trễ sớm)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_synchronize_data] Đồng bộ dữ liệu công
│     URL: /Att_SynchronizeData/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Đồng bộ dữ liệu
│           SCREEN: Form điều kiện
│             --[Tìm kiếm]-->     lọc danh sách
│             --[Đồng bộ dữ liệu]--> ✓ đồng bộ thành công
│
├── [att_move_workday] DS Dịch chuyển công
│     URL: /Att_MoveWorkday/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo dịch chuyển công)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│             --[Xóa]-->      xóa record đã chọn
│
├── [att_roster] DS Ca làm việc
│     URL: /Att_Roster/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog/Panel: Tạo ca làm việc)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách
│     │       --[Sao chép]-->  sao chép ca
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Chờ duyệt]--> chuyển trạng thái
│             --[Duyệt]-->     ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_roster_group] DS Nhóm ca làm việc
│     URL: /Att_RosterGroup/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo nhóm ca)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_roster_group_by_organization] DS Nhóm ca theo sơ đồ tổ chức
│     URL: /Att_RosterGroupByOrganization/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo nhóm ca theo org)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_roster_group_by_emp] DS Nhóm ca nhân viên
│     URL: /Att_RosterGroupByEmp/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Phân ca nhân viên)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_shift_substitution] DS Đổi ca làm việc
│     URL: /Att_ShiftSubstitution/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo đổi ca)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_schedule_shift] Thiết lập lịch làm việc
│     URL: /Att_ScheduleShift/Index  |  Loại: Calendar/Form screen
│     │
│     └── FEATURE: Thiết lập lịch
│           SCREEN: Calendar view với toolbar
│             --[Nghỉ lễ/Ngày Off/Nghỉ phép năm]--> đánh dấu ngày đặc biệt
│             --[Lưu thay đổi]--> ✓ lưu thiết lập
│
├── [att_schedule_work] Phân lịch làm việc
│     URL: /Att_ScheduleWork/Index  |  Loại: Calendar/Form screen
│     │
│     └── FEATURE: Phân lịch
│           SCREEN: Calendar view
│             --[Lưu thay đổi]--> ✓ lưu phân lịch
│
├── [att_schedule_work_list] DS Phân ca nhân viên
│     URL: /Att_ScheduleWork_List/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Phân ca nhân viên)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_change_roster_group] DS Lịch đổi ca
│     URL: /Att_ChangeRosterGroup/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo lịch đổi ca)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_profile_not_roster] DS Chưa có ca làm việc
│     URL: /Att_ProfileNotRoster/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│
├── [att_shift_priority] Ca ưu tiên
│     URL: /Att_ShiftPriority/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo ca ưu tiên)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_import_roster_import] Nhập dữ liệu ca làm việc
│     URL: /Att_ImportRoster/Import_List  |  Loại: Import screen
│     │
│     └── FEATURE: Nhập dữ liệu
│           SCREEN: Form upload file
│             --[Tải dữ liệu]--> upload file
│             --[Lưu]-->         ✓ lưu thành công
│             --[Kết xuất]--> tải kết quả
│
├── [att_import_roster_group_import] Nhập dữ liệu ca làm việc theo nhóm
│     URL: /Att_ImportRosterGroup/Import_List  |  Loại: Import screen
│     │
│     └── FEATURE: Nhập dữ liệu theo nhóm
│           SCREEN: Form upload file
│             --[Tải dữ liệu]--> upload file
│             --[Lưu]-->         ✓ lưu thành công
│
├── [att_import_roster_by_roster_group_import] Nhập dữ liệu ca làm việc NV theo nhóm
│     URL: /Att_ImportRosterByRosterGroup/Import_List  |  Loại: Import screen
│     │
│     └── FEATURE: Nhập dữ liệu
│           SCREEN: Form upload file
│             --[Tải dữ liệu]--> upload file
│             --[Lưu]-->         ✓ lưu thành công
│
├── [att_roster_detail] DS Chi tiết lịch dạy
│     URL: /Att_RosterDetail/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo chi tiết lịch dạy)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│
├── [att_roster_confirm] Xác nhận ca làm việc
│     URL: /Att_RosterConfirm/Index  |  Loại: List screen
│     │
│     └── FEATURE: Xác nhận
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Xác nhận]-->  ✓ xác nhận thành công
│
├── [att_annual_day_off] Quỹ ngày nghỉ hàng tuần
│     URL: /Att_AnnualDayOff/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo quỹ ngày nghỉ)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_leave_day] DS Ngày nghỉ
│     URL: /Att_LeaveDay/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo mới ngày nghỉ)
│     │       Nhập: Nhân viên*, Ngày bắt đầu*, Loại ngày nghỉ*, Loại*, Trạng thái*,
│     │              Người duyệt đầu*, Người duyệt cuối*, Lý do nghỉ, File đính kèm
│     │       --[Lưu và tạo mới]--> ✓ toast: "Lưu thành công"  --> [att_leave_day]
│     │       --[Lưu và đóng]-->    ✓ toast: "Lưu thành công"  --> [att_leave_day]
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen — chọn record
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│             --[Hủy]-->       ✓ toast: "Hủy thành công"
│
├── [att_annual_leave] DS Phép năm đầu kỳ
│     URL: /Att_AnnualLeave/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Nhập phép năm đầu kỳ)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Nhập DL]-->   nhập dữ liệu từ file
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_pregnancy] DS Nhân viên hưởng chế độ
│     URL: /Att_Pregnancy/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo hưởng chế độ)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_pregnancy_register] DS Đăng ký hưởng chế độ
│     URL: /Att_PregnancyRegister/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Đăng ký hưởng chế độ)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_overtime] DS Tăng ca
│     URL: /Att_Overtime/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo tăng ca)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách
│     │       --[Tạo phiếu OT]--> tạo phiếu tăng ca
│     │       --[Kết xuất]-->     tải file .xlsx
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Chờ duyệt]-->  chuyển trạng thái
│             --[Duyệt]-->      ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->    ✓ toast: "Từ chối thành công"
│
├── [att_overtime_confirm] DS Xác nhận tăng ca
│     URL: /Att_OvertimeConfirm/Index  |  Loại: List screen
│     │
│     └── FEATURE: Danh sách + Phân tích
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Phân tích]-->    phân tích tăng ca
│             --[Kết xuất]-->     tải file .xlsx
│
├── [att_grade] Chế độ công NV
│     URL: /Att_Grade/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo chế độ công)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│             --[Phân tích KH]--> phân tích kế hoạch
│
├── [att_cut_off_duration] DS Kỳ công/kỳ lương
│     URL: /Att_CutOffDuration/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo kỳ công)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_bussiness_travel] DS Đi công tác
│     URL: /Att_BussinessTravel/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo đi công tác)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_leaveday_business_travel] Danh sách đi công tác (chi tiết)
│     URL: /Att_LeavedayBusinessTravel/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo mới đi công tác)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Phê duyệt
│           SCREEN: List screen
│             --[Phê duyệt]--> ✓ toast: "Duyệt thành công"
│             --[Từ chối]-->   ✓ toast: "Từ chối thành công"
│
├── [att_employee_wifi] DS Chấm công trên APP
│     URL: /Att_EmployeeWifi/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo chấm công APP)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│             --[Kết xuất]--> tải file .xlsx
│
├── [att_tam_scan_log_config] DS Cấu hình tải dữ liệu quẹt thẻ
│     URL: /Att_TamScanLogConfig/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo cấu hình quẹt thẻ)
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Danh sách
│           SCREEN: List screen
│             --[Tìm kiếm]--> lọc danh sách
│
├── [att_bussiness_travel_wfhconfirm] DS Xác nhận làm ở nhà có điểm danh
│     URL: /Att_BussinessTravelWFHConfirm/Index  |  Loại: List screen
│     │
│     └── FEATURE: Xác nhận + Danh sách
│           SCREEN: List screen
│             --[Phân tích]--> phân tích dữ liệu
│             --[Xác nhận]-->  ✓ xác nhận thành công
│             --[Kết xuất]--> tải file .xlsx
│
├── NHÓM BÁO CÁO (Báo cáo)
│
├── [att_report_leaveday] BC Chi tiết nghỉ hàng ngày
│     URL: /Att_ReportLeaveday/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_summary_late_in_out] BC Đi muộn về sớm
│     URL: /Att_ReportSummaryLateInOut/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_leave_month] BC Tổng hợp nghỉ hàng tháng
│     URL: /Att_ReportLeaveMonth/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất PDF]--> tải PDF
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_leave_year] BC Thống kê ngày nghỉ năm
│     URL: /Att_ReportLeaveYear/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_annual_detail] BC Chi tiết phép năm
│     URL: /Att_ReportAnnualDetail/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_monthly_overtime] BC Tăng ca hàng tháng
│     URL: /Att_ReportMonthlyOvertime/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất PDF]--> tải PDF
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_summary_overtime_month] BC Thống kê tăng ca
│     URL: /Att_ReportSummaryOvertimeMonth/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_monthly_time_sheet_v2] BC Bảng công hàng tháng
│     URL: /Att_ReportMonthlyTimeSheetV2/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem + Khóa bảng công
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Khóa]-->     khóa bảng công
│             --[Mở khóa]-->  mở khóa bảng công
│             --[Yêu cầu duyệt]--> gửi yêu cầu duyệt
│
├── [att_report_monthly] BC Công hàng tháng
│     URL: /Att_ReportMonthly/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_detail_overtime] BC Chi tiết ngày làm thêm
│     URL: /Att_ReportDetailOvertime/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_report_monthly_time_sheet_detail] BC Dữ liệu công hàng tháng
│     URL: /Att_ReportMonthlyTimeSheetDetail/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_day_off_remain] BC Số lượng ngày nghỉ còn lại
│     URL: /Att_DayOffRemain/Index  |  Loại: Form screen (Báo cáo)
│     │
│     └── FEATURE: Xem báo cáo
│           SCREEN: Form điều kiện + kết quả
│             --[Tìm kiếm]--> xem kết quả
│             --[Xuất BC]-->  tải báo cáo
│
├── [att_config_first_year] Quyết toán phép hàng năm
│     URL: /Att_ConfigFirstYear/Index  |  Loại: Form screen
│     │
│     └── FEATURE: Quyết toán phép
│           SCREEN: Form điều kiện + danh sách
│             --[Tìm kiếm]--> lọc danh sách
│             --[Chuyển]-->    quyết toán record đã chọn
│             --[Chuyển tất cả]--> quyết toán tất cả
│             --[Xuất excel]--> tải file .xlsx
│
└── [att_bussiness_travel_wfhconfirm] đã ghi ở trên
```

---

## Chi tiết từng màn hình

### [att_leave_day] — DS Ngày nghỉ

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_LeaveDay/Index`
> Loại: List screen
> Feature: Ngày nghỉ
> Trạng thái crawl: ✅ Thành công
> Thời gian: 2026-06-11T10:30:00

#### Toolbar Actions

| Action | Loại | Trạng thái | Kết quả |
| --- | --- | --- | --- |
| Tạo mới | open-dialog | enabled | Mở dialog tạo mới ngày nghỉ |
| Tạo mới ngày nghỉ không ca | open-dialog | enabled | Mở dialog tạo ngày nghỉ không ca |
| Add new | open-dialog | enabled | Thêm mới (form khác) |
| Tìm kiếm | filter | enabled | Lọc danh sách |
| Xác nhận khẩn cấp | action | enabled | Xác nhận khẩn cấp |
| Chờ duyệt | action | enabled | Chuyển trạng thái chờ duyệt |
| Phê duyệt | action | enabled | Phê duyệt ngày nghỉ đã chọn |
| Từ chối | action | enabled | Từ chối ngày nghỉ đã chọn |
| Hủy | action | enabled | Hủy ngày nghỉ đã chọn |
| Kết xuất | export | enabled | Tải file .xlsx |
| Tạo mẫu | export | enabled | Tải file mẫu |
| Xóa | delete | enabled | Xóa record đã chọn |

#### Feature: Tạo mới

**Screen**: (Dialog: Tạo mới ngày nghỉ)

Happy Path:
1. Navigate đến `[att_leave_day]` → màn hình danh sách
2. Click **Tạo mới** → dialog mở
3. Nhập: Nhân viên (bắt buộc), Ngày bắt đầu (bắt buộc), Loại ngày nghỉ (bắt buộc), Loại (bắt buộc), Trạng thái (bắt buộc), Người duyệt đầu (bắt buộc), Người duyệt cuối (bắt buộc)
4. Click **Lưu và đóng**
5. Kết quả: toast `"Lưu thành công"` → record xuất hiện trong danh sách

Form Fields:

| Field | Loại | Bắt buộc | BasePage Method |
| --- | --- | --- | --- |
| Nhân viên | combobox | ✓ | `inputCombobox` |
| Ngày bắt đầu | date | ✓ | `inputTextbox` |
| Đến ngày | date | — | `inputTextbox` |
| Loại ngày nghỉ | combobox | ✓ | `inputCombobox` |
| Loại | combobox | ✓ | `inputCombobox` |
| Lý do nghỉ | textbox | — | `inputTextbox` |
| File đính kèm | file | — | `inputFile` |
| Trạng thái | combobox | ✓ | `inputCombobox` |
| Người duyệt đầu | combobox | ✓ | `inputCombobox` |
| Người duyệt cuối | combobox | ✓ | `inputCombobox` |

#### Search Fields

| Field | Loại | BasePage Method |
| --- | --- | --- |
| Nhân viên | combobox | `inputCombobox` |
| Tên nhân viên | textbox | `inputTextbox` |
| Mã NV | textbox | `inputTextbox` |
| Phòng ban | textbox | `inputTextbox` |
| Trạng thái nhân viên | combobox | `inputCombobox` |
| Chức danh | combobox | `inputCombobox` |
| Chức vụ | combobox | `inputCombobox` |
| Loại nhân viên | combobox | `inputCombobox` |
| Trạng thái | combobox | `inputCombobox` |
| Thời gian nghỉ (Từ ngày) | date | `inputTextbox` |
| Thời gian nghỉ (Đến ngày) | date | `inputTextbox` |
| Loại ngày nghỉ | combobox | `inputCombobox` |

#### Grid Columns

Mã NV, Tên nhân viên, Chi nhánh, Khối, Phòng ban, Bộ phận, Loại, Loại ngày nghỉ, Ngày bắt đầu, Ngày kết thúc, Tổng ngày nghỉ, Giờ vào, Giờ ra, Trạng thái, Lý do từ chối, Người từ chối, Ngày từ chối, Người duyệt đầu, Người duyệt kế tiếp, Người duyệt tiếp theo, Người duyệt cuối, Lý do nghỉ, Người cập nhật, Ngày cập nhật, Tháng yêu cầu, Ngày duyệt

---

### [att_approved_roster] — Ca làm việc đang chờ duyệt

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_ApprovedRoster/Index`
> Loại: List screen | Feature: Phê duyệt
> Trạng thái crawl: ✅ Thành công

| Action | Loại | Kết quả |
| --- | --- | --- |
| Tìm kiếm | filter | Lọc danh sách |
| Phê duyệt | action | Duyệt ca làm việc |
| Từ chối | action | Từ chối ca làm việc |
| Tạo mới | open-dialog | Tạo ca mới |

---

### [att_approved_leaveday] — Ngày nghỉ đang chờ duyệt

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_ApprovedLeaveday/Index`
> Loại: List screen | Feature: Phê duyệt
> Trạng thái crawl: ✅ Thành công

| Action | Loại | Kết quả |
| --- | --- | --- |
| Tìm kiếm | filter | Lọc danh sách |
| Phê duyệt | action | Duyệt ngày nghỉ |
| Từ chối | action | Từ chối ngày nghỉ |
| Kết xuất | export | Tải file .xlsx |

---

### [att_approved_overtime] — Tăng ca đang chờ duyệt

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_ApprovedOvertime/Index`
> Loại: List screen | Feature: Phê duyệt
> Trạng thái crawl: ✅ Thành công

| Action | Loại | Kết quả |
| --- | --- | --- |
| Tìm kiếm | filter | Lọc danh sách |
| Duyệt | action | Duyệt tăng ca |
| Từ chối | action | Từ chối tăng ca |
| Kết xuất | export | Tải file .xlsx |

---

### [att_compute_attendance] — Tính công

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_ComputeAttendance/Index`
> Loại: Form screen | Feature: Dữ liệu chấm công
> Trạng thái crawl: ✅ Thành công

| Action | Loại | Kết quả |
| --- | --- | --- |
| Kiểm tra dữ liệu | check | Kiểm tra dữ liệu trước khi tính |
| Tính công | action | Tính công theo kỳ đã chọn |
| Tính công chờ xác nhận | action | Tính công trạng thái chờ |
| Chờ duyệt | action | Chuyển sang chờ duyệt |

---

### [att_overtime] — DS Tăng ca

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_Overtime/Index`
> Loại: List screen | Feature: Tăng ca
> Trạng thái crawl: ✅ Thành công

| Action | Loại | Kết quả |
| --- | --- | --- |
| Tạo mới | open-dialog | Mở dialog tạo tăng ca |
| Tạo phiếu OT | action | Tạo phiếu tăng ca |
| Chờ duyệt | action | Chuyển trạng thái chờ duyệt |
| Duyệt | action | Duyệt tăng ca |
| Từ chối | action | Từ chối tăng ca |
| Hủy | action | Hủy tăng ca |
| Kết xuất | export | Tải file .xlsx |

---

### [att_roster] — DS Ca làm việc

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Att_Roster/Index`
> Loại: List screen | Feature: Quản lý ca
> Trạng thái crawl: ✅ Thành công

| Action | Loại | Kết quả |
| --- | --- | --- |
| Tạo mới | open-dialog | Mở dialog tạo ca |
| Sao chép | action | Sao chép ca đã chọn |
| Tạo theo chu kỳ | action | Tạo ca theo chu kỳ |
| Chờ duyệt | action | Chuyển trạng thái |
| Duyệt | action | Duyệt ca |
| Từ chối | action | Từ chối ca |
| Kết xuất | export | Tải file .xlsx |

---

### CÁC MÀN HÌNH BÁO CÁO (pattern chung)

Tất cả màn hình báo cáo thuộc ATT có pattern chung:
- Loại: Form screen (Báo cáo)
- Toolbar: **Tìm kiếm** + **Xuất BC** / **Xuất excel** / **Xuất PDF**
- Không có Tạo mới / Xóa
- Search fields: Phòng ban, Từ ngày, Đến ngày, Nhân viên, ...

| Alias | Tiêu đề báo cáo |
| --- | --- |
| att_report_leaveday | BC Chi tiết nghỉ hàng ngày |
| att_report_summary_late_in_out | BC Đi muộn về sớm |
| att_report_leave_month | BC Tổng hợp nghỉ hàng tháng |
| att_report_leave_year | BC Thống kê ngày nghỉ năm |
| att_report_annual_detail | BC Chi tiết phép năm |
| att_report_monthly_overtime | BC Tăng ca hàng tháng |
| att_report_summary_overtime_month | BC Thống kê tăng ca |
| att_report_monthly_time_sheet_v2 | BC Bảng công hàng tháng |
| att_report_monthly | BC Công hàng tháng |
| att_report_detail_overtime | BC Chi tiết ngày làm thêm |
| att_report_monthly_time_sheet_detail | BC Dữ liệu công hàng tháng |
| att_day_off_remain | BC Số lượng ngày nghỉ còn lại |

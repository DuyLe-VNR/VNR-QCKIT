# Locator Map — cat_leave_day_type

> Sinh bởi /qc_map_flow — 2026-06-12
> Group: cat
> Source: component_cat_leave_day_type.md + component-rule.md
> Locator file : .specify/tests/pages/cat/CatLeaveDayTypeLocator.ts
> Page Object  : .specify/tests/pages/cat/cat_leave_day_type/CatLeaveDayTypePage.ts

## Toolbar — List page

| Property | Locator expression | Label | Type |
| --- | --- | --- | --- |
| `btnTaoMoi` | `page.getByRole('button', { name: 'Tạo mới' })` | Tạo mới | k-button |
| `btnTimKiem` | `page.getByRole('button', { name: 'Tìm kiếm' })` | Tìm kiếm | k-button |
| `btnXuatExcel` | `page.getByRole('button', { name: 'Xuất excel' })` | Xuất excel | k-button |
| `btnDoiCot` | `page.getByRole('button', { name: 'Đổi cột' })` | Đổi cột | k-button |
| `btnXoa` | `page.getByRole('button', { name: 'Xóa' })` | Xóa | k-button |

## Toolbar — Create/Edit page

| Property | Locator expression | Label | Type |
| --- | --- | --- | --- |
| `btnLuu` | `page.getByRole('button', { name: 'Lưu' })` | Lưu | k-button |
| `btnLuuVaTaoMoi` | `page.getByRole('button', { name: 'Lưu và tạo mới' })` | Lưu và tạo mới | k-button |

## Form Fields — Create/Edit page (/Cat_LeaveDayType/Create)

### k-textbox

| Property | Locator expression | Label | Component | Required | BasePage Method |
| --- | --- | --- | --- | --- | --- |
| `loaiNgayNghi` | `div:has(FieldTitle+FieldValue).filter(hasText:'Loại ngày nghỉ') input.k-textbox` | Loại ngày nghỉ | k-textbox | ✓ | `inputTextbox` |
| `ma` | `div:has(FieldTitle+FieldValue).filter(hasText:'Mã') input.k-textbox` | Mã | k-textbox | ✓ | `inputTextbox` |
| `maTK` | `div:has(FieldTitle+FieldValue).filter(hasText:'Mã TK') input.k-textbox` | Mã TK | k-textbox | ✓ | `inputTextbox` |
| `nhomLoaiNgayNghi` | `div:has(FieldTitle+FieldValue).filter(hasText:'Nhóm loại ngày nghỉ') input.k-textbox` | Nhóm loại ngày nghỉ | k-textbox | — | `inputTextbox` |
| `ghiChu` | `div:has(FieldTitle+FieldValue).filter(hasText:'Ghi chú') input.k-textbox` | Ghi chú | k-textbox | — | `inputTextbox` |

### k-combobox

| Property | Locator expression | Label | Component | Required | BasePage Method |
| --- | --- | --- | --- | --- | --- |
| `donViToChuc` | `[id*="OrgTreeViewDropDown"]` | Đơn vị tổ chức | k-combobox (orgTree) | — | `inputCombobox` |
| `maPhuThuoc` | `[name="CodeLeaveDayDepend"].closest('span.k-combobox') input.k-input` | Mã phụ thuộc | k-combobox | — | `inputCombobox` |
| `loaiNhomNghi` | `[name="LeaveTypeGroup"].closest('span.k-combobox') input.k-input` | Loại nhóm nghỉ | k-combobox | — | `inputCombobox` |

### numeric

| Property | Locator expression | Label | Component | Required | BasePage Method |
| --- | --- | --- | --- | --- | --- |
| `soThuTu` | `div:has(FieldTitle+FieldValue).filter(hasText:'Số thứ tự') input[type="number"]` | Số thứ tự | numeric | — | `inputTextbox` |
| `soNgayNghiToiDaNam` | `div:has(FieldTitle+FieldValue).filter(hasText:'Số ngày nghỉ tối đa/năm') input[type="number"]` | Số ngày nghỉ tối đa/năm | numeric | — | `inputTextbox` |
| `soNgayNghiToiDaThang` | `div:has(FieldTitle+FieldValue).filter(hasText:'Số ngày nghỉ tối đa/tháng') input[type="number"]` | Số ngày nghỉ tối đa/tháng | numeric | — | `inputTextbox` |

### text-formula

| Property | Locator expression | Label | Component | BasePage Method |
| --- | --- | --- | --- | --- |
| `congThuc` | `[name="Formula"]` | Công thức | text-formula | `inputTextbox` |
| `dsGioNghi` | `[name="ListRegisterHours"]` | DS Số giờ đăng ký nghỉ giữa ca | text-formula | `inputTextbox` |
| `dieuKienDangKy` | `[name="ConditionRegisteredFormula"]` | Điều kiện được đăng ký | text-formula | `inputTextbox` |

### checkboxes (26+)

| Property | name selector | Label |
| --- | --- | --- |
| `cbChuaChonTrongPortal` | `[name="NotSelectedInPortal"]` | Chưa chọn trong portal |
| `cbChungTuYTe` | `[name="MedicalDocument"]` | Chứng từ y tế |
| `cbKhongKiemTraCa` | `[name="IsNoShift"]` | Không kiểm tra ca |
| `cbKhongDangKyThoiGianThuViec` | `[name="IsProbationNotLeaveDay"]` | Không đăng ký nghỉ trong t.gian thử việc |
| `cbChan` | `[name="IsProbationNotLeaveDayBlock"]` | Chặn |
| `cbChoPhepLuuKhiTrungDuLieu` | `[name="IsAllowDuplicateData"]` | Cho phép lưu khi trùng dữ liệu |
| `cbNgayThuong` | `[name="IsWorkDay"]` | Ngày thường |
| `cbQuyPhepNghiDinh85` | `[name="IsMenses"]` | Quỹ phép nghị định 85 |
| `cbLoaiNghiBHXH` | `[name="IsInsuranceLeave"]` | Loại nghỉ BHXH |
| `cbSoPhepThemTonDauKy` | `[name="IsAdditonalLeave"]` | Số phép thêm tồn đầu kỳ |
| `cbNghiBuHuongCheDo` | `[name="IsCompensationforMaternity"]` | Nghỉ bù hưởng chế độ |
| `cbPhepKetHon` | `[name="IsMarrige"]` | Phép kết hôn |
| `cbPhepOm` | `[name="IsSick"]` | Phép ốm |
| `cbNghiPhaiLamBu` | `[name="IsTimeOffMakeUp"]` | Nghỉ phải làm bù |
| `cbPhepThaiSan` | `[name="IsPregnantLeave"]` | Phép thai sản |
| `cbDiCongTac` | `[name="IsBusinessTravel"]` | Đi công tác |
| `cbHuongLuongTheoLuat` | `[name="IsPaidLeaveInLaw"]` | Hưởng lương theo luật |
| `cbNghiNgungViec` | `[name="IsForceMajeure"]` | Nghỉ ngừng việc |
| `cbLaPhepNam` | `[name="IsAnnualLeave"]` | Là phép năm |
| `cbNghiBu` | `[name="IsTimeOffInLieu"]` | Nghỉ bù |
| `cbTruVaoPhepDauKy` | `[name="ExceptInAnlBeginning"]` | Trừ vào phép đầu kỳ |
| `cbTruVaoPhepThamNien` | `[name="ExceptInAnlSeniority"]` | Trừ vào phép thâm niên |
| `cbCanhBaoMaxNam` | `[name="IsWarningMaxPerYear"]` | Cảnh báo (max/năm) |
| `cbSuatAn` | `[name="IsMeal"]` | Suất ăn |
| `cbTaiNguoiThan` | `[name="IsLoadRelatives"]` | Tải người thân |
| `cbVoHieu` | `[name="IsInactive"]` | Vô hiệu |

## [TODO] Fields cần xác nhận thủ công

| Field | Vấn đề | Gợi ý |
| --- | --- | --- |
| `donViToChuc` | OrgTreeViewDropDown là Kendo treeview dropdownlist đặc biệt, selector dựa trên id có thể không chính xác | Inspect DOM tại /Cat_LeaveDayType/Create — tìm `id` hoặc `name` chứa "OrgTreeView" |
| `loaiNhomNghi` | `name="LeaveTypeGroup"` — trùng tên với k-textbox `nhomLoaiNgayNghi`, cần phân biệt bằng loại element (`span.k-combobox` vs `input.k-textbox`) | Đã phân biệt qua `.closest('span.k-combobox')` — xác nhận lại DOM |
| `maTK` | Label "Mã TK" có thể cần filter chính xác hơn nếu có nhiều FieldTitle "Mã" gần nhau | Dùng `hasText: 'Mã TK'` — test thực tế để xác nhận |

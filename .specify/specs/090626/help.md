# Hướng Dẫn Sử Dụng — Loại Ngày Nghỉ Theo Giới Tính (059-leave-type-validation-DAESANG)

**Phiên bản**: 1.0  
**Ngày cập nhật**: 2026-06-11  
**Áp dụng**: HRM9 Web Main + EmpPortal

---

## Giới thiệu

Tính năng này cho phép cấu hình loại ngày nghỉ chỉ áp dụng cho nhân viên nữ (ví dụ: nghỉ kinh nguyệt), với các quy tắc kiểm soát:
- **Giới tính**: chỉ nhân viên nữ mới được đăng ký
- **Ngày liên tục**: các ngày nghỉ trong tháng phải liên tiếp nhau
- **Giới hạn tháng**: tối đa N ngày/tháng dương lịch (có thể cấu hình)

---

## Nhóm 1: Admin / HR Quản Trị — Cấu Hình Loại Ngày Nghỉ

### 1.1. Truy cập

- **Menu**: Danh mục → Loại ngày nghỉ (Cat_LeaveDayType)
- **URL**: `/Cat_LeaveDayType/Index`
- **Quyền cần có**: `HRM_CAT_LEAVEDAYTYPE` — View (xem), Modify (sửa), Create (tạo mới)

> **Lưu ý phân quyền**: Chỉ Admin/HR quản trị hệ thống mới có quyền truy cập màn hình Danh mục này. Nhân viên thường và BPNS/HR nghiệp vụ không thấy menu này.

---

### 1.2. Tạo mới loại ngày nghỉ theo giới tính

**Bước 1**: Vào menu **Danh mục → Loại ngày nghỉ**, nhấn nút **Thêm mới**.

**Bước 2**: Điền thông tin cơ bản (tên loại, mã code, v.v.) như bình thường.

**Bước 3**: Thiết lập các trường mới trong mục cấu hình giới tính:

| Trường | Mô tả | Giá trị |
|--------|-------|---------|
| **Giới tính áp dụng** | Ai được phép đăng ký loại nghỉ này | **Tất cả** — mọi giới tính; **Nữ** — chỉ nhân viên nữ |
| **Yêu cầu ngày liên tục** | Các ngày nghỉ trong tháng có bắt buộc liên tiếp nhau không | Tick = có yêu cầu liên tục; Không tick = cho phép ngắt quãng |
| **Số ngày tối đa/tháng** | Giới hạn số ngày được phép đăng ký trong 1 tháng | Nhập số nguyên dương (ví dụ: 3). Trường này **chỉ hiển thị** khi "Yêu cầu ngày liên tục" được tick |

**Bước 4**: Nhấn **Lưu**.

#### Ví dụ cấu hình nghỉ kinh nguyệt

| Trường | Giá trị đề xuất |
|--------|----------------|
| Tên loại | Nghỉ kinh nguyệt |
| Giới tính áp dụng | **Nữ** |
| Yêu cầu ngày liên tục | ✅ Có |
| Số ngày tối đa/tháng | **3** (hoặc theo policy công ty) |
| IsMenses | ✅ (nếu áp dụng chế độ nghị định 85) |
| MaxPerTimes | 1 (1 ngày/lần đăng ký) |

---

### 1.3. Sửa loại ngày nghỉ đã có

**Bước 1**: Tìm record trong danh sách, nhấn **Chỉnh sửa**.

**Bước 2**: Thay đổi các trường cần thiết. Lưu ý:
- Thay đổi **Giới tính áp dụng** từ "Tất cả" sang "Nữ" sẽ ảnh hưởng ngay lập tức — nhân viên nam sẽ không còn thấy loại nghỉ này trong dropdown Portal.
- Thay đổi **Số ngày tối đa/tháng** chỉ áp dụng cho các đăng ký **mới**, không ảnh hưởng đơn đã được duyệt.

**Bước 3**: Nhấn **Lưu**.

---

### 1.4. Validate khi lưu form Admin

| Điều kiện | Thông báo |
|-----------|-----------|
| "Yêu cầu ngày liên tục" được tick nhưng "Số ngày tối đa/tháng" để trống | *"Vui lòng nhập số ngày tối đa/tháng"* |
| "Số ngày tối đa/tháng" nhập số <= 0 hoặc ký tự không phải số | Field tự động block (input chỉ nhận số nguyên dương) |

---

## Nhóm 2: Nhân Viên — Đăng Ký Nghỉ Trên Portal

### 2.1. Truy cập

- **Menu Portal**: Chấm công → Danh sách ngày nghỉ
- **Quyền cần có**: `Att_PersonalSubmitLeaveDay` — View + Submit

---

### 2.2. Đăng ký ngày nghỉ kinh nguyệt (nhân viên nữ)

**Bước 1**: Vào menu **Chấm công → Danh sách ngày nghỉ**, nhấn **Đăng ký**.

**Bước 2**: Trong dropdown **Loại ngày nghỉ**:
- Nhân viên nữ sẽ thấy tất cả loại nghỉ, bao gồm loại chỉ dành cho nữ (ví dụ: "Nghỉ kinh nguyệt").
- Nhân viên nam **không thấy** các loại nghỉ chỉ dành cho nữ trong dropdown.

**Bước 3**: Chọn **Loại ngày nghỉ** → chọn **Ngày bắt đầu** / **Ngày kết thúc**.

**Bước 4**: Nhấn **Gửi yêu cầu** (để gửi duyệt) hoặc **Lưu nháp**.

---

### 2.3. Quy tắc validate khi đăng ký

Hệ thống sẽ kiểm tra 3 quy tắc dưới đây (chỉ áp dụng cho loại nghỉ có cấu hình đặc biệt như nghỉ kinh nguyệt):

#### Quy tắc 1 — Giới tính

> Loại nghỉ "Nữ" chỉ dành cho nhân viên nữ.

- Nếu nhân viên nam cố tình gửi yêu cầu qua công cụ bên ngoài (bypass giao diện), hệ thống vẫn **tự động chặn** ở phía server.
- **Thông báo lỗi**: *"Loại ngày nghỉ [Tên loại] chỉ áp dụng cho nhân viên nữ"*

#### Quy tắc 2 — Ngày liên tục

> Nếu loại nghỉ yêu cầu ngày liên tục, các ngày đăng ký trong cùng một tháng phải nối tiếp nhau.

**Ví dụ minh họa:**
- Đã được duyệt: ngày 10/07
- Đăng ký tiếp theo: **hợp lệ** là ngày 11/07; **không hợp lệ** là ngày 13/07 (bỏ qua ngày 11, 12)
- **Lần đầu trong tháng**: được chọn bất kỳ ngày nào

**Thông báo lỗi**: *"Ngày đăng ký phải là [ngày kế tiếp]. Các ngày nghỉ [Tên loại] phải liên tiếp nhau."*

#### Quy tắc 3 — Giới hạn số ngày/tháng

> Mỗi tháng dương lịch chỉ được đăng ký tối đa N ngày (do Admin cấu hình).

**Ví dụ**: Nếu giới hạn là 3 ngày/tháng và đã được duyệt 3 ngày trong tháng 07, thì không thể đăng ký thêm trong tháng 07. Sang tháng 08, bộ đếm **tự động reset về 0**.

**Lưu ý quan trọng:**
- Các đơn đã **hủy (E_CANCEL)** hoặc **bị từ chối (E_REJECT)** **không** được tính vào bộ đếm.
- Chỉ tính đơn trạng thái **Đã duyệt (E_APPROVED)**.

**Thông báo lỗi**: *"Bạn đã đăng ký đủ [N] ngày [Tên loại] trong tháng [MM/YYYY]."*

---

### 2.4. Trạng thái đơn nghỉ

| Trạng thái | Mô tả |
|-----------|-------|
| Nháp | Đã lưu, chưa gửi duyệt |
| Chờ duyệt | Đã gửi, đang chờ cấp trên duyệt |
| Đã duyệt | Được duyệt — tính vào phép còn lại |
| Từ chối | Bị từ chối — không tính vào bộ đếm |
| Đã hủy | Nhân viên hoặc HR hủy — không tính vào bộ đếm |

---

## Nhóm 3: BPNS / HR Nghiệp Vụ — Đăng Ký Hộ Nhân Viên

### 3.1. Truy cập

- **Menu Web Main**: Chấm công → DS Nghỉ phép (Att_LeaveDay)
- **Quyền cần có**: `HRM_ATT_LEAVEDAY` — View + Create

---

### 3.2. Đăng ký nghỉ hộ nhân viên nữ

**Bước 1**: Vào màn hình **DS Nghỉ phép**, nhấn **Thêm mới** (hoặc tương đương).

**Bước 2**: **Chọn nhân viên** cần đăng ký hộ.
- Sau khi chọn nhân viên, dropdown **Loại ngày nghỉ** sẽ **tự động cập nhật** theo giới tính của nhân viên được chọn — không theo giới tính BPNS.
- Nếu nhân viên được chọn là nữ → dropdown hiển thị cả loại nghỉ Female-only.
- Nếu nhân viên được chọn là nam → dropdown ẩn loại nghỉ Female-only.

> ⚠️ **Quan trọng**: Filter dropdown theo giới tính **nhân viên được chọn**, không phải giới tính của BPNS đang thao tác.

**Bước 3**: Chọn **Loại ngày nghỉ**, ngày bắt đầu/kết thúc.

**Bước 4**: Nhấn **Lưu**. Đơn nghỉ đăng ký bởi BPNS sẽ được lưu trực tiếp với trạng thái **Đã duyệt (E_APPROVED)** — không cần qua quy trình phê duyệt.

---

### 3.3. Đăng ký hộ nhiều nhân viên cùng lúc

Nếu batch gồm cả nhân viên nam và nhân viên nữ nhưng chọn loại nghỉ chỉ dành cho nữ:
- Hệ thống sẽ **chặn toàn bộ batch** và hiển thị thông báo lỗi.
- Cần tách thành 2 lần đăng ký riêng biệt (nhóm nữ / nhóm nam).

---

### 3.4. Quy tắc validate (giống nhân viên tự đăng ký)

BPNS đăng ký hộ cũng bị kiểm tra đầy đủ 3 quy tắc (giới tính, ngày liên tục, giới hạn tháng) như nhân viên tự đăng ký. Xem chi tiết tại **Mục 2.3**.

---

## Phân Quyền Tổng Hợp

| Vai trò | Xem loại nghỉ KN | Đăng ký KN | Cấu hình Admin |
|---------|-----------------|-----------|---------------|
| NV nữ | ✅ (trong dropdown) | ✅ (tự đăng ký) | ❌ |
| NV nam | ❌ (ẩn khỏi dropdown) | ❌ | ❌ |
| BPNS / HR nghiệp vụ | ✅ (khi chọn NV nữ) | ✅ (đăng ký hộ NV nữ) | ❌ |
| Cấp duyệt (CD) | ✅ (trong DS duyệt) | ❌ | ❌ |
| Admin / HR quản trị | ✅ | ✅ | ✅ |

---

## Câu Hỏi Thường Gặp (FAQ)

**Q: Tôi là nhân viên nữ nhưng không thấy loại nghỉ kinh nguyệt trong dropdown?**  
A: Kiểm tra 2 nguyên nhân: (1) Admin chưa tạo loại nghỉ này trong Danh mục → Loại ngày nghỉ; (2) Loại nghỉ đang bị đánh dấu "Không hiển thị trên Portal" (`NotSelectedInPortal = true`). Liên hệ HR quản trị để kiểm tra.

**Q: Tôi đã hủy đơn nghỉ kinh nguyệt ngày 11/07, tại sao vẫn không đăng ký được ngày 13/07?**  
A: Đơn đã hủy không tính vào bộ đếm (ApprovedCount), nhưng hệ thống chỉ tham chiếu ngày được **duyệt gần nhất** để kiểm tra liên tục. Nếu ngày 10/07 đã được duyệt và 11/07 đã hủy, thì ngày kế tiếp hợp lệ vẫn là 11/07 (ngày sau ngày được duyệt gần nhất).

**Q: Tháng trước tôi đã hết quota 3 ngày, tháng này có đăng ký được không?**  
A: Có. Bộ đếm reset tự động theo tháng dương lịch. Tháng 08 hoàn toàn độc lập với tháng 07.

**Q: BPNS đăng ký hộ nhân viên nữ có cần trải qua quy trình duyệt không?**  
A: Không. BPNS đăng ký hộ trực tiếp với trạng thái "Đã duyệt" (E_APPROVED), không cần qua workflow phê duyệt.

**Q: Tôi là Admin, đã thay đổi MaxConsecutiveDaysPerMonth từ 3 lên 5, điều này có ảnh hưởng đến các đơn đã duyệt không?**  
A: Không. Thay đổi chỉ áp dụng cho các đăng ký mới. Đơn đã duyệt giữ nguyên trạng thái.

**Q: Tôi không thấy nút Thêm mới trên màn hình Loại ngày nghỉ?**  
A: Kiểm tra lại quyền. Cần quyền **Create** trên màn hình `Cat_LeaveDayType`. Liên hệ quản trị hệ thống để cấp quyền.

**Q: Loại ngày nghỉ cũ (phép năm, ốm đau...) có bị ảnh hưởng gì không?**  
A: Không. Các loại nghỉ cũ có `ApplyGender = NULL` hoặc `'All'` và `IsRequireConsecutive = 0` sẽ hoạt động hoàn toàn bình thường như trước. 3 quy tắc mới chỉ kích hoạt khi loại nghỉ được cấu hình tương ứng.

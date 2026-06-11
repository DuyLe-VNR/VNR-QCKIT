Component Role – Định nghĩa Control đặc thù của sản phẩm

Nguyên tắc áp dụng

Ưu tiên bộ role chuẩn (ARIA roles: button, textbox, checkbox, listbox, dialog, v.v.) cho các element thông thường.

File này bổ sung thêm các role đặc thù của sản phẩm – chỉ áp dụng khi element khớp với mô tả container bên dưới.

Khi một element vừa khớp role chuẩn vừa khớp role đặc thù thì ưu tiên role đặc thù của dự án.

Bảng định nghĩa Component **Role**

**
vnr-input**

Container: tag vnr-input

Input selector: nz-input-group input

Label của control: nz-form-label label

/* Container */
vnr-input

/* Truy cập input */
vnr-input nz-input-group input

/* Label gắn với control */
vnr-input nz-form-label label

/* Gợi ý lấy label text */
vnr-input nz-form-label label

/* Gợi ý lấy placeholder */
vnr-input nz-input-group input[placeholder]

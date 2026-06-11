Component Rule – Định nghĩa Control đặc thù của sản phẩm

Nguyên tắc áp dụng

Ưu tiên bộ Rule chuẩn (ARIA Rules: button, textbox, checkbox, listbox, dialog, v.v.) cho các element thông thường.

File này bổ sung thêm các Rule đặc thù của sản phẩm – chỉ áp dụng khi element khớp với mô tả container bên dưới.

Khi một element vừa khớp Rule chuẩn vừa khớp Rule đặc thù thì ưu tiên Rule đặc thù của dự án.

Bảng định nghĩa Component Rule

Container: div chứa class ms-date-picker-container	

Input selector: input.input-date

Format hiển thị: lấy từ thuộc tính placeholder của input.input-date

Label của control: .ms-input-title

/* Container */
div.ms-date-picker-container

/* Truy cập input */
div.ms-date-picker-container input.input-date

/* Label gắn với control */
div.ms-date-picker-container .ms-input-title



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


msradio

Container (một item): thẻ label chứa class con-ms-radio

Input thực: input[type="radio"] bên trong label

Text label: .ms-radio--label

Group container: div.ms-radio-group – bao ngoài nhiều radio item; radio thường không đứng một mình mà nằm trong group này

/* Group bao ngoài */
div.ms-radio-group

/* Một item radio */
div.ms-radio-group label.con-ms-radio

/* Input giá trị thực */
div.ms-radio-group label.con-ms-radio input[type="radio"]

/* Text label của item */
div.ms-radio-group label.con-ms-radio .ms-radio--label


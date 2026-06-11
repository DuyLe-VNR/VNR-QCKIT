Component Role – Định nghĩa Control đặc thù của sản phẩm

Nguyên tắc áp dụng

Ưu tiên bộ role chuẩn (ARIA roles: button, textbox, checkbox, listbox, dialog, v.v.) cho các element thông thường.

File này bổ sung thêm các role đặc thù của sản phẩm – chỉ áp dụng khi element khớp với mô tả container bên dưới.

Khi một element vừa khớp role chuẩn vừa khớp role đặc thù thì ưu tiên role đặc thù của dự án.

Bảng định nghĩa Component Role

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


msinput

Container: div chứa class ms-input

Input selector: .ms-input--input

Label của control: .ms-input-title

/* Container */
div.ms-input

/* Truy cập input */
div.ms-input .ms-input--input

/* Label gắn với control */
div.ms-input .ms-input-title


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


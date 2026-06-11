Component Role – Định nghĩa Control đặc thù của sản phẩm

Nguyên tắc áp dụng

Ưu tiên bộ role chuẩn (ARIA roles: button, textbox, checkbox, listbox, dialog, v.v.) cho các element thông thường.

File này bổ sung thêm các role đặc thù của sản phẩm – chỉ áp dụng khi element khớp với mô tả container bên dưới.

Khi một element vừa khớp role chuẩn vừa khớp role đặc thù thì ưu tiên role đặc thù của dự án.

> Sinh bởi: /qc_init_component — 2026-06-09
> Nguồn: vnr-qckit/detected_components/ (3 files: component_temp_cat_leave_day_type.md, component_temp_cat_grade_attendance.md, component_temp_att_leave_day.md)

---

## k-textbox

Container: div chứa div.FieldTitle và div.FieldValue

Input selector: div.FieldValue input.k-textbox

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Truy cập input */
div.FieldValue input.k-textbox

/* Label gắn với control */
div.FieldTitle label

/* Gợi ý lấy label text */
div.FieldTitle label

/* Placeholder */
div.FieldValue input.k-textbox[placeholder]

---

## k-combobox

Container: span.k-widget.k-combobox

Input selector: input.k-input

Label của control: [TODO: tùy context — thường là label liền trước container]

/* Container */
span.k-combobox

/* Truy cập input */
span.k-combobox input.k-input

/* Dropdown button */
span.k-combobox span.k-select

/* Placeholder */
span.k-combobox input.k-input[placeholder]

---

## checkbox

Container: div chứa div.FieldTitle150 và div.FieldValue

Input selector: div.FieldValue input[type="checkbox"]

Label của control: div.FieldTitle150 label

/* Container */
div:has(div.FieldTitle150)

/* Input checkbox */
div.FieldValue input[type="checkbox"]

/* Label */
div.FieldTitle150 label

---

## k-button

Container: a.k-button hoặc button.k-button

Input selector: (chính element — không có input con)

Label của control: text content của element

/* Container (link style) */
a.k-button

/* Container (button style) */
button.k-button

/* Button với icon */
a.k-button span.k-icon

/* Text label */
a.k-button

---

## k-select

Container: span.k-widget.k-dropdown

Input selector: span.k-input

Label của control: [TODO: tùy context — thường là label liền trước container]

/* Container */
span.k-dropdown

/* Giá trị hiển thị */
span.k-dropdown span.k-input

/* Nút mở dropdown */
span.k-dropdown span.k-select

---

## k-datepicker

Container: span.k-widget.k-datepicker

Input selector: input.k-input

Label của control: [TODO: tùy context — thường là label liền trước container]

/* Container */
span.k-datepicker

/* Input ngày */
span.k-datepicker input.k-input

/* Nút mở calendar */
span.k-datepicker span.k-select

/* Placeholder */
span.k-datepicker input.k-input[placeholder]

---

## k-timepicker

Container: span.k-widget.k-timepicker

Input selector: input.k-input

Label của control: [TODO: tùy context — thường là label liền trước container]

/* Container */
span.k-timepicker

/* Input giờ */
span.k-timepicker input.k-input

/* Nút mở time picker */
span.k-timepicker span.k-select

---

## textarea

Container: div chứa div.FieldTitle và div.FieldValue

Input selector: div.FieldValue textarea

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Textarea */
div.FieldValue textarea

/* Label */
div.FieldTitle label

---

## numeric

Container: div chứa div.FieldTitle và div.FieldValue (input type="number" hoặc k-numerictextbox)

Input selector: div.FieldValue input[type="number"]

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Input số */
div.FieldValue input[type="number"]

/* Hoặc Kendo NumericTextBox */
span.k-numerictextbox input.k-input

/* Label */
div.FieldTitle label

---

## text-formula

Container: div chứa div.FieldTitle và div.FieldValue (input công thức / expression editor)

Input selector: div.FieldValue input[type="text"]

Label của control: div.FieldTitle label

/* Container */
div:has(div.FieldTitle, div.FieldValue)

/* Input công thức */
div.FieldValue input[type="text"]

/* Label */
div.FieldTitle label

/* Ghi chú: text-formula thường là input text thường — cần xác nhận thêm nếu dùng expression editor đặc thù */

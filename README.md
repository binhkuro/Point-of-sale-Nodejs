- Dùng lệnh "yarn install" để tải lại các package trước đó sau mỗi lần pull code về (vì có thể ai đó đã download 1 package mới)
- **Không** push thư mục node_modules
- thay vì "node app.js" để chạy thì ta có thể "yarn nodemon app.js". Câu lệnh này sẽ chạy project 1 lần duy nhất và **tự động update** website mỗi khi chúng ta sửa code (giống Live Server). Tiết kiệm nhiều thời gian thay vì cứ "node app.js" liên tục
- File css, js viết riêng dành cho giao diện (nếu có) cần đặt tên file giống với tên file handlebars
VD: home.css, home.js sẽ áp dụng cho file home.handlebars
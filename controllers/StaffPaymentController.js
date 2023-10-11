function getStaffPaymentPage(req, res) {

    // Render giao diện "staff-payment.handlebars" và truyền dữ liệu thanh toán của nhân viên nếu có
    res.render('staff-payment'); // 'staff-payment' là tên tệp .handlebars cho giao diện thanh toán của nhân viên
}

// Xuất hàm xử lý "getStaffPaymentPage" để có thể sử dụng trong tệp khác
module.exports = {
    getStaffPaymentPage,
};
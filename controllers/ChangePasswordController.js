function getChangePasswordPage(req, res) {

    // Render giao diện "changepassword.handlebars" và truyền dữ liệu sản phẩm nếu có
    res.render('changepassword'); // 'changepassword' là tên tệp .handlebars cho giao diện đổi mật khẩu
}

// Xuất hàm xử lý "getChangePasswordPage" để có thể sử dụng trong tệp khác
module.exports = {
    getChangePasswordPage,
};
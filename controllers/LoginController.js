function getLoginPage(req, res) {

    // Render giao diện "login.handlebars" và truyền dữ liệu sản phẩm nếu có
    res.render('login'); // 'login' là tên tệp .handlebars cho giao diện đổi mật khẩu
}

// Xuất hàm xử lý "getLoginPage" để có thể sử dụng trong tệp khác
module.exports = {
    getLoginPage,
};
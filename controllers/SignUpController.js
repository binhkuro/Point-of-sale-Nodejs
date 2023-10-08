function getSignUpPage(req, res) {

    // Render giao diện "signup.handlebars" và truyền dữ liệu sản phẩm nếu có
    res.render('signup'); // 'signup' là tên tệp .handlebars cho giao diện đổi mật khẩu
}

// Xuất hàm xử lý "getSignUpPage" để có thể sử dụng trong tệp khác
module.exports = {
    getSignUpPage,
};
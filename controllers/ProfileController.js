function getProfilePage(req, res) {
    // Thực hiện các logic xử lý hoặc lấy dữ liệu hồ sơ người dùng ở đây (nếu cần)
    
    // Render giao diện "profile.handlebars" và truyền dữ liệu hồ sơ người dùng nếu có
    res.render('profile'); // 'profile' là tên tệp .handlebars cho giao diện trang hồ sơ
}

// Xuất hàm xử lý "getProfilePage" để có thể sử dụng trong tệp khác
module.exports = {
    getProfilePage,
};
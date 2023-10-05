function getDetailPage(req, res) {

    // Render giao diện "detail.handlebars" và truyền dữ liệu sản phẩm nếu có
    res.render('detail'); // 'detail' là tên tệp .handlebars cho giao diện chi tiết sản phẩm
}

// Xuất hàm xử lý "getDetailPage" để có thể sử dụng trong tệp khác
module.exports = {
    getDetailPage,
};
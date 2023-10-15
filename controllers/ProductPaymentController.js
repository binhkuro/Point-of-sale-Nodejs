function getProductPaymentPage(req, res) {

    // Render giao diện "product-payment.handlebars" và truyền dữ liệu sản phẩm nếu có
    res.render('product-payment'); // 'product-payment' là tên tệp .handlebars cho giao diện thanh toán sp
}

// Xuất hàm xử lý "getProductPaymentPage" để có thể sử dụng trong tệp khác
module.exports = {
    getProductPaymentPage,
};
function getInvoicePage(req, res) {
    // Render giao diện "invoice.handlebars"
    res.render('invoice', {layout: null}); // 'invoice' là tên tệp .handlebars cho giao diện hóa đơn bán hàng
}

// Xuất hàm xử lý "getInvoicePage" để có thể sử dụng trong tệp khác
module.exports = {
    getInvoicePage,
};
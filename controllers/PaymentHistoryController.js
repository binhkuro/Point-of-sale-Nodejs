// Định nghĩa một hàm xử lý yêu cầu của trang xem lịch sử thanh toán của khách hàng
function getPaymentHistoryPage(req, res) {
    // Trả về lịch sử thanh toán của khách hàng hoặc thực hiện các logic xử lý khác ở đây
    res.render('payment-history');
}
  
  // Xuất hàm xử lý trang lịch sử thanh toán của khách hàng để có thể sử dụng trong tệp khác
  module.exports = {
    getPaymentHistoryPage,
};
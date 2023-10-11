// Định nghĩa một hàm xử lý yêu cầu của trang chi tiết mặt hàng trong lịch sử giao hàng
function getDetailOrderPage(req, res) {
    // Trả về trang chi tiết mặt hàng trong lịch sử giao hàng hoặc thực hiện các logic xử lý khác ở đây
    res.render('detail-order');
}
  
  // Xuất hàm xử lý trang chủ để có thể sử dụng trong tệp khác
  module.exports = {
    getDetailOrderPage,
};
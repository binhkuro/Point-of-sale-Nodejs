// Định nghĩa một hàm xử lý yêu cầu của trang chủ
function getHomePage(req, res) {
    // Trả về trang chủ hoặc thực hiện các logic xử lý khác ở đây
    res.render('index');
}
  
  // Xuất hàm xử lý trang chủ để có thể sử dụng trong tệp khác
  module.exports = {
    getHomePage,
};
let OrderDetail = require("../models/orderdetail");

async function getOrderDetail(req, res) {
    let orderdetails = await getOrderDetails();
    res.render('detail-order', { orderdetails, success: req.flash("success"), error: req.flash("error") });
}

async function getOrderDetails() {
    try {
        let orderdetails = await OrderDetail.find().lean();
        return orderdetails;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

// Khởi tạo 1 số dữ liệu mẫu để chạy chương trình
async function initData() {
    // Trước khi khởi tạo dữ liệu mẫu thì ta cần xóa các dữ liệu hiện có
    await OrderDetail.deleteMany()

    let orderdetail = new OrderDetail({
        orderId: "12112023000000",
        barcode: "00000000", 
        productName: "Iphone 15 Pro Max 256Gb",
        price: 10000000,
        amount: 5,
        totalPrice: 50000000
    });

    await orderdetail.save()

    let orderdetail2 = new OrderDetail({
        orderId: "13112023000000",
        barcode: "11111111", 
        productName: "Ipad Air 7",
        price: 20000000,
        amount: 10,
        totalPrice: 200000000 
    });

    await orderdetail2.save()
}

module.exports = {
    getOrderDetail,
    initData
};
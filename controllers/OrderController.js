let Order = require("../models/order");

async function getOrderHistory(req, res) {
    let orders = await getOrders();
    res.render('payment-history', { orders, success: req.flash("success"), error: req.flash("error") });
}
async function getOrders() {
    try {
        let orders = await Order.find().lean();
        return orders;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

function getOrderHistoryByPhone(req, res) {
    Order.findOne({
        customerPhone: req.params.customerPhone,
    })
    .then(order => {
        let options = {
            orderId: order.orderId, 
            customerPhone: order.customerPhone,
            totalPrice: order.totalPrice, 
            priceGivenByCustomer: order.priceGivenByCustomer, 
            excessPrice: order.excessPrice, 
            dateOfPurchase: order.dateOfPurchase,
            totalAmount: order.totalAmount,  
            success: req.flash("success"), 
            error: req.flash("error")
        };

        res.render("payment-history", options)
    })
}

// Khởi tạo 1 số dữ liệu mẫu để chạy chương trình
async function initData() {
    // Trước khi khởi tạo dữ liệu mẫu thì ta cần xóa các dữ liệu hiện có
    await Order.deleteMany()

    let order = new Order({
        orderId: "12112023000000", 
        customerPhone: "0123456789",
        totalPrice: 100000000, 
        priceGivenByCustomer: 120000000, 
        excessPrice: 20000000, 
        dateOfPurchase: "12/11/2023",
        totalAmount: 10  
    });

    await order.save()

    let order2 = new Order({
        orderId: "13112023000000", 
        customerPhone: "0123456788",
        totalPrice: 50000000, 
        priceGivenByCustomer: 100000000, 
        excessPrice: 50000000, 
        dateOfPurchase: "13/11/2023",
        totalAmount: 5 
    });

    await order2.save()
}

module.exports = {
    getOrderHistory,
    getOrderHistoryByPhone,
    initData
};
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

async function addOrder(req, res) {
    let currentDate = new Date();
    let phone = req.body.phone;
    let formattedDate = `${currentDate.getDate()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    let formattedOrderId = `${currentDate.getDate()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getFullYear()}${(currentDate.getHours()).toString().padStart(2, '0')}${(currentDate.getMinutes()).toString().padStart(2, '0')}${(currentDate.getSeconds()).toString().padStart(2, '0')}${phone}`;

    if(req.body.phone === "" || req.body.fullname === "Không tìm thấy khách hàng" || req.body.address === "Không tìm thấy khách hàng" || req.body.fullname === "" || req.body.address === "") {
        req.flash("error", "Thông tin khách hàng không hợp lệ");
        return res.render("product-payment", { error: req.flash("error") });
    }

    let order = new Order({
        orderId: formattedOrderId,
        customerPhone: req.body.phone,
        totalPrice: req.body.totalAmountInput, 
        priceGivenByCustomer: 0, 
        excessPrice: 0, 
        dateOfPurchase: formattedDate,
        totalAmount: req.body.totalQuantityInput
    });

    order.save()
    .then(newOrder => {
        res.redirect("invoice");
    })
    .catch(error => {
        req.flash("error", "Có lỗi khi tạo hóa đơn");
        res.render("product-payment", {error: req.flash("error")});
    });
}

// Cập nhật lại priceGivenByCustomer và excessPrice
async function updateOrder(req, res) {
    let orderId = req.body.orderId;
    let priceGivenByCustomer = req.body.priceGivenByCustomer;
    let excessPrice = req.body.excessPrice;

    let order = await Order.findOne({orderId: orderId});
    if(order === null)
        return res.json({code: 1, error: "Hóa đơn không tồn tại"});

    order.priceGivenByCustomer = priceGivenByCustomer;
    order.excessPrice = excessPrice;
    await order.save();
    
    res.json({code: 0, success: "In hóa đơn bán hàng thành công!"});
}

module.exports = {
    getOrderHistory,
    getOrderHistoryByPhone,
    initData,
    addOrder,
    updateOrder
};
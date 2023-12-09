let OrderDetail = require("../models/orderdetail");

async function getOrderDetail(req, res) {
    const ITEMS_PER_PAGE = 10; // Số lượng item mỗi trang
    const page = parseInt(req.query.page) || 1; // Lấy số trang hiện tại
    const nextPage = page + 1;
    const prevPage = page - 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    try {
        const orderdetails = await getOrderDetails();

        const totalOrderDetails = orderdetails.length;
        const totalPages = Math.ceil(totalOrderDetails / ITEMS_PER_PAGE);
        const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

        const paginatedOrderDetails = orderdetails.slice(skip, skip + ITEMS_PER_PAGE);

        res.render('detail-order', { 
            orderdetails: paginatedOrderDetails, 
            success: req.flash("success"), 
            error: req.flash("error"), 
            email: req.session.email,
            currentPage: page,
            nextPage: nextPage,
            prevPage: prevPage,
            totalPages: totalPages,
            pages: pages,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getOrderDetails() {
    try {
        let orderdetails = await OrderDetail.find().lean();
        return orderdetails;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

async function getOrderDetailById(req, res) {
    let orderId = req.params.orderId;

    const ITEMS_PER_PAGE = 10; // Số lượng item mỗi trang
    const page = parseInt(req.query.page) || 1; // Lấy số trang hiện tại
    const nextPage = page + 1;
    const prevPage = page - 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    try {
        const orderDetails = await OrderDetail.find({ orderId: { $regex: `^${orderId.slice(0, -3)}` } }).lean();
        let email = req.session.email;

        const totalOrderDetails = orderDetails.length;
        const totalPages = Math.ceil(totalOrderDetails / ITEMS_PER_PAGE);
        const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

        const paginatedOrderDetails = orderDetails.slice(skip, skip + ITEMS_PER_PAGE);

        if(email === "admin@gmail.com")
            res.render("detail-order", {
                layout: "admin", 
                orderDetails: paginatedOrderDetails, 
                success: req.flash("success"), 
                error: req.flash("error"),
                currentPage: page,
                nextPage: nextPage,
                prevPage: prevPage,
                totalPages: totalPages,
                pages: pages,
            });
        else
            res.render("detail-order", {
                email: email, 
                orderDetails: paginatedOrderDetails, 
                success: req.flash("success"), 
                error: req.flash("error"),
                currentPage: page,
                nextPage: nextPage,
                prevPage: prevPage,
                totalPages: totalPages,
                pages: pages,
            });
            
    } catch (error) {
        console.error('Error fetching order details by order id:', error);
        res.status(500).send('Internal Server Error');
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
    getOrderDetailById,
    getOrderDetail,
    initData
};
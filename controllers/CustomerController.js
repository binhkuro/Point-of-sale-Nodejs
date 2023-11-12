let Customer = require("../models/customer");

async function addCustomer(req, res) {
    if(req.body.phone === "" || req.body.fullname === "" || req.body.address === "") {
        req.flash("error", "Vui lòng không bỏ trống thông tin");
        return res.render("product-payment", {error: req.flash("error"), phone: req.body.phone, fullname: req.body.fullname, address: req.body.address});
    }

    let customer = new Customer({
        phone: req.body.phone, 
        fullname: req.body.fullname,
        address: req.body.address
    });

    customer.save()
    .then(newCustomer => {
        res.redirect("invoice");
    })
    .catch(error => {
        req.flash("error", "Người dùng đã tồn tại");//tồn tại rồi thì in hóa đơn luôn
        res.render("product-payment", {error: req.flash("error"), email: req.body.email, fullname: req.body.fullname, address: req.body.address});
    });
}

function findCustomer(req, res) {
    let phone = req.params.phone;

    Customer.findOne({
        phone: phone
    })
    .then(customer => {
        if(!customer) 
            return res.json({ fullname: "Không tìm thấy khách hàng", address: "Không tìm thấy khách hàng" })
                
        res.json({ fullname: customer.fullname, address: customer.address })
    })
    .catch(error => {
        res.json({ fullname: "Lỗi không tìm thấy khách hàng", address: "Lỗi không tìm thấy khách hàng" })
    });
}

async function getStaffPaymentPage(req, res) {
    let customers = await getCustomers();
    res.render('staff-payment', { customers, success: req.flash("success"), error: req.flash("error") });
}

async function getCustomers() {
    try {
        let customers = await Customer.find().lean();
        return customers;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

// Khởi tạo 1 số dữ liệu mẫu để chạy chương trình
async function initData() {
    // Trước khi khởi tạo dữ liệu mẫu thì ta cần xóa các dữ liệu hiện có
    await Customer.deleteMany()

    let customer = new Customer({
        phone: "0123456789", 
        fullname: "Nguyễn Văn A",
        address: "A"
    });

    await customer.save()

    let customer2 = new Customer({
        phone: "0223456789", 
        fullname: "Nguyễn Văn B",
        address: "B"
    });

    await customer2.save()
}

module.exports = {
    addCustomer,
    findCustomer,
    getStaffPaymentPage,
    initData
};
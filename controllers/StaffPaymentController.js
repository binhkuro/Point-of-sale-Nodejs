let Customer = require("../models/customer");
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
const path = require('path');

async function getStaffPaymentPage(req, res) {
    try {
        const customer = await Customer.find().lean();
        res.render('staff-payment', { customer, success: req.flash("success"), error: req.flash("error") });
    } catch (error) {
        res.status(500).send("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm từ cơ sở dữ liệu.");
    }
}

async function addCustomer(req, res) {
    if(req.body.phone === "" || req.body.fullname === "" || req.body.address === "") {
        req.flash("error", "Vui lòng không bỏ trống thông tin");
        return res.render("staff-payment", {error: req.flash("error"), phone: req.body.phone, fullname: req.body.fullname, address: req.body.address});
    }

    let customer = new Customer({
        phone: req.body.phone, 
        fullname: req.body.fullname,
        address: req.body.address
    });

    customer.save()
    .then(newCustomer => {
        req.flash("success", "Thêm người dùng thành công.");
        return res.redirect("/staff-payment");
    })
    .catch(error => {
        req.flash("error", "Người dùng đã tồn tại");
        res.redirect("/staff-payment");
    });
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

// Xuất hàm xử lý "getStaffPaymentPage" để có thể sử dụng trong tệp khác
module.exports = {
    getStaffPaymentPage,
    initData,
    addCustomer
};
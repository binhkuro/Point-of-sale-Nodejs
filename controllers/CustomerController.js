let Customer = require("../models/customer");

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

module.exports = {
    findCustomer
};
let Product = require("../models/product");
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
const path = require('path');

function getProductManagementPage(req, res) {
    res.render('productManagement');
}

// Khởi tạo 1 số dữ liệu mẫu để chạy chương trình
async function initData() {
    // Trước khi khởi tạo dữ liệu mẫu thì ta cần xóa các dữ liệu hiện có
    await Product.deleteMany()

    let product = new Product({
        barcode: "00000000", 
        productName: "Iphone 15 Pro Max 256Gb",
        importPrice: 20000000,
        retailPrice: 30000000,
        category: "Phone",
        creationDate: "03/08/2023",
        image: "iphone15.png"
    });

    await product.save()

    let product2 = new Product({
        barcode: "11111111", 
        productName: "Iphone 14 Pro 128Gb",
        importPrice: 15000000,
        retailPrice: 22000000,
        category: "Tablet",
        creationDate: "15/12/2022",
        image: "ipadair7.png"
    });

    await product2.save()
}

module.exports = {
    getProductManagementPage,
    initData
};
let Product = require("../models/product");

async function getHomePage(req, res) {
    try {
        let products = await Product.find().lean();
        res.render('index', { products });
    } catch (error) {
        res.status(500).send("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm từ cơ sở dữ liệu.");
    }
}

module.exports = {
    getHomePage,
};
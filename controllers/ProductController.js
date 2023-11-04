let Product = require("../models/product");
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
const path = require('path');

async function getProductManagementPage(req, res) {
    try {
        const products = await Product.find().lean();
        res.render('product-management', { products });
    } catch (error) {
        res.status(500).send("Đã xảy ra lỗi khi lấy dữ liệu sản phẩm từ cơ sở dữ liệu.");
    }
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

async function addProduct(req, res) {
    let form = new multiparty.Form();

    form.parse(req, async (error, data, files) => {
        if (error) {
            console.log("Error File upload: " + error);
            req.flash("error", "Đã xảy ra lỗi khi xử lý upload file");
            return res.render('product-management', { error: req.flash("error") });
        }

        if (!data.barcode || !data.productName || !data.importPrice || !files.file || files.file.length === 0 || data.barcode[0] === '' || data.productName[0] === "" || data.importPrice[0] === "" || files.file[0].originalFilename === '') {
            req.flash("error", "Vui lòng nhập đầy đủ thông tin và chọn file ảnh.");
            return res.render('product-management', { error: req.flash("error") });
        }

        try {
            let file = files.file[0];
            let tempPath = file.path;
            let savePath = __dirname + "/public/uploads/" + file.originalFilename;

            await fsx.copy(tempPath, savePath);

            let product = new Product({
                barcode: data.barcode[0],
                productName: data.productName[0],
                importPrice: data.importPrice[0],
                retailPrice: data.retailPrice[0],
                category: data.category[0],
                creationDate: data.creationDate[0],
                image: file.originalFilename
            });

            product.save()
                .then(newProduct => {
                    req.flash("success", "Thêm sản phẩm thành công.");
                    res.render("product-management", { success: req.flash("success") });
                })
                .catch(error => {
                    req.flash("error", "Sản phẩm này đã tồn tại hoặc có lỗi khi lưu.");
                    res.render("product-management", { error: req.flash("error") });
                });
        } catch (error) {
            req.flash("error", "Đã xảy ra lỗi khi xử lý thêm sản phẩm.");
        }
    });
}

module.exports = {
    getProductManagementPage,
    initData,
    addProduct,
};
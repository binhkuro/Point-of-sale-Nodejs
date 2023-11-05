let Product = require("../models/product");
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
const path = require('path');

async function getProductManagementPage(req, res) {
    try {
        const products = await Product.find().lean();
        res.render('product-management', { products, success: req.flash("success"), error: req.flash("error") });
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
        category: "Điện thoại",
        creationDate: "03/08/2023",
        image: "iphone15.png"
    });

    await product.save()

    let product2 = new Product({
        barcode: "11111111", 
        productName: "Ipad Air 7",
        importPrice: 15000000,
        retailPrice: 22000000,
        category: "Máy tính bảng",
        creationDate: "15/12/2022",
        image: "ipadair7.png"
    });

    await product2.save()

    let product3 = new Product({
        barcode: "33333333", 
        productName: "Iphone 14 Pro 128Gb",
        importPrice: 15000000,
        retailPrice: 22000000,
        category: "Điện thoại",
        creationDate: "15/12/2022",
        image: "iphone14.png"
    });

    await product3.save()

    let product4 = new Product({
        barcode: "44444444", 
        productName: "Iphone 15 Pro 64Gb",
        importPrice: 15000000,
        retailPrice: 22000000,
        category: "Điện thoại",
        creationDate: "15/12/2022",
        image: "iphone15.png"
    });

    await product4.save()

    let product5 = new Product({
        barcode: "55555555", 
        productName: "Iphone 14 Pro 1Tb",
        importPrice: 15000000,
        retailPrice: 22000000,
        category: "Điện thoại",
        creationDate: "15/12/2022",
        image: "iphone14.png"
    });

    await product5.save()
}

async function addProduct(req, res) {
    let form = new multiparty.Form();

    form.parse(req, async (error, data, files) => {
        if (error) {
            console.log("Error File upload: " + error);
            const products = await Product.find().lean();
            req.flash("error", "Đã xảy ra lỗi khi xử lý upload file");
            return res.render("product-management", { error : req.flash("error"), products });
        }

        if (data.barcode[0] === '' || data.productName[0] === '' || data.importPrice[0] <= 0 || data.retailPrice[0] <= 0 || data.category[0] === '' || data.creationDate[0] === '' || files.image[0].originalFilename === '') {
            const products = await Product.find().lean();
            req.flash("error", "Vui lòng nhập đầy đủ thông tin và chọn file ảnh.");
            return res.render("product-management", { error : req.flash("error"), products });
        }

        try {
            let file = files.image[0];
            let tempPath = file.path;
            let savePath = path.join(__dirname, "../public/uploads/products", file.originalFilename);

            await fsx.copy(tempPath, savePath);

            let formattedDate = formatDate(data.creationDate[0]);

            let product = new Product({
                barcode: data.barcode[0],
                productName: data.productName[0],
                importPrice: data.importPrice - 0, // Conversion to float
                retailPrice: data.retailPrice - 0, // Conversion to float
                category: data.category[0],
                creationDate: formattedDate,
                image: file.originalFilename
            });

            product.save()
                .then(newProduct => {
                    req.flash("success", "Thêm sản phẩm thành công.");
                    return res.redirect("/product-management");
                })
                .catch(error => {
                    req.flash("error", "Sản phẩm này đã tồn tại hoặc có lỗi khi lưu.");
                    res.redirect("/product-management");
                });
        } catch (error) {
            req.flash("error", "Đã xảy ra lỗi khi xử lý thêm sản phẩm.");
            return res.redirect("/product-management");
        }
    });
}

async function editProduct(req, res) {
    let form = new multiparty.Form();

    form.parse(req, async (error, data, files) => {
        if (error) {
            console.log("Error File upload: " + error);
            const products = await Product.find().lean();
            req.flash("error", "Đã xảy ra lỗi khi xử lý upload file");
            return res.render("product-management", { error : req.flash("error"), products });
        }

        if (data.barcode[0] === '' || data.productName[0] === '' || data.importPrice[0] <= 0 || data.retailPrice[0] <= 0 || data.category[0] === '' || data.creationDate[0] === '') {
            const products = await Product.find().lean();
            req.flash("error", "Vui lòng nhập đầy đủ thông tin.");
            return res.render("product-management", { error : req.flash("error"), products });
        }

        try {
            let product = await Product.findById(data.productId[0]);

            if (!product) {
                req.flash("error", "Không tìm thấy sản phẩm để chỉnh sửa.");
                return res.redirect("/product-management");
            }

            // Kiểm tra và cập nhật dữ liệu sản phẩm
            product.barcode = data.barcode[0];
            product.productName = data.productName[0];
            product.importPrice = data.importPrice - 0; // Chuyển đổi sang dạng số
            product.retailPrice = data.retailPrice - 0; // Chuyển đổi sang dạng số
            product.category = data.category[0];
            product.creationDate = formatDate(data.creationDate[0]);

            if (files.image && files.image[0].originalFilename !== '') {
                let file = files.image[0];
                let tempPath = file.path;
                let savePath = path.join(__dirname, "../public/uploads/products", file.originalFilename);

                await fsx.copy(tempPath, savePath);
                product.image = file.originalFilename;
            }

            await product.save();

            req.flash("success", "Sửa sản phẩm thành công.");
            return res.redirect("/product-management");
        } catch (error) {
            req.flash("error", "Đã xảy ra lỗi khi chỉnh sửa sản phẩm.");
            return res.redirect("/product-management");
        }
    });
}

async function deleteProduct(req, res) {
    try {
        const barcode = req.body.barcode;
        
        console.log(barcode);

        const deletedProduct = await Product.findOneAndDelete({ barcode });

        if (deletedProduct) {
            const products = await Product.find().lean();

            req.flash("success", "Xóa sản phẩm thành công.");
            res.render('product-management', { success: req.flash('message'), products });
        } else {
            req.flash("error", "Không thể xóa sản phẩm. Sản phẩm không tồn tại.");
            res.redirect('/product-management');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        req.flash("error", "Lỗi trong quá trình xóa sản phẩm.");
        res.redirect('/product-management');
    }
}

function formatDate(inputDate) {
    const parts = inputDate.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

module.exports = {
    getProductManagementPage,
    initData,
    addProduct,
    editProduct,
    deleteProduct
};
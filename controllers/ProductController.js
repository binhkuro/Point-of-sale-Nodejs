let Product = require("../models/product");
let Customer = require("../models/customer");
let Order = require("../models/order");
let OrderDetail = require("../models/orderdetail");
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
const path = require('path');

async function getProductManagementPage(req, res) {
    let products = await getProducts();
    res.render('product-management', { products, success: req.flash("success"), error: req.flash("error") });
}

async function getHomePage(req, res) {
    let products = await getProducts();
    res.render('index', { products: products, email: req.session.email});
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
            return res.render("product-management", { error: req.flash("error"), products });
        }

        if (data.barcode[0] === '' || data.productName[0] === '' || data.importPrice[0] <= 0 || data.retailPrice[0] <= 0 || data.category[0] === '' || data.creationDate[0] === '') {
            req.flash("error", "Vui lòng nhập đầy đủ thông tin.");
            return res.redirect("/product-management");
        }

        try {
            const barcode = data.barcode[0]; 

            let product = await Product.findOne({ barcode }).exec();

            if (!product) {
                req.flash("error", "Không tìm thấy sản phẩm để chỉnh sửa.");
                return res.redirect("/product-management");
            }

            product.productName = data.productName[0];
            product.importPrice = data.importPrice[0] - 0;
            product.retailPrice = data.retailPrice[0] - 0;
            product.category = data.category[0];
            product.creationDate = formatDate(data.creationDate[0]);

            let file = files.image[0];
            if (file.originalFilename !== "") {
                let tempPath = file.path;
                let savePath = path.join(__dirname, "../public/uploads/products", file.originalFilename);

                await fsx.copy(tempPath, savePath);
                product.image = file.originalFilename;
            }

            await product.save();

            req.flash("success", "Chỉnh sửa sản phẩm thành công.");
            return res.render("product-management", { product });
        } catch (error) {
            req.flash("error", "Đã xảy ra lỗi khi chỉnh sửa sản phẩm.");
            return res.redirect("/product-management");
        }
    });
}

async function deleteProduct(req, res) {
    try {
        let barcode = req.body.barcode;
        let products;

        // Kiểm tra xem sản phẩm có từng được mua rồi hay không
        let orderDetail = await OrderDetail.findOne({barcode: barcode});

        if (orderDetail) {
            products = await Product.find().lean();

            req.flash("error", "Không thể xóa sản phẩm này vì đã được mua trước đó.");
            return res.render('product-management', { error: req.flash('error'), products });
        }
        
        let deletedProduct = await Product.findOneAndDelete({ barcode });

        if (deletedProduct) {
            products = await Product.find().lean();

            req.flash("success", "Xóa sản phẩm thành công.");
            res.render('product-management', { success: req.flash('success'), products });
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

async function getProducts() {
    try {
        let products = await Product.find().lean();
        return products;
    } catch (error) {
        throw new Error("Đã xảy ra lỗi khi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

async function searchProduct(req, res) {
    try {
        const barcode = req.body.barcode;
        let results;

        if (!barcode || barcode.trim() === '') {
            return res.json([]);
        } else {
            results = await Product.find({ barcode: { $regex: barcode, $options: 'i' } }).lean();
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Đã xảy ra lỗi khi tìm kiếm sản phẩm." });
    }
}

async function handlePayment(req, res) {
    try {
        const currentDate = new Date();
        const phone = req.body.phone;
        const formattedDate = `${currentDate.getDate()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        const formattedOrderId = `${currentDate.getDate()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getFullYear()}${(currentDate.getHours()).toString().padStart(2, '0')}${(currentDate.getMinutes()).toString().padStart(2, '0')}${(currentDate.getSeconds()).toString().padStart(2, '0')}${phone}`;

        if (req.body.phone === "" || req.body.fullname === "Không tìm thấy khách hàng" || req.body.address === "Không tìm thấy khách hàng" || req.body.fullname === "" || req.body.address === "") {
            req.flash("error", "Thông tin khách hàng không hợp lệ");
            return res.render("product-payment", { error: req.flash("error") });
        }

        const existingCustomer = await Customer.findOne({ phone: req.body.phone });

        if (existingCustomer) {
            existingCustomer.fullname = req.body.fullname;
            existingCustomer.address = req.body.address;
            await existingCustomer.save();
        } else {
            const newCustomer = new Customer({
                phone: req.body.phone,
                fullname: req.body.fullname,
                address: req.body.address
            });
            await newCustomer.save();
        }

        const order = new Order({
            orderId: formattedOrderId,
            customerPhone: req.body.phone,
            totalPrice: req.body.totalAmountInput,
            priceGivenByCustomer: 0,
            excessPrice: 0,
            dateOfPurchase: formattedDate,
            totalAmount: req.body.totalQuantityInput
        });
        await order.save();

        const productTable = await req.body.productTable;
        const parsedProductTable = JSON.parse(productTable);

        if (parsedProductTable.length === 0) {
            req.flash("error", "Chưa có sản phẩm trong giỏ hàng");
            return res.render("product-payment", { error: req.flash("error") });
        }

        let orderDetails = [];
        let counter = 1;

        for (const product of parsedProductTable) {
            let uniqueFormattedOrderId = `${formattedOrderId}${counter.toString().padStart(3, '0')}`;
            let totalPrice = product.total;

            const orderDetail = new OrderDetail({
                orderId: uniqueFormattedOrderId,
                barcode: product.barcode,
                productName: product.productName,
                price: product.retailPrice,
                amount: product.quantity,
                totalPrice: product.total
            });
            orderDetails.push(orderDetail);
            counter++;
        }

        await OrderDetail.insertMany(orderDetails);
        res.redirect(`invoice/${formattedOrderId}/${req.body.totalAmountInput}`);
    } catch (error) {
        req.flash("error", "Không thể thanh toán hóa đơn");
        res.render("product-payment", { error: req.flash("error") });
    }
}

module.exports = {
    getProductManagementPage,
    getHomePage,
    initData,
    addProduct,
    editProduct,
    deleteProduct,
    searchProduct,
    handlePayment
};
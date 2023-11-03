let mongoose = require("mongoose");

mongoose.Promise = global.Promise; // làm cho promise của mongo sẽ giống với promise của nodejs
let Schema = mongoose.Schema;

// Khai báo các thuộc tính cho model
let productSchema = new Schema({
    barcode: {
        type: String,
        unique: true, // Đảm bảo rằng giá trị barcode là duy nhất
        index: true,  // Tạo một index trên trường barcode để tối ưu tìm kiếm
    },
    productName: String,
    importPrice: Number, // int || double đều được
    retailPrice: Number,
    category: String, // Phone, Tablet, Watch, Adapter (cục sạc), Cable (dây sạc)
    creationDate: String, // dd/mm/yyyy -> ngày sản phẩm được sản xuất chứ không phải ngày ta tạo sản phẩm lưu lên web
    image: String // đường dẫn đến file hình ảnh
});

let Product = mongoose.model("Product", productSchema);
module.exports = Product
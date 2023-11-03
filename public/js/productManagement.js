$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function updateProduct() {
    $("#modalUpdate").modal("show");
}

function deleteProduct() {
    $("#modalDelete").modal("show");
}

// Khi nhấn vào nút chi tiết sản phẩm, thông tin sản phẩm sẽ được lấy và hiển thị tự động
function detailProduct(image, barcode, productName, category, importPrice, retailPrice, creationDate) {
    $("#modalDetailProductTitle").html('Thông tin sản phẩm ' + productName);

    $("#modalDetailProductImage").attr('src', '/uploads/products/' + image);
    $("#modalDetailProductBarcode").html('<b>BARCODE: </b>' + barcode);
    $("#modalDetailProductName").html('<b>Tên sản phẩm: </b>' + productName);
    $("#modalDetailProductCategory").html('<b>Danh mục: </b>' + category);
    $("#modalDetailProductImportPrice").html('<b>Giá nhập: </b>' + importPrice);
    $("#modalDetailProductRetailPrice").html('<b>Giá bán: </b>' + retailPrice);
    $("#modalDetailProductCreationDate").html('<b>Ngày tạo: </b>' + creationDate);

    $("#modalDetail").modal("show");
}
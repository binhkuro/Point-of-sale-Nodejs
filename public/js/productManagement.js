function updateProduct() {
    $("#modalUpdate").modal("show");
}

function deleteProduct() {
    $("#modalDelete").modal("show");
}

function detailProduct(image, barcode, name, catalog, importPrice, salePrice, creationDate) {
    $("#modalDetailProductTitle").html('Thông tin sản phẩm ' + name);

    $("#modalDetailProductImage").attr('src', '/uploads/products/' + image);
    $("#modalDetailProductBarcode").html('<b>BARCODE: </b>' + barcode);
    $("#modalDetailProductName").html('<b>Tên sản phẩm: </b>' + name);
    $("#modalDetailProductCatalog").html('<b>Danh mục: </b>' + catalog);
    $("#modalDetailProductImportPrice").html('<b>Giá nhập: </b>' + importPrice);
    $("#modalDetailProductSalePrice").html('<b>Giá bán: </b>' + salePrice);
    $("#modalDetailProductCreationDate").html('<b>Ngày tạo: </b>' + creationDate);

    $("#modalDetail").modal("show");
}
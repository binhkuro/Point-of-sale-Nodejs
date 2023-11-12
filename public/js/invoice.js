let phone = document.getElementById("phone");
let fullname = document.getElementById("fullname");
let address = document.getElementById("address");

function getCustomerInfo() {
    phone.value = phone.value.replace(/\D/g, '');

    if (phone.value.length === 10) {
        fetch("/customer/" + phone.value)
            .then(response => response.json())
            .then(json => {
                fullname.innerText = json.fullname;
                address.innerText = json.address;
            })
    }
    else {
        fullname.innerText = "";
        address.innerText = "";
    }
}

let priceGivenByCustomer = document.getElementById("priceGivenByCustomer");
let totalPrice = document.getElementById("totalPrice").innerText.replace(/[^\d]/g, ""); // xóa "." và "đ" trong tổng hóa đơn
let excessPrice = document.getElementById("excessPrice");

function calculateExcessPrice() {
    priceGivenByCustomer.value = priceGivenByCustomer.value.replace(/\D/g, '');

    if (priceGivenByCustomer.value === "")
        excessPrice.innerText = "";
    else
        excessPrice.innerText = (parseInt(priceGivenByCustomer.value) - parseInt(totalPrice)).toLocaleString("vi-VN") + "đ";
}

function printInvoice() {
    if (fullname.innerText === "" || address.innerText === "" ||
        fullname.innerText === "Không tìm thấy khách hàng" || address.innerText === "Không tìm thấy khách hàng" ||
        excessPrice.innerText === "" || parseInt(excessPrice.innerText.replace(/[^\d-]/g, '')) < 0)
        return alert("Thông tin hóa đơn không hợp lệ!");

    // TODO: Cập nhật 2 thuộc tính của Order: priceGivenByCustomer và excessPrice

    // Ẩn button in hóa đơn
    let printInvoice = document.getElementById("printInvoice");
    printInvoice.style.display = "none"

    html2pdf(document.body, {
        // TODO: tên hóa đơn sẽ là mã hóa đơn (order_id)
        //filename: 'downloaded-document.pdf',
    })

    // Hiện lại button in hóa đơn
    printInvoice.style.display = ""
    alert("In hóa đơn bán hàng thành công!");
}
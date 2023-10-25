let mailController = require('./MailController')

function getTimeOutPage(req, res) {
    // Render giao diện "timeout.handlebars"
    var email = req.query.email
    res.render('timeout', {email: email}); // 'timeout' là tên tệp .handlebars cho giao diện timeout
}

function resendEmail(req, res) {
    // let email = req.query;
    let email = req.body.email;
    let subject = "Xác thực tài khoản";
    const emailSentTime = Math.floor(new Date().getTime() / 1000);
    const currentTime = emailSentTime + 60000;
    // Tính khoảng thời gian đã trôi qua
    const timeElapsed = currentTime - emailSentTime;

    if (timeElapsed > 60000) {
        let content = `<a href="${process.env.APP_URL}/timeout?email=${email}"> Vui lòng nhấn vào đây để hoàn tất thủ tục tài khoản</a>`;
        mailController.sendMail(email, subject, content);
    } else {
        let content = `<a href="${process.env.APP_URL}/login"> Vui lòng nhấn vào đây để hoàn tất thủ tục tài khoản</a>`;
        mailController.sendMail(email, subject, content);
    }
    req.flash("success", "Gửi lại mail thành công. Vui lòng kiểm tra email của bạn.");
    res.render("timeout", {success: req.flash("success")});
}

// Xuất hàm xử lý "getInvoicePage" để có thể sử dụng trong tệp khác
module.exports = {
    getTimeOutPage,
    resendEmail,
};
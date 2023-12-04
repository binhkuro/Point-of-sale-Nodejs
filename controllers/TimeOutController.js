let mailController = require('./MailController')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function resendEmail(req, res) {
    let email = req.body.email;
    let subject = "Xác thực tài khoản";

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 5 });

    const hashedEmail = bcrypt.hashSync(email, 3);

    let content = `<a href="${process.env.APP_URL}/login?token=${token}&hashedEmail=${hashedEmail}"> Vui lòng nhấn vào đây để hoàn tất thủ tục tài khoản</a>`;
    mailController.sendMail(email, subject, content);	
}

// Xuất hàm xử lý "getInvoicePage" để có thể sử dụng trong tệp khác
module.exports = {
    resendEmail,
};
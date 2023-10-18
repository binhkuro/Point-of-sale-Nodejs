const mailer = require('../utils/mailer');
const { checkEmailExistence } = require('../utils/email-existence'); // Sử dụng module kiểm tra email tồn tại
const { isValidEmail } = require('../utils/email-validation'); // Sử dụng module kiểm tra email đúng dạng

async function sendLinkLogin(req, res, next) {
    const { email } = req.body;

    // Kiểm tra tính hợp lệ của địa chỉ email
    if (!isValidEmail(email)) {
        req.flash("error", "Địa chỉ email không hợp lệ!");
        res.render("signup", { error: req.flash("error") });
        return; // Dừng việc xử lý nếu email không hợp lệ
    }

    try {
        const emailExists = await checkEmailExistence(email);

        if (emailExists) {
            const subject = "Xác thực tài khoản";
            const content = `<a href="${process.env.APP_URL}/login"> Vui lòng nhấn vào đây để hoàn tất thủ tục tài khoản</a>`;
            await mailer.sendMail(email, subject, content);
            req.flash("message", "Gửi link xác thực thành công!");
            res.render("signup", { message: req.flash("message") });
        } else {
            req.flash("error", "Địa chỉ email không tồn tại!");
            res.render("signup", { error: req.flash("error") });
        }
    } catch (error) {
        req.flash("error", "Không thể gửi email xác thực!");
        res.render("signup", { error: req.flash("error") });
    }
}

module.exports = {
    sendLinkLogin
};
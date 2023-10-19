let Account = require("../models/account");
let mailController = require('./MailController')

function getAccountManagementPage(req, res) {
    res.render('accountManagement');
}

// Đăng ký
async function addAccount(req, res) {
    // Kiểm tra tính hợp lệ của dữ liệu
    if(req.body.email === "" || req.body.fullname === "") {
        req.flash("error", "Vui lòng không bỏ trống thông tin");
        return res.render("signup", {error: req.flash("error"), email: req.body.email, fullname: req.body.fullname});
    }
        
    if(!mailController.isEmail(req.body.email)) {
        req.flash("error", "Email không hợp lệ");
        return res.render("signup", {error: req.flash("error"), email: req.body.email, fullname: req.body.fullname});
    }

    if((await mailController.checkEmailExistence(req.body.email)) === false) {
        req.flash("error", "Địa chỉ email không tồn tại");
        return res.render("signup", {error: req.flash("error"), email: req.body.email, fullname: req.body.fullname});
    }

    let account = new Account({
        email: req.body.email, 
        password: (req.body.email).split("@")[0], // mật khẩu khi mới tạo sẽ là username (phần trước dấu @)
        fullname: req.body.fullname,
        profilePicture: "default-avatar.png",
        activateStatus: 0, // tài khoản mới tạo mặc định chưa được activate (tức là chưa click vào đường dẫn trong email)
        isNewUser: 1, // tài khoản mới tạo mặc định là user mới
        lockedStatus: 0 // tài khoản mới tạo mặc định chưa bị khóa
    });

    account.save()
    .then(newAccount => {
        // Gửi email
        let subject = "Xác thực tài khoản";
        let content = `<a href="${process.env.APP_URL}/login"> Vui lòng nhấn vào đây để hoàn tất thủ tục tài khoản</a>`;
        mailController.sendMail(req.body.email, subject, content);
                    
        req.flash("success", "Đăng ký tài khoản thành công. Vui lòng kiểm tra email của bạn.");
        res.render("signup", {success: req.flash("success")});
    })
    .catch(error => {
        req.flash("error", "Email này đã tồn tại");
        res.render("signup", {error: req.flash("error"), email: req.body.email, fullname: req.body.fullname});
    });
}

// Đăng nhập
function findAccount(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if(username === "" || password === "") {
        req.flash("error", "Vui lòng không bỏ trống thông tin")
        return res.render("login", {error: req.flash("error"), username: username, password: password})
    }

    Account.findOne({
        email: username + "@gmail.com",
        password: password
    })
    .then(account => {
        if(account) { // tìm thấy
            req.session.email = username + "@gmail.com";
            res.redirect("/profile")
        }
        else {
            req.flash("error", "Tài khoản hoặc mật khẩu không chính xác")
            res.render("login", {error: req.flash("error"), username: username, password: password})
        }
    })
    .catch(error => {
        req.flash("error", "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.")
        res.render("login", {error: req.flash("error"), username: username, password: password})
    });
} 

// Load trang profile dựa vào session
function getProfilePage(req, res) {
    Account.findOne({
        email: req.session.email,
    })
    .then(account => {
        res.render("profile", {email: account.email, fullname: account.fullname, profilePicture: account.profilePicture})
    })
}

// Cập nhật avatar
function changeProfilePicture(req, res) {

}

module.exports = {
    getAccountManagementPage,
    addAccount,
    getProfilePage,
    changeProfilePicture,
    findAccount
};
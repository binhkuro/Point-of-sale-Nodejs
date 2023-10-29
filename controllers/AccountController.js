let Account = require("../models/account");
let mailController = require('./MailController')
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
const path = require('path');

// Load user lên trang quản lí
function getAccountManagementPage(req, res) {
    Account.find()
    .lean() // convert Mongoose Object Array thành Javascript Object Array
    .then(accounts => {
        // Lọc ra các account mà không phải là admin
        let accountsNotAdmin = accounts.filter(a => a.email !== "admin@gmail.com");
        res.render('accountManagement', {accounts: accountsNotAdmin});
    })
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
        if(account && account.isNewUser === 0) { // tìm thấy
            req.session.email = username + "@gmail.com";
            res.redirect("/")
        }
        else if(account && account.isNewUser === 1){
            req.session.email = username + "@gmail.com";
            res.redirect("changepwd_logout")
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
        let options = {
            email: account.email, 
            fullname: account.fullname, 
            profilePicture: account.profilePicture, 
            success: req.flash("success"), 
            error: req.flash("error")
        };

        res.render("profile", options)
    })
}

// Cập nhật avatar
function changeProfilePicture(req, res) {
    let form = new multiparty.Form()

    form.parse(req, (error, data, files) => {
        if (error) {
            req.flash("error", "Thay đổi ảnh thất bại.")
            return res.redirect('profile')
        }
        
        let file = files.file[0];
        
        // Validate file
        if(file.size > 1048576) {
            req.flash("error", "Không chấp nhận ảnh có kích thước lớn hơn 1MB.")
            return res.redirect('profile')
        }

        // Đổi tên file là username + extension
        let newFileName = (req.session.email).split("@")[0] + path.extname(file.originalFilename);

        // Lưu file đã được upload vào server
        let tempPath = file.path;
        let savePath = path.join(__dirname, "../public/uploads/avatars/", newFileName);

        fsx.copy(tempPath, savePath, (err) => {
            if (err) {
                req.flash("error", "Thay đổi ảnh thất bại.")
                return res.redirect('profile')
            }
        });

        // Cập nhật lại giá trị của profilePicture trong database    
        Account.updateOne({email: req.session.email}, {$set: {profilePicture: newFileName}}, { new: true })
        .then(updatedAccount => {
            if (!updatedAccount) 
                req.flash("error", "Thay đổi ảnh thất bại.")
            else 
                req.flash("success", "Thay đổi ảnh thành công.")
                
            res.redirect('profile')
        })
        .catch(error => {
            req.flash("error", "Thay đổi ảnh thất bại.")
            res.redirect('profile')
        });
    })
}

// Đổi mật khẩu
function changePassword(req, res) {
    Account.findOne({
        email: req.session.email,
    })
    .then(async account => {
        let currentPassword = req.body.currentPassword;
        let newPassword = req.body.newPassword;
        let confirmPassword = req.body.confirmPassword;

        if(currentPassword === "" || newPassword === "" || confirmPassword === "")
            req.flash("error", "Vui lòng không bỏ trống thông tin")
        else if(currentPassword !== account.password)
            req.flash("error", "Mật khẩu hiện tại không chính xác");
        else if(newPassword !== confirmPassword)
            req.flash("error", "Nhập lại mật khẩu mới không chính xác");
        else {
            // Cập nhật lại mật khẩu mới trong database    
            await Account.updateOne({email: req.session.email}, {$set: {password: newPassword}}, { new: true })
            .then(updatedAccount => {
                if (!updatedAccount) 
                    req.flash("error", "Đổi mật khẩu thất bại.")
                else 
                    req.flash("success", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại."); 
            })
            .catch(error => {
                req.flash("error", "Đổi mật khẩu thất bại.")
            });
        }
            
        let options = {
            currentPassword: currentPassword, 
            newPassword: newPassword, 
            confirmPassword: confirmPassword, 
            error: req.flash("error"),
            success: req.flash("success")
        };
    
        res.json(options)
    })
}

// Khởi tạo 1 số dữ liệu mẫu để chạy chương trình
async function initData() {
    // Trước khi khởi tạo dữ liệu mẫu thì ta cần xóa các dữ liệu hiện có
    await Account.deleteMany()

    // Tài khoản admin
    let account = new Account({
        email: "admin@gmail.com", 
        password: "admin",
        fullname: "Administrator",
        profilePicture: "default-avatar.png",
        activateStatus: 1,
        isNewUser: 0,
        lockedStatus: 0
    });

    await account.save()

    // Tài khoản admin
    let account2 = new Account({
        email: "nghiem7755@gmail.com", 
        password: "asd",
        fullname: "asd",
        profilePicture: "default-avatar.png",
        activateStatus: 1,
        isNewUser: 0,
        lockedStatus: 0
    });

    await account2.save()

    let account3 = new Account({
        email: "anhtri000@gmail.com", 
        password: "asd1",
        fullname: "asd1",
        profilePicture: "default-avatar.png",
        activateStatus: 1,
        isNewUser: 1,
        lockedStatus: 0
    });

    await account3.save()
}

// Load profile user theo email tại trang quản lí
function getProfileByEmail(req, res) {
    Account.findOne({
        email: req.params.email,
    })
    .then(account => {
        let options = {
            email: account.email, 
            fullname: account.fullname, 
            profilePicture: account.profilePicture, 
            success: req.flash("success"), 
            error: req.flash("error")
        };

        res.render("profileid", options)
    })
}

function lockUser(req, res) {
    Account.findOne({
        email: req.body.email,
    })
    .then(async account => {
        let updatedField;

        if(account.lockedStatus === 0) {
            updatedField = {
                $set: {
                    lockedStatus: 1
                }
            }
        }
        else {
            updatedField = {
                $set: {
                    lockedStatus: 0
                }
            }
        }

        await Account.updateOne({email: req.body.email}, updatedField, { new: true })
        .then(updatedAccount => {
            res.end();
        })
    })
}

function resendEmail(req, res) {
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

    res.end();
}

// Đổi mật khẩu không cần pass cũ và cập nhật isNewUser
function changePwdNoPassOld(req, res) {
    Account.findOne({
        email: req.session.email,
    })
    .then(async account => {
        let currentPassword = account.password;
        let newPassword = req.body.newPassword;
        let confirmPassword = req.body.confirmPassword;

        if(newPassword === "" || confirmPassword === "")
            req.flash("error", "Vui lòng không bỏ trống thông tin")
        else if(newPassword !== confirmPassword)
            req.flash("error", "Nhập lại mật khẩu mới không chính xác");
        else {
            // Cập nhật lại mật khẩu mới trong database    
            await Account.updateOne({email: req.session.email}, {$set: {password: newPassword}}, { new: true })
            .then(updatedAccount => {
                if (!updatedAccount) 
                    req.flash("error", "Đổi mật khẩu thất bại.")
                else 
                    req.flash("success", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại."); 
            })
            .catch(error => {
                req.flash("error", "Đổi mật khẩu thất bại.")
            });

            // Cập nhật lại isNewUser trong database    
            // Account.findOne({
            //     email: req.body.email,
            // })
            // .then(async account => {
            //     let updatedField;
        
            //     if(account.isNewUser === 1) {
            //         updatedField = {
            //             $set: {
            //                 isNewUser: 0
            //             }
            //         }
            //     }
        
            //     await Account.updateOne({email: req.body.email}, updatedField, { new: true })
            //     .then(updatedAccount => {
            //         res.end();
            //     })
            // })
        }
            
        let options = {
            currentPassword: currentPassword, 
            newPassword: newPassword, 
            confirmPassword: confirmPassword, 
            error: req.flash("error"),
            success: req.flash("success")
        };
    
        res.json(options)
    })
}

module.exports = {
    getAccountManagementPage,
    addAccount,
    getProfilePage,
    getProfileByEmail,
    changeProfilePicture,
    findAccount,
    changePassword,
    initData,
    lockUser,
    resendEmail,
    changePwdNoPassOld
};
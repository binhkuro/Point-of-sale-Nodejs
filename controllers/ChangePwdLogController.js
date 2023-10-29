let Account = require("../models/account");

function getChangePwdLogPage(req, res) {    
    Account.findOne({
        email: req.session.email
    })
    .then(account => {
        if(account.isNewUser === 1)
            res.render('changepwd_logout');
        else
            res.redirect('/login');
    })
}

// Xuất hàm xử lý "getChangePasswordPage" để có thể sử dụng trong tệp khác
module.exports = {
    getChangePwdLogPage,
};
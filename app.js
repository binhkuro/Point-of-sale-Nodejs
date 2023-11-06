// Import các package
const express = require('express')
const mongoose = require("mongoose"); // giúp tương tác database
require("dotenv").config(); // giúp tương tác file .env
const cookieParser = require('cookie-parser'); // cookie
const hbs = require('express-handlebars') 
const session = require('express-session'); // session
const flash = require('connect-flash'); // flash message

// Import các module controller
const homeController = require('./controllers/HomeController');
const profileController = require('./controllers/ProfileController');
const changepasswordController = require('./controllers/ChangePasswordController')
const accountController = require('./controllers/AccountController')
const productController = require('./controllers/ProductController')
const loginController = require('./controllers/LoginController')
const signupController = require('./controllers/SignUpController')
const timeOutController = require('./controllers/TimeOutController')
const staffPaymentController = require('./controllers/StaffPaymentController')
const paymentHistoryController = require('./controllers/PaymentHistoryController')
const detailOrderController = require('./controllers/DetailOrderController')
const productPaymentController = require('./controllers/ProductPaymentController')
const invoiceController = require('./controllers/InvoiceController')
const changepwdlogController = require('./controllers/ChangePwdLogController')

// Lấy dữ liệu từ file .env ra
const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const COOKIE_SIGN = process.env.COOKIE_SIGN;

// Cấu hình các package đã import
let app = express()
app.use(express.static(__dirname + '/public')) // truy cập thư mục public để sử dụng img, css, js,...
app.use(express.json());  // lấy dữ liệu từ request dưới dạng JSON
app.use(express.urlencoded({ extended: true })); // lấy dữ liệu từ request dưới dạng url-encoded
app.use(cookieParser(COOKIE_SIGN)); // cookie
app.use(session({ // session
    secret: COOKIE_SIGN,
    resave: true,
    saveUninitialized: true,
}));
app.use(flash()) // flash message
app.engine('handlebars', hbs.engine({
    defaultLayout: 'main',
    helpers: {
        getLockedStatus: (email, lockedStatus) => {
            if(lockedStatus - 0 === 1)
                return `
                <button class="btn btn-danger" onclick="lockUser('${email}')">
                    <i class="fa-solid fa-lock"></i>          
                </button>
            `;

            return `
                    <button class="btn btn-success" onclick="lockUser('${email}')">
                        <i class="fa-solid fa-lock-open"></i>          
                    </button>
                `;
        },
        
        eq: (value1, value2, options) => {
            return value1 === value2;
        },

        formatPrice: (price) => {
            return price.toLocaleString('vi-VN'); 
        }
    }                   
}))
app.set('view engine', 'handlebars')

// Điều hướng navigation
app.get("/", (req, res) => {
    homeController.getHomePage(req, res);
})

app.get("/product-payment", (req, res) => {
    productPaymentController.getProductPaymentPage(req, res);
})

app.get("/staff-payment", (req, res) => {
    staffPaymentController.getStaffPaymentPage(req, res);
})

app.post("/product-payment", (req, res) => {
    staffPaymentController.addCustomer(req, res);
})

app.get("/payment-history", (req, res) => {
    paymentHistoryController.getPaymentHistoryPage(req, res);
})

app.get("/detail-order", (req, res) => {
    detailOrderController.getDetailOrderPage(req, res);
})

app.get("/profile", (req, res) => {
    if(!req.session.email)
        return res.redirect("/login");

    accountController.getProfilePage(req, res);
})

app.get("/profileid/:email", (req, res) => {
    if(!req.session.email || req.session.email !== "admin@gmail.com")
        return res.redirect("/login");

    accountController.getProfileByEmail(req, res);
})

app.get("/change-password", (req, res) => {
    if(!req.session.email)
        return res.redirect("/login");

    changepasswordController.getChangePasswordPage(req, res);
})

app.get("/changepwd_logout", (req, res) => {
    if(!req.session.email)
        return res.redirect("/login");

    changepwdlogController.getChangePwdLogPage(req, res);
})

app.get("/account-management", (req, res) => {
    // if(!req.session.email || req.session.email !== "admin@gmail.com")
    //     return res.redirect("/login");

    accountController.getAccountManagementPage(req, res);
})

app.get("/product-management", (req, res) => {
    // if(!req.session.email || req.session.email !== "admin@gmail.com")
    //     return res.redirect("/login");

    productController.getProductManagementPage(req, res);
})

app.post("/product-management", (req, res) => {
    productController.addProduct(req, res);
})

app.post("/edit-product", (req, res) => {
    productController.editProduct(req, res);
})

app.post("/delete-product", (req, res) => {
    productController.deleteProduct(req, res);
})

app.get("/login", (req, res) => {
    if(req.session.email)
        delete req.session.email;    
    
    res.render('login', {token: req.query.token});
})

app.get("/signup", (req, res) => {
    signupController.getSignUpPage(req, res);
})

app.get("/invoice", (req, res) => {
    invoiceController.getInvoicePage(req, res);
})

app.post("/signup", (req, res) => {
    accountController.addAccount(req, res);
})

app.get("/timeout", (req, res) => {
    timeOutController.getTimeOutPage(req, res);
})

app.post("/timeout", (req, res) => {
    timeOutController.resendEmail(req, res);
})

app.post("/profile", (req, res) => {
    accountController.changeProfilePicture(req, res);
})

app.post("/login", (req, res) => {
    accountController.findAccount(req, res);
})

app.put("/change-password", (req, res) => {
    accountController.changePassword(req, res);
})

app.put("/changepwd_logout", (req, res) => {
    accountController.changePwdNoPassOld(req, res);
})

app.put("/lock-user", (req, res) => {
    accountController.lockUser(req, res);
})

app.post("/resend-email", (req, res) => {
    accountController.resendEmail(req, res);
    res.end();
})

// Middle ware 404 error
app.use((req, res) => {
    res.status(404) 
    res.render('404')
})

// Middle ware 500 error
app.use((err, req, res, next) => {
    console.error(err.message) 
    res.status(500)
    res.render('500')
})

// Kết nối tới database ()
mongoose.connect(CONNECTION_STRING, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    accountController.initData();
    productController.initData();
    staffPaymentController.initData();

    console.log('Database connected');

    app.listen(PORT); // Tạo server trên cổng 8080
})
.catch((error) => {
    console.log('Error connecting to database');
});
// Import các package
let express = require('express')
let mongoose = require("mongoose"); // giúp tương tác database
require("dotenv").config(); // giúp tương tác file .env
let cookieParser = require('cookie-parser'); // cookie
let hbs = require('express-handlebars') 
let session = require('express-session'); // session
let flash = require('connect-flash'); // flash message

// Import các module controller
let homeController = require('./controllers/HomeController');
let profileController = require('./controllers/ProfileController');
let changepasswordController = require('./controllers/ChangePasswordController')
let accountController = require('./controllers/AccountController')
let productController = require('./controllers/ProductController')
let loginController = require('./controllers/LoginController')
let signupController = require('./controllers/SignUpController')
let staffPaymentController = require('./controllers/StaffPaymentController')
let paymentHistoryController = require('./controllers/PaymentHistoryController')
let detailOrderController = require('./controllers/DetailOrderController')
let productPaymentController = require('./controllers/ProductPaymentController')
let invoiceController = require('./controllers/InvoiceController')

// Import các module controller
// ...

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
let multiparty = require('multiparty') // upload file
let fsx = require('fs-extra'); // upload file
app.engine('handlebars', hbs.engine({
    defaultLayout: 'main', 
                           
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

app.get("/payment-history", (req, res) => {
    paymentHistoryController.getPaymentHistoryPage(req, res);
})

app.get("/detail-order", (req, res) => {
    detailOrderController.getDetailOrderPage(req, res);
})

app.get("/profile", (req, res) => {
    profileController.getProfilePage(req, res);
})

app.get("/change-password", (req, res) => {
    changepasswordController.getChangePasswordPage(req, res);
})

app.get("/account-management", (req, res) => {
    accountController.getAccountManagementPage(req, res);
})

app.get("/product-management", (req, res) => {
    productController.getProductManagementPage(req, res);
})

app.get("/login", (req, res) => {
    loginController.getLoginPage(req, res);
})

app.get("/signup", (req, res) => {
    signupController.getSignUpPage(req, res);
})

app.get("/invoice", (req, res) => {
    invoiceController.getInvoicePage(req, res);
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

app.listen(PORT); // Tạo server trên cổng 8080

// // Kết nối tới database ()
// mongoose.connect(CONNECTION_STRING, { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// })
// .then(() => {
//     console.log('Database connected');
//     app.listen(PORT); // Tạo server trên cổng 8080
// })
// .catch((error) => {
//     console.log('Error connecting to database');
// });
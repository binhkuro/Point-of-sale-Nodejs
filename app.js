// Import các package
let express = require('express')
let mongoose = require("mongoose"); // giúp tương tác database
require("dotenv").config(); // giúp tương tác file .env
let cookieParser = require('cookie-parser'); // cookie
let hbs = require('express-handlebars') 
let session = require('express-session'); // session
let flash = require('connect-flash'); // flash message

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
    res.render("index")
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
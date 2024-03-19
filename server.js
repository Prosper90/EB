require("dotenv").config();
const path = require("path");
const express = require("express");
const registerlogin = require("./routes/clients/registerlogin");
const register = require("./routes/clients/register");
const login = require("./routes/clients/login");
const shop = require("./routes/clients/shop");
const moreTable = require("./routes/clients/moreTables");
const orders = require("./routes/clients/orders");
const dashboard = require("./routes/clients/dashboard");
const buypage = require("./routes/clients/buypage");
const orderdetail = require("./routes/clients/orderdetail");
const ticket = require("./routes/clients/ticket");
const recievepayment = require("./routes/clients/recievepayment");
const deposit = require("./routes/clients/deposit");
const deposithistory = require("./routes/clients/deposithistory");
const buymain = require("./routes/clients/buymain");
const webhook = require("./routes/clients/webhook");
const home = require("./routes/clients/home");
const addToCart = require("./routes/clients/addToCart");
const myaccount = require("./routes/clients/myaccount");
const checkout = require("./routes/clients/checkout");
const blog = require("./routes/clients/blog");

const adminlogin = require("./routes/admin/adminlogin");
const admin = require("./routes/admin/dashboard");
const addproducts = require("./routes/admin/addproducts.js");
const products = require("./routes/admin/products.js");
const mainproducts = require("./routes/admin/mainproducts");
const allorders = require("./routes/admin/allorders.js");
const mainorder = require("./routes/admin/mainorder.js");
//const manageInvestments = require("./routes/admin/manageInvestments.js");
const bodyParser = require("body-parser");
const User = require("./model-database/users").User;
// const ProductTwo = require("./model-database/productTwo").ProductTwo;
const Admin = require("./model-database/admin").Admin;
const mongoose = require("mongoose");
const passport = require("passport");
//const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOveride = require("method-override");

const initializePassport = require("./passport-config");
const { ErrorHandler } = require("./middlewares/error.js");

initializePassport(passport);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.enable("trust proxy");

/*
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.session = req.session;
  next();
});
*/

app.use(cookieParser("secret"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

//app.use(flash());
app.use(require("connect-flash")());
//flash message middle ware
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  res.locals.session = req.session;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/addToCart", addToCart);
app.use("/registerlogin", registerlogin);
app.use("/register", register);
app.use("/login", login);
app.use("/shop", shop);
app.use("/moreTable", moreTable);
app.use("/orders", orders);
app.use("/buypage", buypage);
app.use("/dashboard", dashboard);
app.use("/orderdetail", orderdetail);
app.use("/ticket", ticket);
app.use("/deposit", deposit);
app.use("/deposithistory", deposithistory);
app.use("/buymain", buymain);
// app.use("/home", home);
app.use("/myaccount", myaccount);
app.use("/checkout", checkout);
app.use("/blog", blog);


//admin section
app.use("/adminlogin", adminlogin);
app.use("/admin", admin);
app.use("/addproducts", addproducts);
//app.use("/investmentstrack", investmentstrack);
app.use("/products", products);
app.use("/mainproducts", mainproducts);
app.use("/allorders", allorders);
app.use("/mainorder", mainorder);
app.use("/recievepayment", recievepayment);
app.use("/webhook", webhook);

//main one
app.get("/", function (req, res) {
  // console.log(req.user, "checking request.user");
  res.render("home", { active: "home", user: req.user});
});



// Error handler middleware
app.use(ErrorHandler);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB!"))
  .catch((error) => console.log(error));

app.listen(process.env.PORT || 5000, function () {
  console.log("App is listening on url http://localhost:5000");
});

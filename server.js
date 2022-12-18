const path = require("path");
require("dotenv").config();
const express = require("express");
const registerlogin = require("./routes/clients/registerlogin");
const shop = require("./routes/clients/shop");
const orders = require("./routes/clients/orders");
const dashboard = require("./routes/clients/dashboard");
const buypage = require("./routes/clients/buypage");
const orderdetail = require("./routes/clients/orderdetail");
const recievepayment = require("./routes/clients/recievepayment");
const deposit = require('./routes/clients/deposit');


const adminlogin = require("./routes/admin/adminlogin");
const admin = require("./routes/admin/dashboard");
const addproducts = require("./routes/admin/addproducts.js");
const products = require("./routes/admin/products.js");
const allorders = require("./routes/admin/allorders.js");
//const manageInvestments = require("./routes/admin/manageInvestments.js");
const bodyParser = require('body-parser');
const User = require("./model-database/users").User;
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOveride = require("method-override");




const initializePassport = require("./passport-config");


initializePassport(passport);


const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, '/public')));
app.enable("trust proxy");


app.use(flash());

app.use(cookieParser("secret"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
   saveUninitialized: false,
}));


//flash message middle ware
app.use(function(req, res, next){
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});


app.use(passport.initialize());
app.use(passport.session());



app.use("/registerlogin", registerlogin);
app.use("/shop", shop);
app.use("/orders", orders);
app.use("/buypage", buypage);
app.use("/dashboard", dashboard);
app.use("/orderdetail", orderdetail);
app.use("/deposit", deposit);


//admin section
app.use("/adminlogin", adminlogin);
app.use("/admin", admin);
app.use("/addproducts", addproducts);
//app.use("/investmentstrack", investmentstrack);
app.use("/products", products);
app.use("/allorders", allorders);
app.use("/recievepayment", recievepayment);






app.get("/",  function(req, res){
  res.render("home", {message: req.flash()});
});


app.listen(process.env.PORT || 3000,  function(){
  console.log("App is listening on url http://localhost:3000")
});

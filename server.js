require("dotenv").config();
const path = require("path");
const express = require("express");
const registerlogin = require("./routes/clients/registerlogin");
const shop = require("./routes/clients/shop");
const orders = require("./routes/clients/orders");
const dashboard = require("./routes/clients/dashboard");
const buypage = require("./routes/clients/buypage");
const orderdetail = require("./routes/clients/orderdetail");
const recievepayment = require("./routes/clients/recievepayment");
const deposit = require("./routes/clients/deposit");
const deposithistory = require("./routes/clients/deposithistory");
const buymain = require("./routes/clients/buymain");
const webhook = require("./routes/clients/webhook");
const home = require("./routes/clients/home");
const addToCart = require("./routes/clients/addToCart");
const myaccount = require("./routes/clients/myaccount");
const checkout = require("./routes/clients/checkout");

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
const ProductTwo = require("./model-database/productTwo").ProductTwo;
const Admin = require("./model-database/admin").Admin;
const mongoose = require("mongoose");
const passport = require("passport");
//const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOveride = require("method-override");
const MongoStore = require("connect-mongo");
const Cart = require("./model-database/cart");

const initializePassport = require("./passport-config");

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
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
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
app.use("/shop", shop);
app.use("/orders", orders);
app.use("/buypage", buypage);
app.use("/dashboard", dashboard);
app.use("/orderdetail", orderdetail);
app.use("/deposit", deposit);
app.use("/deposithistory", deposithistory);
app.use("/buymain", buymain);
// app.use("/home", home);
app.use("/myaccount", myaccount);
app.use("/checkout", checkout);

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
app.get("/",  function(req, res){

  res.render("home", {active:"home"});
});



// app.get("/", async function (req, res) {
//   const sideProducts = await ProductTwo.find({}).clone();
//   //const user = checkAuthenticated();fd gte
//   //console.log(user, "Authenticating");
//   var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
//   var seletproduct = !req.session.cart ? null : cart.generateArray();
//   console.log(req.session.cart, "checking if there is a cart");
//   console.log(
//     res.locals.messages,
//     req.session.locals,
//     "checking other details one"
//   );
//   res.render("homemain", {
//     sideProducts: sideProducts,
//     user: req.user,
//     cartProducts: seletproduct,
//     active: "home",
//   });
// });

// app.post("/", async function (req, res) {
//   await Admin.findById({ _id: "6331ef970fcb743e2f09df99" }, (err, data) => {
//     if (err) console.log(err);

//     data.Subscribers.push({
//       email: req.body.email,
//     });

//     data.markModified("Subscribers");
//     data.save(function (saveerr, saveresult) {
//       if (saveerr) {
//         req.flash("error", "Failed");
//         res.redirect(`/`);
//       } else {
//         req.flash("success", "Suscribed Successfully");
//         res.redirect(`/`);
//       }
//     });
//   });
// });

/*
app.get("/home",  checkAuthenticated, async function(req, res) {
  console.log(req.session.messages, req.session.locals, "checking other details");
  res.send("hello there")
});
*/

// async function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     //console.log("running")
//     return next();
//   }
//   console.log("Something else");
//   const sideProducts = await ProductTwo.find({}).clone();
//   //const user = checkAuthenticated();
//   //console.log(user, "Authenticating");
//   console.log(
//     req.session.messages,
//     req.session.locals,
//     "checking other details"
//   );
//   res.render("homemain", { sideProducts: sideProducts, user: false });
// }

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB!"))
  .catch((error) => console.log(error));

app.listen(process.env.PORT || 8000, function () {
  console.log("App is listening on url http://localhost:8000");
});

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
const Admin = require("../../model-database/users").Admin;
const router = express.Router();

router.get("/", checkAuthenticated, async function (req, res) {
  //console.log(req.user);
  let users = await User.find().clone();
  let products = await Products.find().clone();
  let totalusers = await User.find().count().clone();
  // req.flash("success", "Added products successfully");

  res.render("admin/addproducts", {
    users: users,
    totalusers: totalusers,
    user: req.user,
    products: products,
    active: "addproducts",
  });
});

//submit one
router.post("/", async function (req, res, next) {
  console.log(req.body);
  //console.log(req.body.details1);

  //checking if fields are empty
  if (req.body.type == "" || req.body.price == "") {
    // req.session.message = {
    //   type: "danger",
    //   intro: "Empty fields",
    //   message: "Please insert the requested information",
    // };
    req.flash("primary", "Please add the type and price");
    res.redirect("/addproducts");
  } else {
    //putting data to the database

    try {
      // dateandtime: { type: Date, default: Date.now },
      // name: { type: String, required: true },
      // type: { type: String, required: true },
      // title: { type: String, required: true },
      // password: { type: String, required: true },
      // available: { type: Boolean, required: true },
      // price: { type: Number, required: true },
      // numOfItem: { type: Number },
      // details: { type: String },
      // format: { type: String },
      // description: { type: String },

      const dataUpload = [];

      for (let index = 1; index <= req.body.totals; index++) {
        dataUpload.push({
          type: req.body.type,
          title: req.body[`title${index}`],
          names: req.body[`names${index}`],
          password: req.body[`passwords${index}`],
          available: true,
          price: req.body[`price${index}`],
          numOfItem: req.body[`itemsno${index}`],
          details: req.body[`details${index}`],
          // format: req.body[`format${index}`],
          description: req.body[`description${index}`],
        });
      }

      console.log(dataUpload);

      await Products.insertMany(dataUpload);

      req.flash("success", "Added products successfully");
      res.redirect("/addproducts");

      console.log("inside body of form");
    } catch (err) {
      next(err);
      res.redirect("/addproducts");
    }
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.email === "EBtheadmin@gmail.com") {
    return next();
  } else {
    res.redirect("/adminlogin");
  }
}

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

module.exports = router;

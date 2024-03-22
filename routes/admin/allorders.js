const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
const Admin = require("../../model-database/users").Admin;
const router = express.Router()




router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  let users = await User.find().clone();
  let products = await Products.find().clone();
  let totalusers = await User.find().count().clone();
 res.render("admin/allorders", { users: users, totalusers: totalusers, user: req.user, products: products, active: "allorders", });
});







function checkAuthenticated(req, res, next){
  if(req.isAuthenticated() && req.user.email === "EBtheadmin@gmail.com"){
    return next()
  } else{

  res.redirect("/adminlogin")

  }

}



router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/');
});








module.exports = router;

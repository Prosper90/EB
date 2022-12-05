const express = require("express");
const path = require("path");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/:id", checkAuthenticated, async function(req, res){
    const getItem = await Products.findById({_id: req.params.id}, function(err, user) {
        if(err) {
          console.log(err);
        } else {
          return user;
        }

    })
  res.render("clients/orderdetail", {item: getItem} );
});








function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
  
    res.redirect("/")
  }
  






module.exports = router;
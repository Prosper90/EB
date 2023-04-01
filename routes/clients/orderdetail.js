const express = require("express");
const path = require("path");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/:id/:index", checkAuthenticated, async function(req, res){
    const getItem = await Products.find({type: req.params.id}, function(err, products) {
        if(err) {
          console.log(err);
        } else {
          return products;
        }

    }).clone();
    console.log(getItem);

    const itemsbought = getItem.filter(({_id}) => user.Orders[index].buyid.includes(_id));

  res.render("clients/orderdetail", {item: itemsbought, message: req.flash(), transferAccount: undefined} );
});








function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
  
    res.redirect("/")
  }
  






module.exports = router;
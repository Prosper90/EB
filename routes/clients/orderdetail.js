const express = require("express");
const path = require("path");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/:id", checkAuthenticated, async function(req, res){
    const Item = await await Products.findById(req.params.id);
    console.log(Item, req.params.id, "tired");
    // console.log(req.user.Orders[req.params.index].buyid, "id index");

    // const itemsbought = getItem.filter(({_id}) => req.user.Orders[req.params.index].buyid.includes(_id));
    // console.log(itemsbought, "items bought");    

  res.render("clients/orderdetail", {user: req.user, item: Item, transferAccount: undefined} );
});








function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
  
    res.redirect("/")
  }
  






module.exports = router;
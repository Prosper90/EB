const express = require("express");
const path = require("path");
//const User = require("../model-database/users");
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/", checkAuthenticated, function(req, res){
  res.render("clients/orders", {user: req.user, message: req.flash(), transferAccount: undefined});
});







function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
  
    res.redirect("/")
  }
  






module.exports = router;
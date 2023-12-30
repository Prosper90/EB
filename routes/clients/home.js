const express = require("express");
const path = require("path");
//const User = require("../model-database/users");
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/",  function(req, res){

  res.render("home", {active:"home"});
});







function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }

    req.flash('info', 'Log in to proceed');
    res.redirect("/")
  }
  






module.exports = router;
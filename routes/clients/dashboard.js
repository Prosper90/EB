const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const router = express.Router()




router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  res.render("clients/dashboard", { user: req.user});
});









function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect("/")
}



router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/');
});








module.exports = router;

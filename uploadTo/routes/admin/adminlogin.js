const express = require("express");
const path = require("path");
const User = require("../../model-database/users").User;
const Admin = require("../../model-database/users").Admin;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();



router.get("/", function(req, res){
  res.render("admin/login", {message: req.flash() });
});



router.post("/:admin", passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/adminlogin"
  }), (req, res, next) => {
    res.redirect('/admin');
  });

















module.exports = router;
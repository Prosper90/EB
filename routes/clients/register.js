const express = require("express");
const path = require("path");
const User = require("../../model-database/users").User;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");


router.get("/", function(req, res){
  res.render("clients/register", {user: req.user});
});


router.post("/", async function (req, res) {
  // console.log("called");
  //check if email has been used
  let checkEmail = await User.findOne({ Email: req.body.email });

  //checking if fields are empty
  if (req.body.email == "" || req.body.password == "") {
    req.flash("primary", "Please insert the requested information");
    // req.flash("register", "Registration failed");

    res.redirect("home");
  }
  //check if email exists
  else if (checkEmail) {
    //console.log("Email check");
    req.flash("primary", "This email has already been registered");
    // req.flash("primary", "Registration failed");

    res.redirect("/");
  }

  //checks if the confirm password matches the first password
  /*
    else if(req.body.password != req.body.passwordtwo){
      //console.log("password check");
      req.session.message = {
        type: "danger",
        intro: "Password error",
        message: "Passwords do not match"
      }

      res.redirect("register");
    }
    */

  //checks if the confirm password matches the first password
  else {
    //putting data to the database

    //hash password and save to the database
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let user = new User({
        username: req.body.username,
        Email: req.body.email,
        password: hashedPassword,
        balance: 0,
        CryptoAddress: {
          BTC: "",
          BNB: "",
          Doge: "",
        },
      });

      user.save();
      req.flash("success", "Registration successful, Login");
      res.redirect(`/login`);
    } catch {
      res.redirect("/");
    }
  }
});





module.exports = router;

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const router = express.Router();

router.get("/", checkAuthenticated, async function (req, res) {
  //console.log(req.user);
 const totalOrders = req.user?.Orders.length;
 const totalDeposit = req.user?.Deposit.length;

  res.render("clients/dashboard", {
    user: req.user,
    totalOrders: totalOrders,
    totalDeposit: totalDeposit,
    transferAccount: undefined,
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  //console.log("Not authenticated");
  /*
  req.session.message = {
    type: "danger",
    intro: "Error",
    message: "Log in to proceed"
  }
  */
  req.flash("warning", "Log in to proceed");
  res.redirect("/");
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

const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

//checkAuthenticated,
router.get("/", async function (req, res) {
    // req.flash("info", "Coming Soon");
    // res.redirect("/");
  console.log("ousiding");
  res.render("blog", {user: req.user});
});




module.exports = router;

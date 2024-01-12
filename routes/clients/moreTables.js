const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

//checkAuthenticated,
router.get("/:type", async function (req, res) {
  const getItems = await Products.find({ type: req.params.type }).clone();
  res.render("moretable", { products: getItems, active: "shop", user: req.user});
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("info", "Log in to proceed");
  res.redirect("/shop");
}

module.exports = router;

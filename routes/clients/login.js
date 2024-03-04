const express = require("express");
const path = require("path");
const passport = require("passport");
const router = express.Router();



router.get("/", function(req, res){
  res.render("clients/login", {user: req.user});
});



router.post(
    "/",
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/",
    }),
    (req, res, next) => {
      if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
      } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
      }
      res.redirect("/");
    }
  );








module.exports = router;
const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();

/*
router.get("/", async function(req, res){
  const products = await Products.find().clone();
  res.render("shop", {products: products});
});
*/

router.get("/", checkAuthenticated, async function (req, res) {
  // let page = req.query.page;
  // let size = 12;
  // if (!page) {
  //   page = 1;
  // }
  // const limit = size;
  // const skip = (page - 1) * size;

  // const products = await Products.find()
  //   .sort({ _id: -1 })
  //   .limit(limit)
  //   .skip(skip);

  // const totalCount = await Products.count();

  const faceBook = await Products.find({ type: "facebook" });
  const faceBookDating = await Products.find({ type: "facebookDating" });
  const faceBookOthers = await Products.find({ type: "facebookOthers" });
  const twitter = await Products.find({ type: "twitter" });
  const reddit = await Products.find({ type: "reddit" });
  const mails = await Products.find({ type: "google" });
  const messaging = await Products.find({ type: "messaging" });
  const instagram = await Products.find({ type: "instagram" });
  const tiktok = await Products.find({ type: "tiktok" });
  const linkedin = await Products.find({ type: "linkedin" });
  const vpn = await Products.find({ type: "vpn" });

  console.log(faceBook, "checking somthing");

  res.render("shop", {
    // products: products,
    // currentPage: page,
    // pageCount: Math.ceil(totalCount / size),
    faceBook: faceBook,
    faceBookDating: faceBookDating,
    faceBookOthers: faceBookOthers,
    twitter: twitter,
    reddit: reddit,
    mails: mails,
    messaging: messaging,
    instagram: instagram,
    tiktok: tiktok,
    linkedin: linkedin,
    vpn: vpn,
    active: "shop",
    user: req.user
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

module.exports = router;

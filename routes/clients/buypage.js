const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const console = require("console");
const router = express.Router();

//checkAuthenticated,
router.get("/:id", async function (req, res) {
  console.log("check check check main");
  const getItem = await Products.findOne({ _id: req.params.id }).clone();
  console.log(getItem, "agian check");
  res.render("clients/buypage", { message: req.flash(), item: getItem });
});

//mainOnes
//buying items
router.post("/:id", checkAuthenticated, async function (req, res) {
  //check for available market
  const checking = await Products.find({ type: req.params.id }).clone();

  const check = checking.filter((data) => {
    return data.available == true;
  });

  console.log(check.length, "check check check");
  if (check.length < req.body.purchaseNumber) {
    console.log("In here and running");
    req.flash(
      "info",
      "Not enough stock to order. Kindly order in lesser quantity"
    );
    res.redirect(`/buypage/${req.params.id}`);
  } else {
    //find the item
    const findProduct = await Products.find(
      { type: req.params.id },
      function (err, product) {
        if (err) {
          //handle
        } else {
          return product;
        }
      }
    ).clone();
    //console.log(findProduct, "Testing");

    const totalPrice = findProduct[0].price * req.body.purchaseNumber;
    console.log(totalPrice);
    let buyi = [];
    let index;
    //Remove the product from product list
    await Products.find({ type: req.params.id }, async function (err, product) {
      if (err) {
        //handle
      } else {
        //console.log(product, "working");
        product.map(async (data, index) => {
          if (index < req.body.purchaseNumber) {
            buyi.push(String(data._id));
            await Products.updateOne(
              { _id: String(data._id) },
              { $set: { available: false } }
            ).clone();
          }
        });
      }
    }).clone();
    console.log(buyi, "One");

    //create an order amd update balance
    await User.findById({ _id: req.user._id }, function (err, user) {
      if (err) {
        //handle it
      } else {
        console.log(buyi, "buyids two");
        user.balance -= totalPrice;
        user.Orders.push({
          price: totalPrice,
          paymentmethod: "card",
          status: 1,
          type: findProduct[0].type,
        });
        if (user.Orders.length !== 0) {
          index = user.Orders.length - 1;
        } else {
          index = user.Orders.length;
        }

        buyi.map((data) => {
          user.Orders[index].buyid.push(data);
        });

        user.markModified("Orders");
        user.save(function (saveerr, saveresult) {
          if (saveerr) {
            req.flash("error", "Purchase fail");
            res.redirect(`/buypage/${req.params.id}`);
          } else {
            req.flash("success", "Purchase successful");
            res.redirect(`/orderdetail/${findProduct[0].type}/${index}`);
          }
        });
      }
    }).clone();
  }

  //end of main if
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("info", "Log in to proceed");
  res.redirect("/shop");
}

module.exports = router;

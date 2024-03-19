const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

//checkAuthenticated,
router.get("/:id", checkAuthenticated, async function (req, res) {
  // console.log("check check check main");
  const getItem = await Products.findOne({ _id: req.params.id }).clone();
  // console.log(getItem, "agian check");
  res.render("buypage", { item: getItem, active: "shop", user: req.user});
});

//mainOnes
//buying items
router.post("/:id", checkAuthenticated, async function (req, res, next) {
  try {
    console.log("hi hi there", req.params.id);
    //check for available market
  const buyingProduct = await Products.findOne({ _id: req.params.id });
  console.log(buyingProduct, "buying product");
  // const user = await User.findById({ _id: req.user._id });
  console.log(buyingProduct.price, req.body.purchaseNumber, "purchase number and others");
  const totalPrice = req.body.purchaseNumber === 0 ? buyingProduct.price : buyingProduct.price * req.body.purchaseNumber;
  console.log(totalPrice,"is the price of this item");
  if(!buyingProduct) {
    req.flash("danger", "No such product");
    return res.redirect(`/buypage/${req.params.id}`);
  }

  if(!buyingProduct.available) {
    req.flash("danger", "Product is unavailable");
   return res.redirect(`/buypage/${req.params.id}`);
  }

  if(req.body.purchaseNumber > buyingProduct.numOfitem) {
    req.flash( "danger", "Not enough stock to order. Kindly order in lesser quantity");
    return res.redirect(`/buypage/${req.params.id}`);
  }

  if(req.user.balance < parseFloat(totalPrice)) {
    req.flash("danger", "Insufficient funds");
    return res.redirect(`/buypage/${req.params.id}`);
  }

    //Remove the product from product list
    const updateAfterSell = await Products.findOneAndUpdate(
      { _id: req.params.id },
      { 
        $set: {  
          available : buyingProduct.numOfItem < 1 ? false : true
        },
        $inc: {numOfItem: -parseFloat(req.body.purchaseNumber)}
       }
      );
      if (!updateAfterSell) {
        //handle
        req.flash( "danger", "Something went wrong");
        return res.redirect(`/buypage/${req.params.id}`);
      } 

     const order_created = {
      price: totalPrice,
      paymentmethod: "card",
      status: 1,
      buyid: buyingProduct._id,
      type: buyingProduct.type,
     }
      
      await User.findOneAndUpdate(
      {_id: req.user._id},
      {
        $set: {balance: req.user.balance - parseFloat(totalPrice)},
        $push: {Orders: order_created}
       }
       )


       req.flash("success", "Purchase successful");
       return res.redirect(`/orderdetail/${buyingProduct._id}`);

  
  } catch (error) {
    next(error);
  }
  
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("info", "Log in to proceed");
  res.redirect("/shop");
}

module.exports = router;

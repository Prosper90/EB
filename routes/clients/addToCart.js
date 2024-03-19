const express = require("express");
const path = require("path");
// const ProductTwo = require("../../model-database/productTwo").ProductTwo;
const User = require("../../model-database/users").User;
const bcrypt = require("bcrypt");
const router = express.Router();
const axios = require("axios");
const { resourceLimits } = require("worker_threads");
const Cart = require("../../model-database/cart");



router.get("/:id", checkAuthenticated, async function(req, res, next) {

   var cart = new Cart(req.session.cart ? req.session.cart : {});

   await ProductTwo.findById({_id: req.params.id}, function(err, product) {
    if(err) {
      console.log(err);
    } else {
      cart.add(product, product.id);
      req.session.cart = cart;
      res.redirect("/");
    }
  }).clone();

  res.render("buypagehf/mainProducts", { message: req.flash(), item: getItem, user: req.user });
});







//mainOnes

router.post("/:id", checkAuthenticated, async function(req, res){
  

  console.log(req.body.purchaseNumber, "Total number");

  await ProductTwo.findById({_id: req.params.id}, async function(err, product) {
    if(err) {
     //handle
    } else {
      if(req.body.purchaseNumber > product.numOfItem) {
        console.log("In here and running");
        req.flash('message', 'Out of stock');
        res.redirect(`/buymain/${req.params.id}`);
        return;
      } else {

          const totalPrice = product.price * req.body.purchaseNumber;
          const valueB =  totalPrice / 0.01;
    
          const ids = `${req.params.id}-${req.user._id}-${valueB}-${req.body.purchaseNumber}-${req.body.size}-${Math.floor(( Math.random()  * 1000000000 ) )}`;
          console.log(ids);

          //call paystack

          //http://localhost:3000/recievepayment
          //https://www.socialogs.org/recievepayment
          const response = await axios({
            method: "POST",
            url: "https://api.paystack.co/transaction/initialize",
            headers: {
              Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            },
            data: {
              "email": req.user.Email,
              "amount": valueB,
              "callback_url": "https://socialogs.org/recievepayment",
              "reference": ids
            },
          })
          

        res.redirect(response.data.data.authorization_url);        
      }


    }
   }).clone();
  
            

  //end of main if
});







function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  req.flash('message', 'Log in to proceed');
  res.redirect("/")
}



module.exports = router;
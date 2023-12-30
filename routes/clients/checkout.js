const express = require("express");
const path = require("path");
const ProductTwo = require("../../model-database/productTwo").ProductTwo;
const User = require("../../model-database/users").User;
const bcrypt = require("bcrypt");
const router = express.Router();
const axios = require("axios");
const { resourceLimits } = require("worker_threads");
const Cart = require("../../model-database/cart");



router.get("/", checkAuthenticated, async function(req, res, next) {

   var cart = new Cart(req.session.cart ? req.session.cart : {});
   /*
   await ProductTwo.findById({_id: req.params.id}, function(err, product) {
    if(err) {
      console.log(err);
    } else {
      cart.add(product, product.id);
      req.session.cart = cart;
      res.redirect("/");
    }
  }).clone();
  */
  var seletproduct = !req.session.cart ? null : cart.generateArray();

  res.render("checkout", { message: req.flash(), cartProducts: seletproduct, user: req.user });
});







//mainOnes

router.post("/", checkAuthenticated, async function(req, res){
  

  console.log(req.body, "Total body");
  console.log(JSON.parse(req.body.ProductBought), "parsed data");
  console.log(req.body.ProductBought, "without parse");

      
      const valueB =  req.body.totalPrice / 0.01;

      const ids = `${req.user._id}-${valueB}-${req.body.purchaseNumber}-${"cart"}-${Math.floor(( Math.random()  * 1000000000 ) )}`;

      const basePath = `${req.protocol}://${req.get('host')}`;
      //call paystack
      //http://localhost:3000/recievepayment
      //https://www.socialogs.org/recievepayment
     try {
          const response = await axios({
            method: "POST",
            url: "https://api.paystack.co/transaction/initialize",
            headers: {
              Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            },
            data: {
              "email": req.user.Email,
              "amount": valueB,
              "callback_url": `${basePath}/recievepayment`,
              "reference": ids
            },
          })
          
        res.redirect(response.data.data.authorization_url);  
     } catch (error) {
      req.flash('message', 'Network err');
      res.redirect(`/checkout`);
     }
      
    

  //end of main if
});







function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  req.flash('info', 'Log in to proceed');
  res.redirect("/")
}



module.exports = router;
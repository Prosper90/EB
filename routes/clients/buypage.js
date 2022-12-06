const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();
const got = require("got");



router.get("/:id", checkAuthenticated, async function(req, res){

  const getItem = await Products.findById({_id: req.params.id}, function(err, product) {
    if(err) {
      console.log(err);
    } else {
      return product;
    }

})

  res.render("clients/buypage", {message: req.flash(), item: getItem });
});


/*
router.get("/", async function(req, res){
  res.render("clients/buypage", { message: req.flash() });
});
*/






router.post("/", checkAuthenticated, async function(req, res){
  //call paystack

  try {
    const response = await got.post("https://api.flutterwave.com/v3/payments", {
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
        },
        json: {
            tx_ref: req.user._id,
            amount: req.user.price,
            currency: "NGN",
            redirect_url: "http://localhost:3000/buypage/callback",
            customer: {
                email: req.user.Email,
            },

        }
    }).json();
} catch (err) {
    console.log(err.code);
    console.log(err.response.body);
}
            

  //end of main if
});






router.get('/payment-callback', async (req, res) => {
  if (req.query.status === 'successful') {
      const transactionDetails = await Transaction.find({ref: req.query.tx_ref});
      const response = await flw.Transaction.verify({id: req.query.transaction_id});
      if (
          response.data.status === "successful"
          && response.data.amount === transactionDetails.amount
          && response.data.currency === "NGN") {
          // Success! Confirm the customer's payment

                      //updating Products
                      await Products.findById({_id: req.query.tx_ref}, function(err, product){
  
                        if(err){
                          console.log(err);
                        } else {
                
                          //update product
                          product.available = false;
                          
                
                        }
              
                
                        product.save(function(saveerr, saveresult){
                          if(saveerr){
                
                            req.session.message = {
                              type: "danger",
                              intro: "invest error",
                              message: "Something went wrong"
                            }
                
                            res.redirect("/shop");
                
                          } else {
                
                            req.session.message = {
                              type: "success",
                              intro: "Success",
                              message: "Successfully bought"
                            }
                
                            res.redirect("/shop");
                
                          }
                        });
                
                      }).clone();

      } else {
          // Inform the customer their payment was unsuccessful
      }
  }
});





function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  req.flash('message', 'Log in to proceed');

  res.redirect("/shop")
}



module.exports = router;
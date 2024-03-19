const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const router = express.Router();
const got = require("got");
const axios = require("axios");
const Flutterwave = require('flutterwave-node-v3');



router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  // console.log(req.params);

  // const banks = await axios.get( `https://api.flutterwave.com/v3/banks/NG`,
  //   {
  //     headers: {
  //       'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`
  //     }

  //   }
  // );
  const transferAccount = req.session.transferAccount;
  //console.log(banks.data);
  res.render("clients/deposit", { user: req.user, transferAccount: transferAccount, message: req.flash()});
});








router.post("/", checkAuthenticated, async function(req, res){

   if(req.body.amount < 1000) {
    req.flash("primary", "Amount too small");
     return res.redirect("/deposit");
   }


 try{
 
      const valueB =  req.body.amount * 100 ;
      const ids = `${req.user._id}-${valueB}-${Math.floor(( Math.random()  * 1000000000 ) )}`;
      console.log(ids);
      const basePath = `${req.protocol}://${req.get('host')}`;
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
          "callback_url": `${basePath}/recievepayment`,
          "reference": ids
        },
      })


    res.redirect(response.data.data.authorization_url);

  } catch (error) {
    console.log(error);
    req.flash('primary', 'Network err');
    res.redirect(`/dashboard`);
   }
});
  
  
  
  
  
  
  router.get('/payment-callback', async (req, res) => {
  
      console.log("this guy has started");
      const ids = req.query.tx_ref;
      const valueId = ids.split(',');
      console.log(valueId);
  
  /*
        if (req.query.status === "successful") {
            // Success! Confirm the customer's payment
  
                        //updating Products
                        await Products.findById({_id: valueId[0]}, function(err, product){
    
                          if(err){
                            console.log(err);
                          } else {
                  
                          //update product
                          product.available = false;
                            
                
                  
                          product.save(function(saveerr, saveresult){
                            if(saveerr){
                              //throw error
                            } else {
                             //works
                            }
                          });
  
                        }
                  
                        }).clone();
  
  
  
  
                          //complete an order
                          await User.findById({_id: valueId[1]}, function(err, user) {
                            if(err) {
                              //handle it
                            } else {
  
                              user.Orders.map((data) => {
                                if(data.buyid === valueId[0]) {
                                  data.status = 1;
                                }
                              })
  
  
                            user.markModified("Orders");
                            user.save(function(saveerr, saveresult){
                              if(saveerr){
  
                                req.session.message = {
                                  type: "danger",
                                  intro: "error",
                                  message: "Payment unsuccessful"
                                }
                    
                                res.redirect("/buypage");
  
                              } else {
  
                                req.session.message = {
                                  type: "success",
                                  intro: "complete",
                                  message: "Payment successful"
                                }
                    
                                res.redirect("/shop");
  
                              }
  
                              
                            });
  
                          }
  
                          }).clone();
  
  
        } else {
            // Inform the customer their payment was unsuccessful
                req.session.message = {
                  type: "danger",
                  intro: "error",
                  message: "Payment unsuccessful"
                }
    
                res.redirect("/buypage");
        }
  
        */
    
  });







function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

 //console.log("Not authenticated");
 /*
  req.session.message = {
    type: "danger",
    intro: "Error",
    message: "Log in to proceed"
  }
  */
  req.flash('info', 'Log in to proceed');
  res.redirect("/home")
}



router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/home');
});








module.exports = router;

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const router = express.Router();
const got = require("got");




router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  res.render("clients/deposit", { user: req.user});
});








router.post("/", checkAuthenticated, async function(req, res){

    //deposit into account
    const ids = `${req.user._id},${req.body.amount}`;

  
    //call flutterwave
    try {
      const response = await got.post("https://api.flutterwave.com/v3/payments", {
          headers: {
              Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
          },
          json: {
              tx_ref: ids,
              amount: req.body.amount,
              currency: "NGN",
              redirect_url: "https://www.socialogs.org/recievepayment",
              customer: {
                  email: req.user.Email,
              },
  
          }
      }).json();
  
      console.log(response);
      res.redirect(response.data.link);
  } catch (err) {
      console.log(err.code);
      console.log(err);
  }
              
  
    //end of main if
  });
  
  
  
  
  
  
  router.get('/payment-callback', async (req, res) => {
  
      console.log("this gu has started");
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
  req.flash('message', 'Log in to proceed');
  res.redirect("/")
}



router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/');
});








module.exports = router;

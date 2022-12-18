const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();





/*
router.get('/', async (req, res) => {
    
    console.log("badddd people")
    const ids = req.query.tx_ref;
    const valueId = ids.split(',');
    console.log(valueId);


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

      
  
});
*/



router.get('/', async (req, res) => {

  //console.log("badddd people")
  const ids = req.query.tx_ref;
  const valueId = ids.split(',');
  console.log(valueId);
    

    if (req.query.status === "successful") {
        // Success! Confirm the customer's payment

                      //Top up user
                      await User.findById({_id: valueId[0]}, function(err, user) {
                        if(err) {
                          //handle it
                        } else {

                          user.balance = valueId[1];

                        user.save(function(saveerr, saveresult){
                          if(saveerr){


                            req.flash('message', 'Payment unsuccessful');
                            res.redirect("/");

                          } else {

                            req.flash('message', 'Payment successful');
                            res.redirect("/shop");

                          }

                          
                        });

                      }

                      }).clone();


    } else {
        // Inform the customer their payment was unsuccessful
            req.flash('message', 'Payment unsuccessful');
            res.redirect("/");
    }

    

});









module.exports = router;
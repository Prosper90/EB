const express = require("express");
const path = require("path");
//const Products = require("../../model-database/products").Products;
const ProductsTwo = require("../../model-database/productTwo").ProductTwo;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();





router.get('/', async (req, res) => {


  
  console.log(req.query.reference);
  const ids = req.query.reference;
  const valueId = ids.split('-');
  

                 if(valueId.length == 6) {

                      console.log("Name two track");

                      //Remove the product from product list
                      await ProductsTwo.findById({_id: valueId[0]}, async function(err, product) {
                        if(err) {
                          //handle
                        } else {
                          //console.log(product, "working");
                          product.numOfItem -= valueId[3];
                          product.sold += valueId[3];
                          if(product.numOfItem == 1) {
                            product.available = false;
                          }

                          product.save();
                        }
                      }).clone();
                      

                      //create an order  
                      await User.findById({_id: valueId[1]}, function(err, user) {
                        if(err) {
                          //handle it
                        } else {
                    
                          user.OrdersMain.push({
                            price: valueId[2],
                            paymentmethod: "paystack",
                            status: 1,
                            buyid: valueId[0],
                            size: valueId[4]
                          })
                    
                    
                          user.markModified("OrdersMain");
                          user.save(function(saveerr, saveresult){
                          if(saveerr){
                            req.flash('message', 'Purchase fail');
                            res.redirect(`/buymain/${valueId[0]}`);
                    
                          } else {
                            req.flash('message', 'Purchase successful');
                            res.redirect(`/buymain/${valueId[0]}`);
                    
                          }
                    
                          
                        });
                    
                      }
                    
                      }).clone();


                    } else {

                        //Top up user
                        await User.findById({_id: valueId[0]}, function(err, user) {
                          if(err) {
                            //handle it
                          } else {

                            user.balance = valueId[1];

                            user.Deposit.push({
                              amount: valueId[1],
                              method: "Card",
                              status: 1
                            })
                            user.markModified('Deposit');
                            user.save(function(saveerr, saveresult){
                            if(saveerr){


                              req.flash('message', 'Deposit unsuccessful');
                              res.redirect("/home");

                            } else {

                              req.flash('message', 'Deposit successful');
                              res.redirect("/dashboard");

                            }

                            
                          });

                        }

                        }).clone();

                    }

});









module.exports = router;
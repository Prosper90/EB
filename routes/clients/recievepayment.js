const express = require("express");
const path = require("path");
//const Products = require("../../model-database/products").Products;
const ProductsTwo = require("../../model-database/productTwo").ProductTwo;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();
const Cart = require('../../model-database/cart');




router.get('/', async (req, res) => {


  
  console.log(req.query.reference);
  const ids = req.query.reference;
  const valueId = ids.split('-');
  
                 if(valueId.length == 5 && valueId[3] == "cart") {

                  //first off take out all the products from value[0]
                  //update user ordermain detail using value[2]
                  //remove or subtract the existing products from value[0]
                  //then redirect back to home

                  console.log(valueId, "called recieve");
                  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
                  var seletproduct = !req.session.cart ? null : cart.generateArray();

                  seletproduct.map(async (data) => {

                    await User.findById({_id: valueId[0]}, function(err, user) {
                      if(err) {
                        //handle it
                      } else {
                  
                        user.OrdersMain.push({
                          price: data.item.price,
                          paymentmethod: "paystack",
                          status: 1,
                          buyid: data.item._id,
                          size: "Default",
                          imgUrl: data.item.imgUrl,
                          name: data.item.name,
                          quantity: data.qty
                        })
                  
                  
                        user.markModified("OrdersMain");
                        user.save();
                  
                    }
                  
                    }).clone();



                    //Remove the product from product list
                    await ProductsTwo.findById({_id: data.item._id}, async function(err, product) {
                      if(err) {
                        //handle
                      } else {
                        //console.log(product, "working");
                        product.numOfItem -= data.qty;
                        product.sold += data.qty;
                        if(product.numOfItem == 1) {
                          product.available = false;
                        }

                        product.save(function(saveerr, saveresult){
                          if(saveerr){
                            req.flash('error', 'Checkout fail');
                            res.redirect(`/`);
                    
                          } else {
                            delete req.session.cart;
                            req.flash('success', 'checkout successful');
                            res.redirect(`/`);
                    
                          }
                    
                          
                        });
                      }
                    }).clone();

                  });



                 } else if(valueId.length == 6 && valueId[4] !== "cart") {


                      console.log("Name two track");

                      const productUse = await ProductsTwo.findById({_id: valueId[0]}).clone();

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
                            size: valueId[4],
                            imgUrl: productUse.imgUrl,
                            name: productUse.name,
                            quantity: valueId[3]
                          })

                          /*
                          dateandtime : {type: Date, default: Date.now},
                          price: {type: Number},
                          paymentmethod: {type: String},
                          status: {type: Number},
                          buyid: {type: String},
                          size: {type: String},
                          quantity: {type: Number},
                          imgUrl: {type: String},
                          name: {type: String}
                          */
                    
                    
                          user.markModified("OrdersMain");
                          user.save(function(saveerr, saveresult){
                          if(saveerr){
                            req.flash('error', 'Purchase fail');
                            res.redirect(`/buymain/${valueId[0]}`);
                    
                          } else {
                            req.flash('success', 'Purchase successful');
                            res.redirect(`/buymain/${valueId[0]}`);
                    
                          }
                    
                          
                        });
                    
                      }
                    
                      }).clone();


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

                    } else {

                        //Top up user
                        await User.findById({_id: valueId[0]}, function(err, user) {
                          if(err) {
                            //handle it
                          } else {

                            user.balance += valueId[1];

                            user.Deposit.push({
                              amount: valueId[1],
                              method: "Card",
                              status: 1
                            })
                            user.markModified('Deposit');
                            user.save(function(saveerr, saveresult){
                            if(saveerr){


                              req.flash('error', 'Deposit unsuccessful');
                              res.redirect("/home");

                            } else {

                              req.flash('success', 'Deposit successful');
                              res.redirect("/dashboard");

                            }

                            
                          });

                        }

                        }).clone();

                    }

});









module.exports = router;
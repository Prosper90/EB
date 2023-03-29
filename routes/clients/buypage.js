const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();


//checkAuthenticated,
router.get("/:id",  async function(req, res) {

  const getItem = await Products.findOne({type: req.params.id}, function(err, product) {
    if(err) {
      console.log(err);
    } else {
      return product;
    }
  }).clone();

  res.render("clients/buypage", { message: req.flash(), item: getItem });
});







//mainOnes
//buying items
router.post("/:id", checkAuthenticated, async function(req, res){

  //check for available market
   const checking = await Products.find({type: req.params.id}).clone();

  const check = checking.filter((data) => {
    return data.available == true;
  });

  console.log(check.length, "check check check");
  if(check.length < 1) {
    console.log("In here and running");
    req.flash('message', 'Out of stock');
    res.redirect(`/buypage/${req.params.id}`);
  } else {

        //find the item
        const findProduct = await Products.find({type: req.params.id}, function(err, product) {
          if(err) {
            //handle
          } else {
            return product;
          }
        }).clone();
        console.log(findProduct, "Testing");
    
        const totalPrice = findProduct[0].price * req.body.purchaseNumber;
        console.log(totalPrice);
    
    //Remove the product from product list
      await Products.find({type: req.params.id}, async function(err, product) {
        if(err) {
          //handle
        } else {
          //console.log(product, "working");
            product.map( async (data, index) => {
            if( index < req.body.purchaseNumber ) {
              await Products.updateOne({_id: String(data._id)}, {$set: {available: false}}).clone();
            }
          });
  
        }
      }).clone();
    
      //create an order amd update balance
      await User.findById({_id: req.user._id}, function(err, user) {
        if(err) {
          //handle it
        } else {
    
          user.balance -= totalPrice;
          
    
          findProduct.map((data, index) => {
           
            if(index < req.body.purchaseNumber) {
                user.Orders.push({
                  price: data.price,
                  paymentmethod: "card",
                  status: 1,
                  buyid: data._id
                });
            }
    
          })
    
    
          user.markModified("Orders");
          user.save(function(saveerr, saveresult){
          if(saveerr){
            req.flash('message', 'Purchase fail');
            res.redirect(`/buypage/${req.params.id}`);
    
          } else {
            req.flash('message', 'Purchase successful');
            res.redirect(`/buypage/${req.params.id}`);
    
          }
    
          
        });
    
      }
    
       }).clone();

  }
            

  //end of main if
});










function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  req.flash('message', 'Log in to proceed');
  res.redirect("/shop")
}



module.exports = router;
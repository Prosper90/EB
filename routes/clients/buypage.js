const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const console = require("console");
const router = express.Router();


//checkAuthenticated,
router.get("/:id",  async function(req, res) {
  
  console.log("check check check main");
  const getItem = await Products.find({type: req.params.id}, function(err, product) {
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
  if(check.length < req.body.purchaseNumber) {
    console.log("In here and running");
    req.flash('message', 'Not enough stock to order. Kindly order in lesser quantity');
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
        const buyids = [];
        let index;
    //Remove the product from product list
      await Products.find({type: req.params.id}, async function(err, product) {
        if(err) {
          //handle
        } else {
          //console.log(product, "working");
            product.map( async (data, index) => {
            if( index < req.body.purchaseNumber ) {
              await Products.updateOne({_id: String(data._id)}, {$set: {available: false}}).clone();
              buyids.push(data._id);
            }
          });
  
        }
      }).clone();
    
      //create an order amd update balance
      await User.findById({_id: req.user._id}, function(err, user) {
        if(err) {
          //handle it
        } else {
          
          console.log(buyids, "buyids");
          user.balance -= totalPrice;
          user.Orders.push({
            price: totalPrice,
            paymentmethod: "card",
            status: 1,
            buyid: buyids,
            type: findProduct[0].type
          });
          if (user.Orders.length !== 0) {
            index = user.Orders.length - 1;            
          }else{
            index = user.Orders.length;            
          }
  
    
    
          user.markModified("Orders");
          user.save(function(saveerr, saveresult){
          if(saveerr){
            req.flash('message', 'Purchase fail');
            res.redirect(`/buypage/${req.params.id}`);
          } else {
            req.flash('message', 'Purchase successful');
            res.redirect(`/orderdetail/${findProduct[0].type}/${index}`);
    
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
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
const Admin = require("../../model-database/users").Admin;
const router = express.Router()




router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
   let users = await User.find().clone();
   let products = await Products.find().clone();
   let totalusers = await User.find().count().clone();
  res.render("admin/dashboard", { users: users, totalusers: totalusers, user: req.user, products: products, active: "dashboard", message: req.flash()});
});




router.get("/paid/:id", checkAuthenticated, async function(req, res){
  //console.log(req.user);
    
  await User.findById({_id: req.params.id}, function(err, user){
    if(err){
      console.log(err);
    } else {
      
      user.Withdraw = [];

      //update notification
      user.Notification.push({"message": "Withdrawal successful"});
      user.Wallet.balance -= req.query.amount;
    
      
  
      user.markModified("Withdraw");
      user.save(function(saveerr, saveresult){
        if(saveerr){
          req.session.message = {
            type: "danger",
            intro: "invest error",
            message: "Something went wrong"
          }
          res.redirect("/admin");
        } else {
          req.session.message = {
            type: "success",
            intro: "Success",
            message: "User Paid"
          }
          res.redirect("/admin");
        }
  
    });
  
  
  }
  
  }).clone();
  
});









router.post("/userinfo/:id", checkAuthenticated, async function(req, res){

  //console.log("Called this bad boy");
  //console.log(req.params.id);
  
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await User.findById({_id: req.params.id}, function(err, user){
  if(err){
    console.log(err);
  } else {
    console.log("in in here");
    //console.log(user);
    //console.log(req.body);
    
    user.Wallet.balance = req.body.balance;
    user.Wallet.profits = req.body.profits;
    user.Wallet.losses = req.body.losses;
    user.Email = req.body.email;
    user.username = req.body.username;
    user.country = req.body.country;
    if(user.password === req.body.password){
       user.password = req.body.password;
    } else {
      user.password = hashedPassword;
    }
    


    user.save(function(saveerr, saveresult){
      if(saveerr){
        console.log(saveerr)
        req.session.message = {
          type: "danger",
          intro: "invest error",
          message: "Something went wrong"
        }
        res.redirect("/admin");
      } else {
        req.session.message = {
          type: "success",
          intro: "Success",
          message: "User info changed"
        }
        res.redirect("/admin");
      }

  });


}

}).clone();


});













function checkAuthenticated(req, res, next){
  if(req.isAuthenticated() && req.user.email === "EBtheadmin@gmail.com"){
    return next()
  } else{

  res.redirect("/adminlogin")

  }

}





router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/');
});








module.exports = router;

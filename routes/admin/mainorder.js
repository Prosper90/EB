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
 res.render("admin/mainorders", { users: users, totalusers: totalusers, user: req.user, products: products, active: "mainorder",});
});



router.get("/mainorders/fufill/:id/:order", checkAuthenticated, async function(req, res){
  
  await User.findById({_id: req.params.id}, function(err, user) {
     if(err) {
      //handle
     } else {

        user.OrdersMain.map((data) => {
           if(data._id === req.params.order) {
             data.status = 1;
           }
        })

        user.markModified("OrdersMain");
        user.save(function(saveerr, saveresult){
          if(saveerr){
            //set failed flash message
            res.redirect("/mainorder");
          } else {
            //send success flash message
            res.redirect("/mainorder");
          }
    
      });


     }

  }).clone();

});








/*
router.post("/user/:id", checkAuthenticated, async function(req, res){
  

  await User.findById({_id: req.params.id}, function(err, user){
  if(err){
    console.log(err);
  } else {
    
    user.Wallet.balance = req.body.updatedbalance;
    

    //update deposit history of user
    user.Deposit.map((datatoset) => {

        user.DepositHistory.push({
          amount: datatoset.amount,
          method: datatoset.method,
          account: user.Email,
          status: 1
      });

      //update notification
      user.Notification.push({"message": `Deposit of $ ${datatoset.amount} successful`});

    });

    user.Deposit = [];

    
    //update teansactions
    user.Transactions.push({
        type: "Deposit",
        status: 1,
    });


 




    //Clear deposit object
    user.Deposit.amount = 0;
    user.Deposit.method = "";
    user.Deposit.status = 0;
    

    user.markModified('DepositHistory');
    user.markModified('Transactions');
    user.markModified('Deposit');
    user.markModified('Notification');
    user.save(function(saveerr, saveresult){
      if(saveerr){
          console.log(saveerr);
        req.session.message = {
          type: "danger",
          intro: "invest error",
          message: "Something went wrong"
        }
        res.redirect("/confirmdeposit");
      } else {
        req.session.message = {
          type: "success",
          intro: "Success",
          message: "User deposit confirmed"
        }
        res.redirect("/confirmdeposit");
      }

  });


}

}).clone();


});
*/








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

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const router = express.Router()
const Cart = require('../../model-database/cart');




router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  var seletproduct = !req.session.cart ? null : cart.generateArray();
  res.render("myaccount", { user: req.user, cartProducts: seletproduct,});
});





router.post("/:id", checkAuthenticated, async function(req, res){


  var objForUpdate = {};

  if (req.body.name) objForUpdate.username = req.body.name;
  if (req.body.email) objForUpdate.Email = req.body.email;
  //if (req.body.gender) objForUpdate.gender = req.body.gender;
  //if (file) objForUpdate.avatar = `${basePath}${fileName}`;
  if (req.body.address) objForUpdate.address = req.body.address;
  if (req.body.phone) objForUpdate.phone = req.body.phone;
  //if (req.body.about) objForUpdate.about = req.body.about;
  if (req.body.dateofbirth) objForUpdate.dateofbirth = req.body.dateofbirth;
  //if(!file) return res.status(400).send('No image in the request')


  let user = await User.findByIdAndUpdate(
        req.params.id,
        objForUpdate,
   { new: true}
  )

  user = await user.save();

  if(!user) 
  req.flash('info', 'User error');
  return res.redirect("/myaccount");
 
  req.flash("success", "Account updated")
  res.redirect('/myaccount');
})





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
  res.redirect("/")
}



router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/');
});








module.exports = router;

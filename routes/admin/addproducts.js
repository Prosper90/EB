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
  res.render("admin/addproducts", { users: users, totalusers: totalusers, user: req.user, products: products, active: "addproducts"});
});











router.post("/", async function(req, res){
  
  //checking if fields are empty
    if(req.body.name == "" || req.body.password == "" || req.body.type == "" || req.body.price == ""|| req.body.description == ""  ){

     req.session.message = {
       type: "danger",
       intro: "Empty fields",
       message: "Please insert the requested information"
     }
  
     res.redirect("register");
    }
    
    //checks if the confirm password matches the first password
    else {
  
  //putting data to the database
  
  //hash password and save to the database
  try{
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  
   let product = new Products({
    name: req.body.name,
    type: req.body.type,
    password: req.body.password,
    available: true,
    price: req.body.price,
    description: req.body.description,
   });
  
    
   product.save();
  

      res.redirect(`admin`);


    } catch {
    res.redirect("admin");
    }
  
  }

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

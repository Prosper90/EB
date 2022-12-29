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
  res.render("admin/addproducts", { users: users, totalusers: totalusers, user: req.user, products: products, active: "addproducts", message: req.flash()});
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


        //name
        const tempNames = req.body.name;
        const productNames = tempNames.split(",");
        //type
        const tempType = req.body.type;
        const productType = tempType.split(",");
        //password
        const tempPassword = req.body.password;
        const productPassword = tempPassword.split(",");
        //price
        const tempPrice = req.body.price;
        const productPrice = tempPrice.split(",");
        //price
        const tempDesc = req.body.price;
        const productDesc = tempDesc.split(",");
  
  //putting data to the database
  
  try{
  
    console.log(productNames, "namesing");
  const dataUpload = [];

  productNames.map((data, index) => {
    dataUpload.push({
      name: data,
      type: productType[index],
      password: productPassword[index],
      available: true,
      price: parseInt(productPrice[index]),
      description: productDesc[index],
    })
  })
   
   console.log(dataUpload);
   await Products.insertMany(dataUpload);

   req.flash('message', 'Added data successfully');
   res.redirect("admin");
  
  /*
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
*/

    } catch {
    res.redirect("admin");
    }
  
  }

  });


//submit one

router.post("/one", async function(req, res){
  console.log(req.body);
  //console.log(req.body.details1);
  
  //checking if fields are empty
    if(req.body.name == "" || req.body.type == "" || req.body.price == ""){

     req.session.message = {
       type: "danger",
       intro: "Empty fields",
       message: "Please insert the requested information"
     }
  
     res.redirect("addproducts");
    }

    else {
  
  //putting data to the database
  
  try{

  console.log("In here");
  const dataUpload = [];

  for (let index = 1; index <= req.body.totals; index++) {

    
      dataUpload.push({
        name: req.body.name,
        type: req.body.type,
        password: req.body[`details${index}`],
        available: true,
        price: req.body.price,
        description: req.body[`details${index}`],
      })
  
  }
   
  
   console.log(dataUpload);
   
   await Products.insertMany(dataUpload);

   req.flash('message', 'Added data successfully');
   res.redirect("/admin");


   console.log("inside body of form");

    } catch {
    res.redirect("/admin");
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

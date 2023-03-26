const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
const ProductTwo = require("../../model-database/productTwo").ProductTwo;
const Admin = require("../../model-database/users").Admin;
const router = express.Router()
const multer = require("multer");
const fs = require("fs");




router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
   let users = await User.find().clone();
   let products = await Products.find().clone();
   let productsTwo = await ProductTwo.find().clone();
   let totalusers = await User.find().count().clone();
  res.render("admin/addproducts", { users: users, productsTwo: productsTwo, totalusers: totalusers, user: req.user, products: products, active: "addproducts", message: req.flash()});
});







//multer package to help with upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/uploads")
  },
  filename: function (req, file, cb) {
    const { originalname} = file;
    cb(null, originalname);
  }
});


const upload = multer({ storage: storage });



router.post("/", upload.single("mediaImg"), async function(req, res) {
  
  //checking if fields are empty
    if(req.body.name == "" || req.body.password == "" || req.body.type == "" || req.body.price == ""|| req.body.description == ""  ){

     req.session.message = {
       type: "danger",
       intro: "Empty fields",
       message: "Please insert the requested information"
     }
  
     res.redirect("register");
    }
    
    else {
     
      console.log(JSON.stringify(req.file), "req file");
    //get the latest uploaded file
    function getLatestFile(dirpath) {
      console.log("one");
      // Check if dirpath exist or not right here
      let latest;
      console.log("two");
      const files = fs.readdirSync(dirpath);
      files.forEach(filename => {
        // Get the stat
        console.log("three", filename);
        const stat = fs.lstatSync(path.join(dirpath, filename));
        // Pass if it is a directory
        if (stat.isDirectory())
          return;
        // latest default to first file
        if (!latest) {
          console.log("four");
          latest = {filename, mtime: stat.mtime};
          return;
        }
        // update latest if mtime is greater than the current latest
        if (stat.mtime > latest.mtime) {
          console.log("four");
          latest.filename = filename;
          latest.mtime = stat.mtime;
        }
      });

      return latest.filename;
    }



    let img = getLatestFile("public/assets/uploads");

    //get the src of the new uploaded media
    
    let src = "/assets/uploads/"+ img + " ";
    console.log(src, "source");

        //name
        const tempNames = req.body.productName;
  
        //type
        const tempType = req.body.productType;

        //price
        const tempPrice = req.body.productPrice;

        //details
        const details = req.body.details;
 
  
  //putting data to the database
  
  try{


  
  console.log(req.body.productNumber, "namesing");
  const dataUpload = [];

  for (let index = 0; index < req.body.productNumber; index++) {
     console.log("for loop", index);
    dataUpload.push({
      name: tempNames,
      type: tempType,
      imgUrl: src,
      available: true,
      price: parseInt(tempPrice),
      details: details
    })
    
  }
  
   console.log("Reached here");
   //console.log(dataUpload);
   await ProductTwo.insertMany(dataUpload);

   console.log("All done");

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
        description: req.body[`description${index}`],
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

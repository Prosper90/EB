const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
const ProductsTwo = require("../../model-database/productTwo").ProductTwo;
const Admin = require("../../model-database/users").Admin;
const router = express.Router()
const fs = require('fs');



router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  let users = await User.find().clone();
  let products = await Products.find().clone();
  let productsTwo = await ProductsTwo.find().clone();
  let totalusers = await User.find().count().clone();
 res.render("admin/mainproduct", { users: users, productsTwo: productsTwo, products: products, totalusers: totalusers, user: req.user, active: "mainproducts", message: req.flash()});
});






//remove products
router.post("/:id/:name", checkAuthenticated, async function(req, res){

   //updating product
    //console.log(req.params);
    //getting the particular data to update
    let productRemove = await ProductsTwo.findById(req.params.id);
    //console.log(uploadedSong);
    //getting the url to delete
    let oldImage = productRemove.imgUrl;


    //console.log(oldImage);

    function deleteFile(dirpath) {

        const files = fs.readdirSync(dirpath);
        files.forEach(filename => {
        let check = "/assets/uploads/" + filename + " ";
        // Get the stat
        //console.log(filename);
        //console.log(check);
        if(oldImage == check){
          //console.log(check, "two");
        try {
        fs.unlinkSync("public/assets/uploads/" + filename + "");
        console.log("file deleted");
        //file removed
        } catch(err) {
        console.error(err)
        }

        };
    });

    }


   deleteFile("public/assets/uploads");

    const getResult = await ProductsTwo.deleteMany({name: req.params.name}).clone();
    
    if(getResult.deletedCount) {
      req.session.message = {
        type: "success",
        intro: "Success",
        message: "Products removed"
      }

      res.redirect("/mainproducts");
    } else {
      req.session.message = {
        type: "danger",
        intro: "Success",
        message: "Process failed"
      }
      res.redirect("/mainproducts");
    }


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

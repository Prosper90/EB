const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
const Admin = require("../../model-database/users").Admin;
const router = express.Router()




router.get("/", checkAuthenticated, async function(req, res){
  try {
    let users = await User.find();
    let products = await Products.find();
    let totalusers = await User.countDocuments();

      let totalBalance = await User.aggregate([
        {
            $group: {
                _id: null,
                totalBalance: { $sum: "$balance" }
            }
        }
    ]);

    console.log(totalBalance);

    let totalAmountBought = await User.aggregate([
        { $unwind: "$Orders" },
        {
            $match: {
                "Orders.status": "success"
            }
        },
        {
            $group: {
                _id: null,
                totalAmountBought: { $sum: "$Orders.price" }
            }
        }
    ]);
    console.log(totalAmountBought);

    // req.flash("success", "Added products successfully");
    res.render("admin/dashboard", { users, totalusers, user: req.user, products, active: "dashboard", totalBalance: totalBalance | 0, totalAmountBought: totalAmountBought | 0 });
  } catch (error) {
    console.error(error);
    // req.flash('error', 'An error occurred');
    res.redirect('/admin/dashboard');
  }
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


router.post("/ticket/:userid/:ticketid", checkAuthenticated, async function(req, res){
  try {
    await User.findOneAndUpdate(
      {
        _id: req.params.userid,
        "Ticket.ticket_id": req.params.ticketid,
      },
      {
        $set: {
          "Ticket.$.status": req.body.admin_pick,
        },
      },
      { new: true }
    );
    
    req.flash("success", "Ticket updated");
    res.redirect("/admin");

  } catch (error) {
    req.flash("error", "Something went wrong");
    res.redirect("/admin");
  }
})










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

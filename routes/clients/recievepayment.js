const express = require("express");
const path = require("path");
//const Products = require("../../model-database/products").Products;
// const ProductsTwo = require("../../model-database/productTwo").ProductTwo;
const User = require("../../model-database/users").User;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();
const Cart = require('../../model-database/cart');




router.get('/', async (req, res) => {


  
  // console.log(req.query);
  const ids = req.query.reference;
  const valueId = ids.split('-');
  
 try {

    console.log(req.body, "checking");
    const user = await User.findOneAndUpdate(
      {_id: valueId[0]},
      {
        $inc : { balance: parseFloat(valueId[1]/100)},
        $push: {"Deposit": {
          amount: valueId[1],
          method: "Card",
          status: 1
        }}
      },
      {new: true}
      );

      if(!user) {
        req.flash('error', 'Deposit unsuccessful');
        res.redirect("/");
      }
      
      req.flash('success', 'Deposit successful');
      res.redirect("/dashboard");


  } catch(err) {
    req.flash('error', 'Deposit failed');
    res.redirect("/dashboard");
  }

});









module.exports = router;
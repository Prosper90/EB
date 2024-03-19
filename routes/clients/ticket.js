const express = require("express");
const path = require("path");
const User = require("../../model-database/users").User;
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { generateRandomAlphaNumeric } = require("../../utils/generate");
const router = express.Router();



router.get("/:id", checkAuthenticated, async function(req, res){
    const Item = await await Products.findById(req.params.id);
    console.log(Item, req.params.id, "tired");
    const ticketId = generateRandomAlphaNumeric(6);

  res.render("clients/ticket", {user: req.user, item: Item, transferAccount: undefined, ticketId: ticketId} );
});



router.post("/:product_id", checkAuthenticated, async function(req, res){
    try {
        const {ticketId, issue,} = req.body;
        console.log(req.body, "hi there");
        const ticket = {
            ticket_id: ticketId,
            issue: issue,
            product_id: req.params.product_id,
            status: "pending",
        }
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$push: {
              Tickets: ticket
            }});
            req.flash("success", "Ticket Submitted we would get to you");
            res.redirect(`/ticket/${req.params.product_id}`);
    } catch (error) {
        console.log("something went wrong", error);
        req.flash("warning", "Log in to proceed");
        res.redirect(`/ticket/${req.params.product_id}`);
    }
})






function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
  
    res.redirect("/")
  }
  






module.exports = router;
const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
const User = require("../../model-database/users").User;
const bcrypt = require("bcrypt");
const router = express.Router();




/*
router.get('/', async (req, res) => {

  //console.log("badddd people")
  const ids = req.query.tx_ref;
  const valueId = ids.split(',');
  console.log(valueId);
    

    if (req.query.status === "successful") {
        // Success! Confirm the customer's payment

                      //Top up user
                      await User.findById({_id: valueId[0]}, function(err, user) {
                        if(err) {
                          //handle it
                        } else {

                          user.balance = valueId[1];

                          user.Deposit.push({
                            amount: valueId[1],
                            method: "Card",
                            status: 1
                          })
                           user.markModified('Deposit');
                           user.save(function(saveerr, saveresult){
                          if(saveerr){


                            req.flash('message', 'Deposit unsuccessful');
                            res.redirect("/");

                          } else {

                            req.flash('message', 'Deposit successful');
                            res.redirect("/dashboard");

                          }

                          
                        });

                      }

                      }).clone();


    } else {
        // Inform the customer their payment was unsuccessful
            req.flash('message', 'Payment unsuccessful');
            res.redirect("/");
    }

    

});
*/





// In an Express-like app:

router.post("/", async (req, res) => {
    // If you specified a secret hash, check for the signature
    const payload = req.body;
    // It's a good idea to log all received events.
    console.log("called webhook and it worked so getting ready")
    console.log(payload);
    console.log(req.body);
    console.log(req.query);
    console.log(req.params);
    const ids = req.body.payload.data.tx_ref;
    const valueId = ids.split(',');
    console.log(valueId);


      //Top up user
      await User.findById({_id: valueId[0]}, function(err, user) {
        if(err) {
          //handle it
        } else {

          user.balance = valueId[1];

          user.Deposit.push({
            amount: payload.amount,
            method: "Transfer",
            status: 1
          })
            user.markModified('Deposit');
            user.save(function(saveerr, saveresult){
          if(saveerr){


            req.flash('message', 'Deposit unsuccessful');
            res.redirect("/");

          } else {

            req.flash('message', 'Deposit successful');
            res.redirect("/dashboard");

          }

          
        });

      }

      }).clone();




    // Do something (that doesn't take too long) with the payload
    //res.status(200).end()
});










module.exports = router;
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../model-database/users").User;
const router = express.Router();
const got = require("got");
const axios = require("axios");
const Flutterwave = require('flutterwave-node-v3');



router.get("/", checkAuthenticated, async function(req, res){
  //console.log(req.user);
  console.log(req.params);

  const banks = await axios.get( `https://api.flutterwave.com/v3/banks/NG`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`
      }

    }
  );
  const transferAccount = req.session.transferAccount;
  //console.log(banks.data);
  res.render("clients/deposit", { user: req.user, banks: banks.data.data, transferAccount: transferAccount, message: req.flash()});
});








router.post("/", checkAuthenticated, async function(req, res){

   if(req.body.amount < 1000) {
    console.log("Amount too small");
    return;
   }
   console.log(req.body);

    //deposit into account
    const ids = `${req.user._id}AMOUNT${req.body.amount}`;
    console.log(ids);

 try{

    const response = await axios({
      method: "POST",
      url: "https://sandbox-api-d.squadco.com/transaction/initiate",
      headers: {
        Authorization:`Bearer ${process.env.SQUAD_SECRET_KEY}`
      },
      data: {
        email: req.user.Email,
        amount: parseFloat(req.body.amount),
        initiate_type: "inline",
        currency: "NGN",
        transaction_ref: ids,
        customer_name: req.user.username,
        callback_url: `https://www.socialogs.org/recievepayment?pay=${ids}`,
      },
    })
    //console.log(response.data);
    res.redirect(response.data.data.checkout_url);
  } catch (err) {
      console.log(err.code);
      console.log(err);
   }



  /*
    if(req.body.methodselect == "Card") {
      //call flutterwave

          try {
            //flutter wave
            
            const response = await got.post("https://api.flutterwave.com/v3/payments", {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
                },
                json: {
                    tx_ref: ids,
                    amount: req.body.amount,
                    currency: "NGN",
                    redirect_url: "https://www.socialogs.org/recievepayment",
                    customer: {
                        email: req.user.Email,
                    },
        
                }
            }).json();
        
            console.log(response);
            res.redirect(response.data.link);
            
        

          console.log(typeof(req.body.amount));

          const response = await axios({
            method: "POST",
            url: "https://sandbox-api-d.squadco.com/transaction/initiate",
            headers: {
              Authorization:`Bearer ${process.env.SQUAD_SECRET_KEY}`
            },
            data: {
              email: req.user.Email,
              amount: parseFloat(req.body.amount),
              initiate_type: "inline",
              currency: "NGN",
              transaction_ref: ids,
              customer_name: req.user.username,
              callback_url: "https://www.socialogs.org/recievepayment",
            },
          })
          //console.log(response.data);
          res.redirect(response.data.data.checkout_url);
        } catch (err) {
            console.log(err.code);
            console.log(err);
       }

    } else if(req.body.methodselect == "TransferBank") {

      
      const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
        const details = {
            tx_ref: ids,
            amount: req.body.amount,
            email: req.user.Email,
            currency: "NGN",
        };
        const response = await flw.Charge.bank_transfer(details);
        console.log(response);
        req.session.transferAccount =  response.meta.authorization;
    
        console.log("Bank");
        res.redirect("/deposit");

    } else {
      
      const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
      const payload = {
          account_bank: req.body.bankselect,
          amount: req.body.amount,
          currency: 'NGN',
          email: req.user.Email,
          tx_ref: ids,
          fullname: req.user.username,
      };
      const response = await flw.Charge.ussd(payload);

        req.session.transferAccount =  response.meta.authorization;

          res.redirect("/deposit");
    }
    */
  
  
    //end of main if
 });
  
  
  
  
  
  
  router.get('/payment-callback', async (req, res) => {
  
      console.log("this guy has started");
      const ids = req.query.tx_ref;
      const valueId = ids.split(',');
      console.log(valueId);
  
  /*
        if (req.query.status === "successful") {
            // Success! Confirm the customer's payment
  
                        //updating Products
                        await Products.findById({_id: valueId[0]}, function(err, product){
    
                          if(err){
                            console.log(err);
                          } else {
                  
                          //update product
                          product.available = false;
                            
                
                  
                          product.save(function(saveerr, saveresult){
                            if(saveerr){
                              //throw error
                            } else {
                             //works
                            }
                          });
  
                        }
                  
                        }).clone();
  
  
  
  
                          //complete an order
                          await User.findById({_id: valueId[1]}, function(err, user) {
                            if(err) {
                              //handle it
                            } else {
  
                              user.Orders.map((data) => {
                                if(data.buyid === valueId[0]) {
                                  data.status = 1;
                                }
                              })
  
  
                            user.markModified("Orders");
                            user.save(function(saveerr, saveresult){
                              if(saveerr){
  
                                req.session.message = {
                                  type: "danger",
                                  intro: "error",
                                  message: "Payment unsuccessful"
                                }
                    
                                res.redirect("/buypage");
  
                              } else {
  
                                req.session.message = {
                                  type: "success",
                                  intro: "complete",
                                  message: "Payment successful"
                                }
                    
                                res.redirect("/shop");
  
                              }
  
                              
                            });
  
                          }
  
                          }).clone();
  
  
        } else {
            // Inform the customer their payment was unsuccessful
                req.session.message = {
                  type: "danger",
                  intro: "error",
                  message: "Payment unsuccessful"
                }
    
                res.redirect("/buypage");
        }
  
        */
    
  });







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
  req.flash('message', 'Log in to proceed');
  res.redirect("/")
}



router.get('/logout', function(req, res){
  req.logout(function(err) {
    if(err) {return next(err);}
  });
  res.redirect('/');
});








module.exports = router;

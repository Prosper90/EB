const express = require("express");
const path = require("path");
// const ProductTwo = require("../../model-database/productTwo").ProductTwo;
const User = require("../../model-database/users").User;
const bcrypt = require("bcrypt");
const router = express.Router();
const axios = require("axios");
const Cart = require("../../model-database/cart");



router.get("/:id", checkAuthenticated, async function(req, res) {

  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  const getItem = await ProductTwo.findOne({_id: req.params.id}, function(err, product) {
    if(err) {
      console.log(err);
    } else {
      return product;
    }
  }).clone();
  //res.render("homemain", {message: req.flash(), sideProducts: sideProducts, user: req.user, cartProducts: seletproduct,  });
  var seletproduct = !req.session.cart ? null : cart.generateArray();
  res.render("buypagehf/mainProducts", { message: req.flash(), item: getItem, user: req.user, cartProducts: seletproduct });
});





router.get("/add-to-cart/:id", checkAuthenticated, async function(req, res){

  console.log(req.params.id, "called here add-to-cart");
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  var seletproduct = !req.session.cart ? null : cart.generateArray();
  await ProductTwo.findById({_id: req.params.id}, async function(err, product) {
    if(err) console.log(err);
    console.log(seletproduct, "select product")
    const foundObj = seletproduct?.find(obj => obj.item._id === product._id);
    if(foundObj !== null) {
      if(foundObj?.qty > product.numOfItem) {
        console.log("In here and running");
        req.flash('warning', 'Out of stock');
        res.redirect(`/buymain/${req.params.id}`);
        return;
      }
    }

  //this.add = function(item, id) {
  cart.add(product, product._id);
  req.session.cart = cart;
  console.log(req.session.cart);
  res.redirect(`/buymain/${product._id}`);
  }).clone()
  
  

})




//mainOnes

router.post("/:id", checkAuthenticated, async function(req, res){
  

  console.log(req.body.purchaseNumber, "Total number");

  await ProductTwo.findById({_id: req.params.id}, async function(err, product) {
    if(err) {
     //handle
    } else {
      if(req.body.purchaseNumber > product.numOfItem) {
        console.log("In here and running");
        req.flash('info', 'Out of stock');
        res.redirect(`/buymain/${req.params.id}`);
        return;
      } else {

          const totalPrice = product.price * req.body.purchaseNumber;
          const valueB =  totalPrice / 0.01;
    
          const ids = `${req.params.id}-${req.user._id}-${valueB}-${req.body.purchaseNumber}-${req.body.size}-${Math.floor(( Math.random()  * 1000000000 ) )}`;
          console.log(ids);

          const basePath = `${req.protocol}://${req.get('host')}`;
          //call paystack
          //http://localhost:3000/recievepayment
          //https://www.socialogs.org/recievepayment
          try {
              const response = await axios({
                method: "POST",
                url: "https://api.paystack.co/transaction/initialize",
                headers: {
                  Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                },
                data: {
                  "email": req.user.Email,
                  "amount": valueB,
                  "callback_url": `${basePath}/recievepayment`,
                  "reference": ids
                },
              })
              
    
            res.redirect(response.data.data.authorization_url);              
          } catch (error) {
            req.flash('error', 'Network err');
            res.redirect(`/buymain/${req.params.id}`);            
          }
      
      }


    }
   }).clone();
  
            

  //end of main if
});





















/*
router.get("/", async function(req, res){
  res.render("clients/buypage", { message: req.flash() });
});
*/





/*
router.post("/:id", checkAuthenticated, async function(req, res){
  console.log("called my main man");

  //find the item
  const findProduct = await Products.findById({_id: req.params.id}, function(err, product) {
    if(err) {
      //handle
    } else {
      return product;
    }
  }).clone();

  const totalIds = `${findProduct._id},${req.user._id}`;
console.log(totalIds);

  //create an order first off
  await User.findById({_id: req.user._id}, function(err, user) {
    if(err) {
      //handle it
    } else {

      user.Orders.push({
        price: findProduct.price,
        paymentmethod: "card",
        status: 0,
        buyid: findProduct._id,
      });


    user.markModified("Orders");
    user.save(function(saveerr, saveresult){
      if(saveerr){

       console.log("err");

      } else {

        console.log("success");

      }

      
    });

  }

  }).clone();

  //call flutterwave
  try {
    const response = await got.post("https://api.flutterwave.com/v3/payments", {
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
        },
        json: {
            tx_ref: totalIds,
            amount: findProduct.price,
            currency: "NGN",
            redirect_url: "http://localhost:3000/recievepayment",
            customer: {
                email: req.user.Email,
            },

        }
    }).json();

    console.log(response);
    res.redirect(response.data.link);
} catch (err) {
    console.log(err.code);
    console.log(err.response.body);
}
            

  //end of main if
});






router.get('/payment-callback', async (req, res) => {

    console.log("this gu has started");
    const ids = req.query.tx_ref;
    const valueId = ids.split(',');
    console.log(valueId);


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

  
});
*/








function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }

  req.flash('info', 'Log in to proceed');
  res.redirect("/")
}



module.exports = router;
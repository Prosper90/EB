require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");



/*
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/EB",
   { useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log('connected to DB!'))
    .catch(error => console.log(error));
*/







  //for walletAddress info
  const WalletAddressSchema = mongoose.Schema({
    BTC: {type: String},
    BNB: {type: String},
    Doge: {type: String},
  });

  //for investment
  const ordersSchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  price: {type: Number},
  paymentmethod: {type: String},
  status: {type: Number},
  buyid: {type: mongoose.Schema.Types.ObjectId, ref: "Products"},
  type: {type: String}
  });


  

  //for investment
  const ordersSchemaMain = mongoose.Schema({
    dateandtime : {type: Date, default: Date.now},
    price: {type: Number},
    paymentmethod: {type: String},
    status: {type: Number},
    buyid: {type: String},
    size: {type: String},
    quantity: {type: Number},
    imgUrl: {type: String},
    name: {type: String}
  });



//for deposit history
const depositHistorySchema = mongoose.Schema({
  dateandtime : {type: Date, default: Date.now},
  amount: {type: Number},
  method: {type: String},
  account: {type: String},
  status: {type: Number},
});




//for deposit
const depositSchema = mongoose.Schema({
dateandtime : {type: Date, default: Date.now},
amount: {type: Number},
method: {type: String},
status: {type: Number},
});

  



//for users collection
const userSchema = mongoose.Schema({
 dateandtime : {type: Date, default: Date.now},
 username: {type: String, required: true},
 Email: {type: String, required: true},
 password: {type: String, required: true},
 balance: {type: Number},
 CryptoAddress: WalletAddressSchema,
 Orders: [ordersSchema],
 OrdersMain: [ordersSchemaMain],
 Deposit: [depositSchema],
 DepositHistory: [depositHistorySchema],
 address: {type: String},
 dateofbirth: {type: Date}
});


 module.exports = {
   User: mongoose.model("User", userSchema),
 }

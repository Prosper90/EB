require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");


const subscribers = mongoose.Schema({
  email: {type: String}
})


const adminSchema = mongoose.Schema({

  email: {type: String, required: true},
  password: {type: String, required: true},
  Subscribers: [subscribers]
});



module.exports = {
  Admin: mongoose.model("Admin", adminSchema ),
}

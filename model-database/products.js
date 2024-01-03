require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");

/*
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/EB",
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  },
    function (err, res) {
        try {
            console.log('Connected to Database');
        } catch (err) {
            throw err;
        }
    });
*/

const productSchema = mongoose.Schema({
  dateandtime: { type: Date, default: Date.now },
  type: { type: String, required: true },
  title: { type: String, required: true },
  names: { type: String },
  password: { type: String },
  available: { type: Boolean, required: true, default: true },
  price: { type: Number, required: true, default: 0 },
  numOfItem: { type: Number },
  details: { type: String },
  format: { type: String },
  description: { type: String },
});

module.exports = {
  Products: mongoose.model("Products", productSchema),
};

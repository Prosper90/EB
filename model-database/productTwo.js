require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");

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


const productTwoSchema = mongoose.Schema({
    dateandtime : {type: Date, default: Date.now},
    name: {type: String, required: true},
    type: {type: String, required: true},
    imgUrl: {type: String, required: true},
    available: {type: Boolean, required: true},
    price: {type: Number, required: true},
    details: {type: String}
});



module.exports = {
  ProductTwo: mongoose.model("ProductTwo", productTwoSchema ),
}

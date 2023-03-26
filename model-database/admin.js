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

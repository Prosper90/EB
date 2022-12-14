const express = require("express");
const path = require("path");
const Products = require("../../model-database/products").Products;
//const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const router = express.Router();


/*
router.get("/", async function(req, res){
  const products = await Products.find().clone();
  res.render("shop", {products: products});
});
*/



router.get("/", async function(req, res){

  let page = req.query.page;
  let size = 12;
  if(!page){
    page = 1;
 }
   const limit = size;
   const skip = (page - 1) * size;
 
    const products = await Products.find().sort({ _id: -1}).limit(limit).skip(skip);
 
    const totalCount = await Products.count();
 
    //console.log(totalSongs);
 
 
    res.render("shop",
    {
      products : products,
      currentPage : page,
      pageCount : Math.ceil(totalCount/size),
      message: req.flash() ,
      active: "shop"
     });

});















module.exports = router;
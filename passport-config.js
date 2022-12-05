const LocalStrategy = require("passport-local").Strategy;
const User = require("./model-database/users").User;
const Admin = require("./model-database/admin").Admin;
const bcrypt = require("bcrypt");


function initialize(passport){
passport.use(new LocalStrategy(  { usernameField: 'Email', passwordField: 'password',  passReqToCallback: true },
async function(req, Email, password,  done){

 //console.log("running");



  if(req.params.admin == "adminmanage"){
   console.log("starting");
    //check for admin
    try{
   await Admin.findOne({ Email: Email }, function(err, user){
     if (err)  return done(err);
     //check if user exist
       //console.log(user);
     if(!user) {
      // console.log("user false");
       return done(null, false, {message: "Wrong Email"});
     }

          //checks for password
      else if( password == user.password){
        //  console.log("check password");
          done(null, user);
          return
        } else {
          return done(null, false, {message: "password do not match"});
        }


     }).clone();
   } catch(err){
     console.log(err);
     process.exit(1);
   };

 } else {
    //end of check for admin


//finding client user in database
//console.log("user entered");
//console.log(email);
await User.findOne({ Email: Email }, async (err, user) => {
  //console.log(user, "called");
  if (err)  return done(err);
  //check if user exist
  if(!user) {
    //console.log("second happy");
    return done(null, false, {message: 'No such Email Registerd'});
  };



       //checks for password
     if(await bcrypt.compare(password, user.password) ){
       //console.log("check password");
       done(null, user);
       return
     } else {
       return done(null, false, {message: 'passwords do not match'});
     }


  }).clone();
 //end of client check

 }


}));
// end of user passport auth








//serialize
passport.serializeUser(function(user, done) {
  return done(null, user.id);
 });
 
 //deserialize
 passport.deserializeUser( async function(id, done) {
 
  let admin = await Admin.findOne({ _id: id }, async function(err, user){
    //console.log(user);
      if (err)  return done(err);
    }).clone().catch(err => console.log(err));
 
  //for admin
  if(admin){
    try{
  await Admin.findById(id, function(err, user) {
  done(err, user);
  return
 }).clone();
 } catch(err){
  console.log(err);
 };
  //end of if of for admi
 } else {
  //for user
  try{
   await User.findById(id, function(err, user) {
  done(err, user);
  return
 }).clone()
 } catch(err){
  console.log(err)
 };
 //end of for user
 }
 
 
 });


}


module.exports = initialize;

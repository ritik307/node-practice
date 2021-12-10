const bcrypt = require("bcryptjs"); //? used to hash password before saving it in the database
const nodemailer = require("nodemailer"); //? makes sending emails from inside nodejs easy
const sendgridTransport = require("nodemailer-sendgrid-transport"); //? helps integrating sendgrid and convinently use that together with nodemailer

const User = require("../models/user");

//? transporter is a setup telling nodemailer how the emails will be delivered bcz nodejs wont do this on its own we need 3rd party service for that
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:"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"
  }
}));

exports.getLogin = (req, res, next) => {
  //? to print the cookies
  // const isLoggedIn=req.get("Cookie").split(";")[4].trim().split('=')[1];
  let message = req.flash("error");
  if(message.length>0){
    message=message[0];
  }
  else{
    message=null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    // isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if(message.length>0){
    message=message[0];
  }
  else{
    message=null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
  });
};


exports.postLogin = (req, res, next) => {
  {
    //! req.isLoggedIn = true;
    //? we have updated isLoggedIn here BUT the req is done once we are done with the postLogin
    //? req.isLoggedIn data does not stick around the data is lost after the req as the redirection created a
    //? brand new req.
    //? Generally we have 100s of user and their request is not related to each other,otherwise they could look into the
    //? data of other user they are not related to.
    //? IMP:- req made from same IP Addr. are also considered as an independent req. AND this is a good thing
    //? the user middleware in app.js worked for every route and req bcz every route pass through that middleware
    //? SOLUTION:-
    //! We cant use global var. since that var would be shared across all req BUT it would also be shared across all users.
    //? with COOKIES[to make cross request data storage] we can store data in the browser of a single user and store data in that browser which is
    //? customized to that user which does not affect all the other users but can be sent with the request to tell us "hey I already"
    //? am authenticated.
    //? Disadvantage of cookies is that they are not secure as user at cleint side can change the cookie val. to fix this we use session
    //? (name of the header, value of the header{key-value pair;key-value},)
    //? HttpOnly: true means that the cookie is only accessible by the server as it protects us from cross site scripting attacks.
    //? now your client side JS where some colud enject malicious code cant read the cookie values
    //! res.setHeader('Set-Cookie', 'isLoggedIn=true; HttpOnly;');
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email}).then((user)=>{
    if(!user){
      //? flash message are in the form of key:value pair 
      req.flash("error","Invalid email or password");
      return res.redirect("/login");
    }
    bcrypt.compare(password,user.password)
      .then((doMatch)=>{
        if(doMatch){
          //? creating a new User object from "Model" so that we can use its function in our app.
          req.session.user = user;
          //? making session cookie for the user req.session.__anyname__=value
          req.session.isLoggedIn = true;
          //? req.session.save() : as the data takes time to update in MongoDb session so there may arise a
          //? situation when the page is rendered BUT the data isnt updated as page render indepedent of MongoDb session
          //? so we have to use req.session.save() to update the data in MongoDb session AND then fire the redirect command   
          return req.session.save((err) => {
            console.log("SESSION SAVED SUCCESSFULLY");
            res.redirect("/");
          });
        }
        req.flash("error","Invalid email or password");
        res.redirect("/login");
      })
  })
  User.findById("61a77038026b637f2ec12aab")
    .then((user) => {
      
    })
    .catch((err) => {
      console.log("ERROR WHILE FINDING THE USER");
    });
};

exports.postSignup = (req, res, next) => {
  const email=req.body.email;
  const password=req.body.password;
  const confirmPassword=req.body.confirmPassword;
  User.findOne({email:email})
    .then((userDoc)=>{
      if(userDoc){
        req.flash("error","Email already exists");
        return res.redirect("/signup");
      }
      return bcrypt.hash(password,12)//? hashed password cant be dcrypted by anyone not even by bcrypt itself
        .then((hashedPassword)=>{
          const user=new User({
            email:email,
            password:hashedPassword,
            cart:{items:[]}
          });
          return user.save();
        })
        .then((results)=>{
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "ritikpr307@gmail.com",
            subject:"Signup succeeded!",
            html: "<h1>Finally!! ho gaya signup</h1>"
          });
        })
        .catch((err)=>{
          console.log("ERROR WHILE SENDING EMAIL");
          console.log(err);
        })
    })
    .catch((err)=>{
      console.log("ERROR WHILE SIGNING THE USER");
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

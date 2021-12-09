const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //? to print the cookies
  // const isLoggedIn=req.get("Cookie").split(";")[4].trim().split('=')[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
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

  User.findById("61a77038026b637f2ec12aab")
    .then((user) => {
      //? creating a new User object from "Model" so that we can use its function in our app.
      req.session.user = user;
      //? making session cookie for the user req.session.__anyname__=value
      req.session.isLoggedIn = true;
      //? req.session.save() : as the data takes time to update in MongoDb session so there may arise a
      //? situation when the page is rendered BUT the data isnt updated as page render indepedent of MongoDb session
      //? so we have to use req.session.save() to update the data in MongoDb session AND then fire the redirect command   
      req.session.save((err) => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log("ERROR WHILE FINDING THE USER");
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

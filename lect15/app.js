//! LECTURE 15

const path = require("path");

const express = require("express"); //returns a function
//? body-parser is used to parse the incoming request body to fetch data from it bcz req doesnt try to
//? parse the body by default.
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session"); //? package to handle session
const MongoDBStore = require("connect-mongodb-session")(session); //? package to store your session in mongodb

const csrf=require("csurf"); //? package to handle csrf(Cross-Site Request Forgery)

const flash =require("connect-flash"); //? The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user.

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = "mongodb+srv://ritik307:ritik307@nodepractice.mxrgy.mongodb.net/myFirstDatabase";

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions", //? collection name where the session is stored in DB
});

//? Initialising csrfProtection middleware
const csrfProtection = csrf();

//? registering VIEW ENGINE
//? "view engine" is a reserved configuration key understood by expressjs
app.set("view engine", "ejs"); //? what view engine should express be using eg(pugs,handlebars).
app.set("views", "views"); //? in which folser should express look for views.

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//? use("/path",(req,res,next)=>{}) - allow us to add a new middleware func.
//? next()- is a funcn passed by expressJS to travel to another middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //? for static imports(ONLY FOR READING PURPOSE) like css from a folder i.e. public(could name anything)
{
  //? we execute sessionas a func. in which we pass a JS object to configure session
  //?  secret- is a random string used to signing the hash which secretely stores out id in cookie[at client side]
  //? resave- if true, session will be saved even if there is no change in session data [set to false to improve performance]
  //? saveUninitialized- if true, session will be saved even if there is no change in session data [set to false to improve performance]
  //? cookie- is a JS object which contains the configuration of cookie
  //? store- is a JS object which contains the configuration of store
}
app.use(
  session({
    secret: "samberdosa",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: store
  })
);

//? ALWAYING USE CSRF POTECTION MIDDLEWARE AFTER INITIALIZING SESSION
//? for any NON-GET request this package will look for csrf token in the request body under the key _csrf 
app.use(csrfProtection);

//? ALWAYS USE connect-flash AFTER INITIALIZING SESSION
app.use(flash());

{
  //? adding a new middleware func. to add user to the req object so that we can use it from anywhere in our app
  //? NOTE: - app.use will only execute for incoming requests.It will not execture before sequelize.sync() as npm start runs
  //? sequalize.sync() not the incoming request.Incoming request are funnled through middleware.
}
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      //? creating a new User object from "Model" so that we can use its function in our app.
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("ERROR WHILE FINDING THE USER");
    });
});

//? Adding middleware to add csrfToken and isAuthenticated session token to the res.locals object
app.use((req,res,next)=>{
  //? res.locals is a JS object which is available to all the views which are rendered by express.
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})


app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);
//? middleware to catch any route that doesnt match the above routes
// app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000, () => console.log("Server running"));
  })
  .catch((err) => {
    console.log("ERROR WHILE CONNECTING TO THE DATABASE");
  });

/* //? Vanilla Nodejs way of making server
const server = http.createServer(app);
server.listen(3000);
*/

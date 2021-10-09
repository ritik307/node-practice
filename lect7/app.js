//! LECTURE 7

const path=require("path");

const express = require("express"); //returns a function
//? body-parser is used to parse the incoming request body to fetch data from it bcz req doesnt try to
//? parse the body by default. 
const bodyParser = require("body-parser");

const errorController = require('./controllers/error');

const app=express();

//? registering VIEW ENGINE 
//? "view engine" is a reserved configuration key understood by expressjs
app.set("view engine","ejs"); //? what view engine should express be using eg(pugs,handlebars).
app.set("views","views"); //? in which folser should express look for views.

const adminData=require("./routes/admin");
const shopRoutes=require("./routes/shop");

//? use("/path",(req,res,next)=>{}) - allow us to add a new middleware func.
//? next()- is a funcn passed by expressJS to travel to another middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"public"))); //? for static imports(ONLY FOR READING PURPOSE) like css from a folder i.e. public(could name anything)

app.use('/admin',adminData.routes);
app.use(shopRoutes);

//? middleware to catch any route that doesnt match the above routes 
app.use(errorController.get404);

/* //? Vanilla Nodejs way of making server
const server = http.createServer(app);
server.listen(3000);
*/

//? expressJS way of creating the server [does the same thing]
app.listen(3000,()=>{
    console.log("server is booting");
});

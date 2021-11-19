//! LECTURE 12

const path=require("path");

const express = require("express"); //returns a function
//? body-parser is used to parse the incoming request body to fetch data from it bcz req doesnt try to
//? parse the body by default. 
const bodyParser = require("body-parser");

const errorController = require('./controllers/error');
const mongoConnect = require("./util/database").mongoConnect;

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


//? adding a new middleware func. to add user to the req object so that we can use it from anywhere in our app
//? NOTE: - app.use will only execute for incoming requests.It will not execture before sequelize.sync() as npm start runs 
//? sequalize.sync() not the incoming request.Incoming request are funnled through middleware.
app.use((req,res,next)=>{
    // User.findByPk(1)
    // .then(user=>{
    //     //?adding a new field to our existing req object
    //     //? the user here is not just a JS object but it is a sequelize object with values stored in the database and with all the 
    //     //? utility methods like destroy(). So now when we call the req.user in our app we can also execute method like destroy(). 
    //     req.user=user;
    //     next();
    // })
    // .catch(err=>{
    //     console.log("error while adding user to req");
    // });
    next();
})


app.use('/admin',adminData.routes);
app.use(shopRoutes);

//? middleware to catch any route that doesnt match the above routes 
app.use(errorController.get404);

mongoConnect(()=>{
    app.listen(3000)
        // .then(()=>{
        //     console.log("SERVER CONNECTED SUCCESSFULLY");
        // })
        // .catch((err)=>{
        //     console.log("ERROR WHILE STARTING THE DB");
        // });
});


/* //? Vanilla Nodejs way of making server
const server = http.createServer(app);
server.listen(3000);
*/
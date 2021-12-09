//! LECTURE 11

const path=require("path");

const express = require("express"); //returns a function
//? body-parser is used to parse the incoming request body to fetch data from it bcz req doesnt try to
//? parse the body by default. 
const bodyParser = require("body-parser");

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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
    User.findByPk(1)
    .then(user=>{
        //?adding a new field to our existing req object
        //? the user here is not just a JS object but it is a sequelize object with values stored in the database and with all the 
        //? utility methods like destroy(). So now when we call the req.user in our app we can also execute method like destroy(). 
        req.user=user;
        next();
    })
    .catch(err=>{
        console.log("error while adding user to req");
    });
})


app.use('/admin',adminData.routes);
app.use(shopRoutes);

//? middleware to catch any route that doesnt match the above routes 
app.use(errorController.get404);



//? PERFORMING ASSOCIATION [https://sequelize.org/master/manual/assocs.html]
//? Below User means the user who created the product aka the ADMIN
//? onDelete: "CASCADE" - means if the user is deleted, all the products created by him will be deleted as well.
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
//? Blow is same as the above line.
User.hasMany(Product);
//? Now the sequelize will not only create tables for our models but also create the associations[define relations between models]
//?---------------------------------------------------------------------------------------------------------------------
//? ONE TO ONE RELATIONSHIP
User.hasOne(Cart);
Cart.belongsTo(User);
//?---------------------------------------------------------------------------------------------------------------------
//? MANY TO MANY RELATIONSHIP
//? through => tell sequelize where these conections should be stored ie "CartItem" model
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
//?
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });



//? sync is a method of sequelize that will create the table IF NOT EXIST in the db
//? it syncs your model in the db by the appropriate tables
//? sync({force:true}) - will drop the table and recreate it.
sequelize.sync()
    .then((result)=>{
        //? creating new dummy user if it dosent exist alreay
        return User.findByPk(1);
        
    })
    .then(user=>{
        if(!user){
            console.log("User created successfully");
            return User.create({name:"ritik",email:"ritik@gmail.com"});
        }
        //? there is no need wrap the user inside Promise.resolve(user) bcz if the return the value in the event block it is
        //? automatically wrapped in a new promise.
        return user;
    })
    .then(user=>{
        return user.createCart();
    })
    .then(cart=>{
        app.listen(3000,()=>{
            console.log("server is booting");
        })
    })
    .catch((err)=>{
        console.log("ERROR WHILE CREATING USER/CART");
    })


/* //? Vanilla Nodejs way of making server
const server = http.createServer(app);
server.listen(3000);
*/
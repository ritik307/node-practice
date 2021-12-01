//! LECTURE 5

const path=require("path");

const express = require("express"); //returns a function
//? body-parser is used to parse the incoming request body to fetch data from it bcz req doesnt try to
//? parse the body by default. 
const bodyParser = require("body-parser");

const app=express();

const adminRoutes=require("./routes/admin");
const shopRoutes=require("./routes/shop");

//? use("/path",(req,res,next)=>{}) - allow us to add a new middleware func.
//? next()- is a funcn passed by expressJS to travel to another middleware
app.use(bodyParser.urlencoded({extended: false})); //? we didnt use next() here bcz the function"urlencoded()" itself is calling the next() inside it
app.use(express.static(path.join(__dirname,"public"))); //for static imports like css from a folder i.e. public(could name anything)

app.use('/admin',adminRoutes);
app.use(shopRoutes);

//?middleware to catch any route that doesnt match the above routes 
app.use((req,res,next)=>{
    //? ""path.join(__dirname..."" is used to remove the inconsistency of accessing files from linux os or windows os as they both have
    //? diff. way of accessing file linux(/) windows(\).
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});

/* //? Vanilla Nodejs way of making server
const server = http.createServer(app);
server.listen(3000);
*/

//? expressJS way of creating the server [does the same thing]
app.listen(3000,()=>{
    console.log("server is booting");
});

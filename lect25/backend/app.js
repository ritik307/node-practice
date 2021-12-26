//! LECTURE 25

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const mongoose = require('mongoose');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images",express.static(path.join(__dirname,"images")));


//? setHeader => to add header to response . it DOES NOT send the data , it only modify and add header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //? to allow domains to access our server, *(wildcard) means all , we can also specify the domain name like google.com,codepen.com
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); //? which origin methods are allowed to access the server
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //? to allow clients to send req that hoild extra auth data in header and also define the content type of the header 
    next();
});

app.use('/feed', feedRoutes);

//? General error handler
app.use((error, req, res, next) => {
    console.log("ERROR: ", error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
})

mongoose.connect("mongodb+srv://ritik307:ritik307@nodepractice.mxrgy.mongodb.net/messages").then(()=>{
    app.listen(8080,()=>{
        console.log('Server started at port 8080');
    });
}).catch(err => {
    console.log("Error in connecting to database");
})

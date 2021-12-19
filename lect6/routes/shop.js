const path=require("path");

const express=require("express");

const rootDir=require("../util/path");
const adminData= require("./admin");
const { appendFile } = require("fs");

const router = express.Router();

router.get('/',(req,res,next)=>{
    const products=adminData.products;
    res.render("shop",{
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    })    
});

module.exports=router;




------------------------------------
 user={
     name:"",
     age:"",
     rollno:"",
 }

app.get("/",(req,res,next)=>{
    res.render("/home");
})
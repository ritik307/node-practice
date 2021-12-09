const path = require("path");

const express = require("express");
//? since we are not in the root dir 
const rootDir = require("../util/path");


//? router() is like a mini express app tied to our other express app OR pluggable into other express app
//? which we can export here 
const router = express.Router();
const products=[];
//? get() is same as use but it will only work with GET request AND get() perform EXACT MATHCING of routes unlike use
router.get("/add-product",(req,res,next)=>{
    res.render("add-product",{
        pageTitle:"Add Product",
        path:"/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
});
//? post() is same as use but it will only work with POST request AND pst() perform EXACT MATHCING of routes unlike use
router.post("/add-product",(req,res,next)=>{
    products.push({title: req.body.title});
    console.log(req.body);
    res.redirect("/");
});

// module.exports=router;
exports.routes=router;
exports.products=products;
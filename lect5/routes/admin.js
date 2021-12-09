const path = require("path");

const express = require("express");
//? since we are not in the root dir 
const rootDir = require("../util/path");


//? router() is like a mini express app tied to our other express app OR pluggable into other express app
//? which we can export here 
const router = express.Router();

//? get() is same as use but it will only work with GET request AND get() perform EXACT MATHCING of routes unlike use
router.get("/add-product",(req,res,next)=>{
    res.sendFile(path.join(rootDir,"views","add-product.html"));
});
//? post() is same as use but it will only work with POST request AND pst() perform EXACT MATHCING of routes unlike use
router.post("/add-product",(req,res,next)=>{
    console.log(req.body);
    res.redirect("/");
});

module.exports=router;
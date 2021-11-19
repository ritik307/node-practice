const path = require("path");

const express = require("express");
//? since we are not in the root dir 
const rootDir = require("../util/path");

const adminController = require("../controllers/admin");

//? router() is like a mini express app tied to our other express app OR pluggable into other express app
//? which we can export here 
const router = express.Router();

//? get() is same as use but it will only work with GET request AND get() perform EXACT MATHCING of routes unlike use
router.get("/add-product",adminController.getAddProduct);

// router.get("/products",adminController.getProducts);

//? post() is same as use but it will only work with POST request AND pst() perform EXACT MATHCING of routes unlike use
router.post("/add-product",adminController.postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post("/delete-product",adminController.postDeleteProduct);
// module.exports=router;
exports.routes=router;

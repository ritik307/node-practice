const path = require("path");

const express = require("express");
//? since we are not in the root dir 
const rootDir = require("../util/path");
//? middleware to check if the user is logged in
const isAuth = require('../middleware/is_auth');
const adminController = require("../controllers/admin");

//? router() is like a mini express app tied to our other express app OR pluggable into other express app
//? which we can export here 
const router = express.Router();

//? get() is same as use but it will only work with GET request AND get() perform EXACT MATHCING of routes unlike use
router.get("/add-product",isAuth,adminController.getAddProduct);

router.get("/products",isAuth,adminController.getProducts);

//? post() is same as use but it will only work with POST request AND pst() perform EXACT MATHCING of routes unlike use
router.post("/add-product",isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',isAuth, adminController.postEditProduct);

router.post("/delete-product",isAuth,adminController.postDeleteProduct);
// module.exports=router;
exports.routes=router;

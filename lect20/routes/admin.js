const path = require("path");

const express = require("express");
//? since we are not in the root dir 
const rootDir = require("../util/path");
//? middleware to check if the user is logged in
const isAuth = require('../middleware/is_auth');
const adminController = require("../controllers/admin");
const { body } = require("express-validator"); //? to validate the user inputs

//? router() is like a mini express app tied to our other express app OR pluggable into other express app
//? which we can export here 
const router = express.Router();

//? get() is same as use but it will only work with GET request AND get() perform EXACT MATHCING of routes unlike use
router.get("/add-product",isAuth,adminController.getAddProduct);

router.get("/products",isAuth,adminController.getProducts);

//? post() is same as use but it will only work with POST request AND pst() perform EXACT MATHCING of routes unlike use
router.post(
    "/add-product",
    [
        body("title","Title is required")
            .isString()
            .isLength({ min: 2 })
            .trim(),
        body("price","Price must be a number")
            .isNumeric(),
        body("description", "Description is required and must be at least 5 to 400 characters long")
            .isLength({ min: 5, max: 400 })
            .trim()           
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post(
    '/edit-product',
    [
        body("title","Title must be at least 2 characters long and alphanumeric")
            .isString()
            .isLength({ min: 2 })
            .trim(),
        body("price","Please enter a valid price")
            .isNumeric(),
        body("description","Description must be at least 5 to 400 characters long")
            .isLength({ min: 5, max: 400 })
            .trim()           
    ],
    isAuth, 
    adminController.postEditProduct
);

router.post("/delete-product",isAuth,adminController.postDeleteProduct);
// module.exports=router;
exports.routes=router;

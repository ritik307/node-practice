const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check,body } = require("express-validator"); //? to validate the user inputs

const User = require("../models/user");//? MongoDB modal
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login",
    [
        body("email").isEmail().withMessage("Please enter a valid email address").trim().normalizeEmail(),
        body("password","Incorrect Password").isLength({min:5}).isAlphanumeric().trim()
    ] ,
    authController.postLogin
);


router.post(
  "/signup",
  //? to validate the user inputs
  [
    //? check will check for the value in body and params
    check("email").isEmail().withMessage("Please enter a valid Email").custom((value,{req})=>{
        //? Perform an asynchronous operation - database call, external API call etc. Express-validation 
        //? will wait for the MongoDB to respond
        return User.findOne({email:value})
            .then((userDoc)=>{
            if(userDoc){
                return Promise.reject("Email already exists,Pick different email");
            }
        })
    })
    .trim().normalizeEmail(),
    //? body will only check for value in body
    body(
      "password",
      "Please enter ONLY alphanumeric password with length greater that 4" //? another way of passing error message
    )
      .isLength({ min: 4 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error("Confirm Password and Password should be same");
        }
        return true;
    })
    
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;

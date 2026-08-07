const express=require("express");
const router=express.Router();
const {registerUser}=require("../controllers/usercontrollers.js");

//router.route('/').post(loginUser)
router.route('/login').post(registerUser)

module.exports=router;

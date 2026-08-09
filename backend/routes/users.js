const express=require("express");
const router=express.Router();
const {protect}=require("../middleware/authmiddleware.js");
const {registerUser}=require("../controllers/usercontrollers.js");
const {loginUser}=require("../controllers/usercontrollers.js");
const {allUsers}=require("../controllers/usercontrollers.js");

router.route('/login').post(loginUser)
router.route('/').post(registerUser).get(protect,allUsers);//should go through protect middleware to get all users

module.exports=router;

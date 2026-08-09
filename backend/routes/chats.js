const express=require("express");
const {protect}=require("../middleware/authmiddleware.js");
const {accessChats, fetchChats, renameGroupChat, removeUserFromGroup, addUserToGroup, createGroupChat}=require("../controllers/newcontroller.js");
const router=express.Router();


router.route("/").post(protect,accessChats);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").put(protect,renameGroupChat);
router.route("/groupremove").put(protect,removeUserFromGroup);
router.route("/groupadd").put(protect,addUserToGroup);

module.exports=router;
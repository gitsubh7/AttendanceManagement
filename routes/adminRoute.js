const express=require("express")
const adminController = require("../controllers/adminController.js");
const router=express.Router();
router.get("/:adminId",adminController.getAdminById);
module.exports=router;  
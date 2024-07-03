const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController.js');


router.post("/register",userController.createUser);
router.get("/:userId",userController.getUserByID);
router.put("/:userId",userController.updateUser);
router.delete("/:userId",userController.deleteUser);


module.exports=router;

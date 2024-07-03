const express=require('express')    
const classroomController=require("../controllers/classroomController.js")
const router=express.Router();


router.get("/professorId/classrooms",classroomController.getAllClassrooms)
router.get("/:classroomId",classroomController.getClassroomById)


module.exports=router
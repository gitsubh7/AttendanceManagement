const express=require("express")
const router=express.Router()
const studentController=require("../controllers/studentController.js")


router.post("/register",studentController.createStudent)
router.get("/:studentId",studentController.getStudentById)
router.get("/:studentId/classrooms",studentController.getAllClassrooms)
router.put("/:studentId",studentController.updateStudent)
router.put("/:studentId/classroom/",studentController.concatClassroomId)
router.delete("/:studentId",studentController.deleteStudent)

module.exports=router;
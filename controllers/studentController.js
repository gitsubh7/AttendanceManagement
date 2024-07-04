const express = require("express");
const pool = require("../helpers/database");
const fs = require("fs").promises;
const splitFunction=require("../middleware/splitFunction")
const filePath = "./helpers/student.sql";
let tableCreated = false;
const createStudent= async(req,res)=>{
    try{
        const {studentId,name,department,section,mergedClassroomID}=req.body;
        const tableExists=await pool.query("SHOW TABLES LIKE ?",["students"])
        if(!tableExists.length){
            const createTableQuery=await fs.readFile(filePath,"utf-8")
            await pool.query(createTableQuery)
        }
        const insertQuery="INSERT INTO students (studentId,name,department,section,mergedClassroomID) VALUES (?,?,?,?,?)"
        const result=await pool.query(insertQuery,[studentId,name,department,section,mergedClassroomID])
        res
        .status(201)
        .json({
            message:"Student created successfully",
        })
    }
    catch(error){
        console.error("Error in createStudent",error);
        res
        .status(500)
        .json({
            error:"Internal Server Error"
        })
    }
}

const getStudentById = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!studentId || typeof studentId !== "string") {
            return res.status(400).json({
                error: "Invalid studentId",
            });
        }

        const sqlQuery = "SELECT * FROM students WHERE studentId = ?";
        const [rows] = await pool.query(sqlQuery, [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Student not found",
            });
        }

        // Send the student data as response
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error in getStudentById", error);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};


const updateStudent=async(req,res)=>{
    try{
        const {studentId}=req.params;
        const {name,department,section,mergedClassroomID}=req.body;
        if(!studentId || typeof studentId!=="string"){
            return res
            .status(400)
            .json({
                error:"Invalid studentId"
            })
        }
        const updateQuery="UPDATE students SET name=?,department=?,section=?,mergedClassroomID=? WHERE studentId=?"
        const result=await pool.query(updateQuery,[name,department,section,mergedClassroomID,studentId])
        if(result.affectedRows===0){
            return res.status(404).json({
                error:"Student Not Found"
            })
        }
        res.status(200).json({
            message:"Student updated successfully"
        })
    }
    catch(error){
        console.error("Error in updateStudent",error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

const deleteStudent=async(req,res)=>{
    try{
        const {studentId}=req.params;
        if(!studentId || typeof studentId!=="string"){
            return res.status(400).json({
                error:"Invalid studentId"
            })
        }
        const deleteQuery="DELETE FROM students WHERE studentId=?"
        const result=await pool.query(deleteQuery,[studentId])
        if(result.affectedRows===0){
            return res.status(404).json({
                error:"Student Not Found"
            })
        }
        res.status(200).json({
            message:"Student deleted successfully"
        })
    }
    catch(error){
        console.error("Error in deleteStudent",error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}


const getAllClassrooms=async(req,res)=>{
    try{
        const {studentId}= req.params;
        const sqlQuery="SELECT mergedClassroomID FROM students WHERE studentId=?"
        const rows=await pool.query(sqlQuery,[studentId])
        if(!rows.length){
            return res.status(404).json({
                error:"Student not found"
            })
        }
        const mergedClassroomID=rows[0].mergedClassroomID;
        const getAllClassrooms=splitFunction(mergedClassroomID,5);
    }
    catch(error){
        console.error("Error in getAllClassrooms",error)
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}
const concatClassroomId=async(req,res)=>{
    try{
        let professorCode=req.body.professorCode;
        let studentId=req.params.studentId;
        let sqlQuery="SELECT department, section,mergedClassroomId FROM students WHERE studentId=?"
        let getSqlResponse =await pool.query(sqlQuery,[studentId])
        let firstElement=getSqlResponse[0]
        let mergedClassroomId=firstElement.mergedClassroomId
        let dept=firstElement.department[0]+firstElement.department[1]
        let section = firstElement.section
        if(mergedClassroomId.length==25){
            return res
            .status(403).json({
                error:"Student is already in 5 classrooms"
            })
        }
        mergedClassroomId=mergedClassroomId+dept+section+professorCode
        let updateQuery="UPDATE students SET mergedClassroomId=? WHERE studentId=?"
        const result=await pool.query(updateQuery,[mergedClassroomId,studentId])
        if(result.affectedRows===0){
            return res.status(404).json({
                error:"Student Not Found"
            })
        }
        res.status(200).json({
            message:"Student updated successfully"
        })
    }
    catch(error){
        console.error("Error in concatClassroomId",error)
        res.status(500).json({
            error:"Internal Server Error"
        })

    }
}
module.exports={
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
    getAllClassrooms,
    concatClassroomId
}
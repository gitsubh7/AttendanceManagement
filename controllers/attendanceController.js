const pool= require("../helpers/database")
const fs=require("fs").promises
const filePath="./helpers/attendance.sql"
let tableCreated=false;

const createStudentAttendance= async(req,res)=>{
    try{
        const studentID=req.params.studentID;
        const SubjectCode=req.params.SubjectCode;
        const tableExists=await pool.query("SHOW TABLES LIKE ?",['Attendance'])
        if(!tableExists.length){
            const createTableQuery=await fs.readFile(filePath,"utf-8")
            await pool.query(createTableQuery)

        }
        console.log(req.params)
        const studentExists = await pool.query("SELECT * FROM students where studentID=?",[studentID])
        const courseExists = await pool.query("SELECT * FROM course where studentID=?",[SubjectCode])

        if(!studentExists.length || !courseExists.length){
            return  res.status(400).json({
                message:"Invalid student ID or subject code"
            })
        }
        const insertQuery="INSERT INTO Attendance (studentID,SubjectCode, AttendanceCount,TotalClasses) VALUES (?,?,?,?)"
        await pool.query(insertQuery,[studentID,SubjectCode,0,0])
        res.status(201).json({
            message:"Attendance Marked Succesfully"
        })
    }
    catch(error){
        console.log("Error in createStudentAttendance",error);
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}

const Present= async(req,res)=>{
    try{
        const studentID = req.params.studentID;
        const SubjectCode = req.params.SubjectCode;
        console.log(req.params);
        if(!studentID || typeof studentID!=="string"){
            return res.status(400).json({
                error:"Student ID Should be a string"
            })
        }
        if(!SubjectCode || typeof SubjectCode !=="string"){
            return res.status(400).json({
                error:"Subject Code should be a string"
            })

        }
        const updateQuery= "UPDATE Attendance SET AttendanceConunt = AttendanceCount+1 , TotalClasses=TotalClasses+1 WHERE studentID = ? AND SubjectCode= ?"
        const result = await pool.query(updateQuery,[studentID,SubjectCode])
        res.status(200).json({
            message:"Student Present"
        })

    }
    catch(error){
        console.log("Error in Present",error);
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}


const Absent = async (req, res) => {
    try{
      const studentID  = req.params.studentID;
      const SubjectCode = req.params.SubjectCode;
      console.log(req.params)
      if(!studentID || typeof studentID !== "string"){
        return res.status(400).json({ error: "Student ID should be a string" });
      }
      if(!SubjectCode || typeof SubjectCode !== "string"){
        return res.status(400).json({ error: "Subject Code should be a string" });
      }
      const updateQuery = "UPDATE Attendance SET TotalClasses = TotalClasses + 1 WHERE studentID = ? AND SubjectCode = ?";
      const result = await pool.query(updateQuery, [studentID, SubjectCode]);
      res.status(200).json({ message: "Student absent" });
    }
    catch(error){
      console.error("Error in Absent:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

const getAttendance= async(req,res)=>{
    try{
        const studentID = req.params.studentID;
        const SubjectCode = req.paras.SubjectCode;
        console.log(req.params);
        if(!studentID || typeof studentID !=="string"){
            return res.status(400).json({
                error:"Student ID should be a string"
            })
        }
        if(!SubjectCode || typeof SubjectCode !=="string"){
            return res.status(400).json({
                error:"Subject Code should be a string"
            })
        }
        const sqlQuery= "SELECT * FROM Attendance WHERE studentID= ? AND SubjectCode= ?"
        const rows= await pool.query(sqlQuery,[studentID,SubjectCode])
        if(rows.length===0){
            return res.status(404).json({
                error:"Attendance Not found"
            })
        }
    }
    catch(error){
        console.error("Error in getAttendance", error);
        res.status(500).json({
            error:"Internal Server Error"
        })
    }
}
module.exports={
    createStudentAttendance,
    Present,
    Absent,
    getAttendance
}


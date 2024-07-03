const pool=require('../helpers/database');
const splitFunction=require('../middleware/splitFunction');

const getAllClassrooms=async(req,res)=>{
    try{
        const professorId=req.params.professorId
        if(!professorId || typeof professorId !== 'string'){
            return res.status(400).json({
                error:"Professor Id is required in string"
            })
        }
        const sqlQuery="SECECT mergedClassroomId from admin WHERE professorId=?"
        const sqlResponse=await pool.query(sqlQuery,[professorId])
        if(sqlResponse.length===0){
            return res.status(404).json({
                error:"No classrooms found"
            })
        }
        let firstElement=sqlResponse[0];
        let mergedClassroomId=firstElement.mergedClassroomId;
        let AllClassrooms=splitFunction(mergedClassroomId,5);
        res.json({
            "Classrooms":AllClassrooms
        })

    }catch(error){
        console.log("error in get all classrooms",error);
        res.
        status(500).json({
            error:"Internal Server Error"
        })
    }


}

const getClassroomById= async(req,res)=>{
    try{
        const classroomId=req.params.classroomId;
        console.log("classroomId",classroomId);
        if(!classroomId || typeof classroomId !== 'string'){
            return res.status(400).json({
                error:"ClassroomId is required in string"
            })
        }
        const sqlQuery="SELECT * from classroom where classroomId=?"
        const sqlResponse=await pool.query(sqlQuery,[classroomId])
        if(sqlResponse.length===0){
            return res.status(404).json({
                error:"No classroom found"
            })
        }
        console.log("rows:",rows);
        res.json({
            classrooms:rows[0]
        })
    }
    catch(error){
        console.log("error in get classroom by id",error);
        res.status(500).json({
            error:"Internal Server Error"
        })
    
    }
}
module.exports={
    getAllClassrooms,
    getClassroomById
}
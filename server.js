const express=require('express')
const bodyParser=require('body-parser')
const dotenv= require("dotenv")
dotenv.config({path:".env"})
const PORT=process.env.PORT || 3000
const userroute=require("./routes/userRoute.js")
const studentroute=require("./routes/studentRoute.js")
const adminRoute=require("./routes/adminRoute.js")
// const classroute=require("./routes/classRoute.js")
const attendanceRoute=require("./routes/attendanceRoute.js")
const app=express();

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use("/user",userroute);
app.use("/student",studentroute);
// app.use("/classroom",classroute);
app.use("/admin",adminRoute)
app.use("/attendance",attendanceRoute)

app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})


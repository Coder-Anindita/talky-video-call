import dotenv from "dotenv"
dotenv.config() //Enviroment files setup
import express from "express"
import {createServer} from "node:http"
import mongoose from "mongoose"
import cors from "cors"//to allow conversation between frontend and backend
import connectToDB from "./db/connectToDB.js"
import connectToSocket from "./utils/connectToSocket.js"
import authRoutes from "./routes/authRoutes.route.js"
import cookieParser from "cookie-parser"
import checkAuth from "./controllers/authCheck.controller.js"
import authMiddleWare from "./utils/auth.middleware.js"
import saveMeetingHistory from "./controllers/saveMeetingHistory.controller.js"
import getMeetingHistory from "./controllers/getMeetingHistory.contoller.js"
//------------------------------All imports above it---------------------------------------------



const app=express() //This the express app
const server=createServer(app)//this is the http server
const io=connectToSocket(server)//this is to establish webSockets

app.use(cors({
    origin:"https://talkyfrontend.onrender.com",
    credentials:true
}))//to allow cross origin communication
app.use(express.json({limit:"40kb"})) //to limit the payload prevent malpractice
app.use(express.urlencoded({limit:"40Kb",extended:true}))
app.use(cookieParser());


const PORT=process.env.PORT || 8000
app.use("/api/v1/auth",authRoutes)
app.get("/api/v1/checkAuth",checkAuth)
app.post("/api/v1/savehistory",authMiddleWare,saveMeetingHistory)
app.get("/api/v1/history",authMiddleWare,getMeetingHistory)
connectToDB()
.then(()=>{
    server.listen(PORT,()=>{
        console.log(`Listening to port ${PORT}`)
    })
    
    
})
.catch((err)=>{
    console.error("DB connection failed", err);
})





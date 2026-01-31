import {User}  from "../models/user.model.js";
import status from "http-status";


const logout=async(req,res)=>{
    try{
        const currentToken=req.cookies.token
        if(!currentToken){
            return res.status(status.UNAUTHORIZED).json({message:"You are not authorized to logout"})
        }
        return res.status(status.OK)
        .clearCookie("token",{
            httpOnly:true,
            secure:false
        })
        .json({
            message:"Logged out successfully"
        })
        



    }
    catch(err){
        return res.status(status.INTERNAL_SERVER_ERROR).json({message:err.message})

    }

}
export default logout
import {User}  from "../models/user.model.js";
import status from "http-status";
import bcrypt from "bcrypt"
import generateToken from "../utils/generateToken.js";
const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email){
            return res.status(status.BAD_REQUEST).json({message:"Email is required"})
        }
        if(!password){
            return res.status(status.BAD_REQUEST).json({message:"Password is required"})
        }
        const existingUser=await User.findOne({email:email})
        if(!existingUser){
            return res.status(status.NOT_FOUND).json({message:"No user found"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect){
            return res.status(status.UNAUTHORIZED).json({message:"Invalid credentials"})
        }
        existingUser.password=undefined
        const token=generateToken(existingUser._id)
        
        return res.status(200)
        .cookie("token",token,{
            httpOnly:true,
            secure:true,
            
        })
        .json({message:"'Logged in successfully",user:existingUser})
        

    }
    catch(err){
        return res.status(status.INTERNAL_SERVER_ERROR).json({message:err.message})
        

    }
    

}
export default login
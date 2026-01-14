import { User } from "../models/user.model.js";
import status from "http-status";
import bcrypt from "bcrypt"
const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name){
            return res.status(status.BAD_REQUEST).json({
                message:"Name is required"
            })
        }
        if(!email){
            return res.status(status.BAD_REQUEST).json({
                message:"email is required"
            })
        }
        if(!password){
            return res.status(status.BAD_REQUEST).json({
                message:"password is required"
            })
        }
        const existingUser=await User.findOne({email:email})
        if(existingUser){
            return res.status(status.FOUND).json({
                message:"User already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)//I am hashing it here not using pre middleware 
        const newUser=await User.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        newUser.password=undefined
        return res.status(status.CREATED).json({
            message:"User created successfully",user:newUser
        })

    }
    catch(err){
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message:err.message
        })

    }

}
export default register
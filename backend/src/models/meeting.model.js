import mongoose from "mongoose"


const meetingSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    
    code:{
        type:String,
        required:true,
        
    },
    

},{timestamps:true})

export const Meeting=mongoose.model("Meeting",meetingSchema)
import mongoose from "mongoose"


const meetingSchema=new mongoose.Schema({
    owner:{
        type:mongoose.SchemaType.ObjectId,
        ref:"User",
        required:true,
    },
    Name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    }

},{timestamps:true})

export const Meeting=mongoose.model("Meeting",meetingSchema)
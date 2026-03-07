import { Meeting } from "../models/meeting.model.js"
import {status} from "http-status"
const saveMeetingHistory=async(req,res)=>{

    try{
        const {code}=req.body
        const userId=req.user.user_id
        console.log(req.user)
        const existing = await Meeting.findOne({user:userId,code})
        if(!existing){
            await Meeting.create({user:userId,code})
            
        }
        res.status(status.OK).json({success:true})

        
    }
    catch(e){
        res.status(status.INTERNAL_SERVER_ERROR).json({messae:"server error"})
    }


}
export default saveMeetingHistory
import { Meeting } from "../models/meeting.model"
import {status} from "http-status"
const saveMeetingHistory=async(req,res)=>{

    try{
        const {code}=req.body
        const userId=req.user.userId

        const meeting=await Meeting.create({
            
            code:code,
            user:userId
        })

        res.status(status.OK).json({success:true})
    }
    catch(e){
        res.status(status.INTERNAL_SERVER_ERROR).json({messae:"server error"})
    }


}
export default saveMeetingHistory
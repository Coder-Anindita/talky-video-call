import { Meeting } from "../models/meeting.model"
import {status} from "http-status"
const getMeetingHistory = async(req,res)=>{

    try{

        const userId = req.user.userId

        const meetings = await Meeting
        .find({user:userId})
        .sort({createdAt:-1})

        res.status(status.OK).json(meetings)

    }
    catch(err){
        res.status(500).json({message:"Server error"})
    }

}
export default getMeetingHistory
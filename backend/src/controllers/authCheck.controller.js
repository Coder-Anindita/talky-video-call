import jwt from "jsonwebtoken"
import status from "http-status";
const checkAuth=async(req,res)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(status.UNAUTHORIZED).json({auth:false})

    }
    try{
        let decoded=jwt.verify(token,process.env.JWT_SECRET)
        return res.status(status.OK).json({
            auth: true,
            userId: decoded.id
        });
    }
    catch(e){
        return res.status(status.UNAUTHORIZED).json({ auth: false });
    }

}
export default checkAuth
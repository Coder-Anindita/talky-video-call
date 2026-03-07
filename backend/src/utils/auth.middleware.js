import jwt from "jsonwebtoken"
const authMiddleWare=(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }


    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded   // attach user data to request

        next()

    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}
export default authMiddleWare
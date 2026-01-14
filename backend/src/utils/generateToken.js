import jwt from "jsonwebtoken"



const generateToken=(user_id)=>{
    const token=jwt.sign(user_id,process.env.JWT_SECRET,{
        expiresIn:"1d"
    })

}
export default generateToken
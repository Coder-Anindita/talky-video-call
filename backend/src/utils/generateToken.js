import jwt from "jsonwebtoken"



const generateToken=(user_id)=>{
    const token=jwt.sign({user_id:user_id},process.env.JWT_SECRET,{
        expiresIn:"20m"
    })
    return token

}
export default generateToken
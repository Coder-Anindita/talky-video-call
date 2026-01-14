import mongoose from "mongoose"
//connecting to database with the help of this function
const connectToDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        if(!connectionInstance){
            throw("error while connection")
        }
        console.log(`Connected to DB with host ${connectionInstance.connection.host}`)


    }
    catch(err){
        throw(err)
    }

}
export default connectToDB
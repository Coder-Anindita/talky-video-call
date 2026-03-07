import {useEffect,useState} from "react"
import {Navigate} from "react-router-dom"

import { useNavigate } from "react-router-dom";
const AuthGuard=({child})=>{
    const [loading,setLoading]=useState(true);
    const [auth,setAuth]=useState(false)

    

    useEffect(() => {

        const checkAuth = async () => {
            try{
                const res = await fetch("http://localhost:3000/api/v1/checkAuth",{
                    method:"GET",
                    credentials:"include"
                })

                const data = await res.json()

                if(data.auth){
                    setAuth(true)
                }
                else{
                    setAuth(false)
                }

            }catch(err){
                console.log(err)
            }

            setLoading(false)
        }

        checkAuth()

    },[])

    if(loading){
        return(
            <div><h2>Loading...........</h2></div>
        )
    }
    if(!auth){
        return <Navigate to="/login"/>
    }
    return child


}
export default AuthGuard
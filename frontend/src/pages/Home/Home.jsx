import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import HomeNavBar from './HomeNavBar';
import image from "../../assets/HomeImage.svg"
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast"
function Home() {
    let navigate=useNavigate();
    const [meetingCode,setMeetingCode]=useState("")
    
    let handleJoinVideoCall=async()=>{
        await addToHistory()
        navigate(`/${meetingCode}`)
        
    }
    let addToHistory=async()=>{
        try{
            let response=await fetch("http://localhost:3000/api/v1/savehistory",{
                 
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body: JSON.stringify({
                code: meetingCode
            })
                
            })
            const result=await response.json();
              
            if (!response.ok) {
                
                    
                
                
                return;
            }
            toast.success("Meeting stored in history!",{duration:4000})
            console.log("meeting stored");
        }
        catch(e){
            console.log(e)

        }
    }
    
  return (
    <div className='container-fluid '>
        <div className='row'>
            <HomeNavBar/>
        </div>
        <div className='row align-items-center px-5 mb-5'>
            <div className='col-lg-6 col-sm-12 px-5 pt-2 '>
                <img src={image}></img>
            </div>
            <div className='col-lg-6 col-sm-12 d-flex justify-content-center flex-column '>
                <h1 style={{ fontSize: "18px", fontWeight: "500" }} className="text-center pt-4">
                        Join video calls, share screens, and chat seamlessly with your team, friends, or classmates.
                    
                </h1>
                <div className=' col-12 d-flex justify-content-center flex-row mt-3'>
                    <TextField id="outlined-basic" label="Enter Meeting Code" variant="outlined" value={meetingCode} onChange={e=>setMeetingCode(e.target.value)} />
                        
                    <div className="d-flex justify-content-center ">
                            <button
                            type="submit"
                            className="text-center px-4 py-2 mx-4 rounded get-started"
                            onClick={handleJoinVideoCall}
                            >
                            Join
                            </button>
            
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default Home
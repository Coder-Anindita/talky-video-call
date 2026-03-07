import React from 'react'
import { useState,useEffect } from 'react'
import HomeNavBar from '../Home/HomeNavBar'
import toast from 'react-hot-toast'
import "../History/History.css"
import image from "../../assets/History.svg"
import server from '../../enviroment'
function History() {
    const [history,setHistory]=useState([])
    let getHistory=async()=>{
        try{
            let response=await fetch(`${server}/api/v1/history`,{
                method:"GET",
                
                credentials:"include",
                
            })
            const result=await response.json();
              
            if (!response.ok) {
                
                    
                
                
                return;
            }
            setHistory(result.history)
            
            
            console.log(history)
        }
        catch(e){
            console.log(e)

        }

    }

    useEffect(()=>{
        getHistory()
    },[])
  return (
    <div className='container-fluid'>
        <div className='row'>
            <HomeNavBar/>

        </div>
        <div className='row align-items-center px-5 mb-5'>
            <div className='col-sm-12 col-lg-6'>
                {history.length === 0 ? (
                <p className="text-center">No Meeting History</p>
                ) : (

                history.map((meeting)=>(
            
                <div key={meeting._id} className="container box ">

                    <div className="meeting ">

                        <h5 className='meeting-code'>Meeting Code:</h5>
                        <p>{meeting.code}</p>

                        <h6 className='meeting-date'>Date:</h6>
                        <p>
                            {new Date(meeting.createdAt).toLocaleString()}
                        </p>

                    </div>

                </div>

                ))

                )}
            </div>
            <div className='col-lg-6 col-sm-12 px-5  pt-2 '>
                <img src={image}></img>
                        
            </div>

            
        </div>
    </div>
  )
}

export default History
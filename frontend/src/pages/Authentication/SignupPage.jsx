import React from 'react'
import Navbar from '../LandingPage/Navbar'

import SideImage from "../../assets/Mobile login-pana.svg"
import SignupLogic from './SignupLogic'
function SignupPage() {
  return (
    <div className='container-fluid '>
        <div className='row'>
            <Navbar/>
        </div>
        <div className='row align-items-center px-5'>
            <div className='col-lg-6 col-sm-12 px-5 pt-2'>
                <img src={SideImage}></img>
            </div>
            <div className='col-lg-6 col-sm-12 d-flex justify-content-center shadow-lg rounded my-4'>
                <SignupLogic/>
            </div>
        </div>
    </div>
  )
}

export default SignupPage
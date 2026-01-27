import React from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'

function LandingPage() {
  return (
    <div className='container-fluid'>
        <div className='row'>
            <Navbar/>

        </div>
        <div className='row'>
          <HeroSection/>

        </div>
    </div>
  )
}

export default LandingPage
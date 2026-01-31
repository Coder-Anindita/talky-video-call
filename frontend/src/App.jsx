
import './App.css'
import {Routes,BrowserRouter,Route} from "react-router-dom"
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/Authentication/LoginPage'
import SignupPage from './pages/Authentication/SignupPage'
import VideoMeet from './pages/Video/VideoMeet'
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/:url' element={<VideoMeet/>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

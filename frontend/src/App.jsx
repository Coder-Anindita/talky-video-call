
import './App.css'
import {Routes,BrowserRouter,Route} from "react-router-dom"
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/Authentication/LoginPage'
import SignupPage from './pages/Authentication/SignupPage'
import VideoMeet from './pages/Video/VideoMeet'
import { Toaster } from "react-hot-toast"
import Home from './pages/Home/Home'
import History from './pages/History/History'
import AuthGuard from './utils/AuthGuard'
function App() {
  

  return (
    <>
      <BrowserRouter>
        <Toaster/>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/:url' element={<VideoMeet/>}/>
          <Route path='/home' element={<AuthGuard child={<Home/>}><Home/></AuthGuard>}/>
          <Route path='/history' element={<AuthGuard child={<History/>}><History/></AuthGuard>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App

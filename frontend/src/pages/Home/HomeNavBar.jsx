import logo from "../../assets/Talkylogo.jpg";
import { NavLink } from "react-router-dom";
import toast from 'react-hot-toast';
import server from "../../enviroment";
const HomeNavBar = () => {
    let handleOnLogout=async()=>{
            try{
            const response=await fetch(`${server}/api/v1/auth/logout`,{
                method:"POST",
                headers:{
                "Content-Type":"application/json",
                },
                credentials:"include",
                
            })
    
            const result=await response.json();
            if (!response.ok) {
            
                
                toast.error("OOPS! Try again",{duration:4000})
                return;
            }
            toast.success("Logged out in successfully!",{duration:4000})
            console.log("Logged out successfully");
            navigate("/login")
            
            
            
    
            
    
        }
        catch(e){
          
          toast.error("OOPS! Try again",{duration:5000})
    
        }
        }
  return (
    <div className="container-fluid border-bottom py-2">
      <div className="d-flex flex-column flex-lg-row align-items-center">

        
        <div className="me-lg-auto text-center text-lg-start">
          <img
            src={logo}
            alt="Talky Logo"
            style={{ width: "180px" }}
          />
        </div>

        
        <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-3 align-items-center mt-2 mt-lg-0 me-lg-4">
            <div className=" " ><NavLink to="/home" className={({isActive})=>`nav-link rounded ${
            isActive ? "active-nav-link" : ""
          }`} >Home</NavLink></div>
          <div className=" " onClick={handleOnLogout} ><NavLink to="/" className={({isActive})=>`nav-link rounded ${
            isActive ? "active-nav-link" : ""
          }`} >Logout</NavLink></div>
          <div className=" " ><NavLink to="/history" className={({isActive})=>`nav-link rounded ${
            isActive ? "active-nav-link" : ""
          }`} >History</NavLink></div>
          
          
        </div>

      </div>
    </div>
  );
};

export default HomeNavBar;
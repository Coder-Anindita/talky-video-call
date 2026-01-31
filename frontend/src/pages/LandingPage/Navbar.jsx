import logo from "../../assets/Talkylogo.jpg";
import { NavLink } from "react-router-dom";
const Navbar = () => {
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
          <div className=" " ><NavLink to="/" className={({isActive})=>`nav-link rounded ${
            isActive ? "active-nav-link" : ""
          }`} >Join as Guest</NavLink></div>
          <div className=" " ><NavLink to="/login" className={({isActive})=>`nav-link rounded ${
            isActive ? "active-nav-link" : ""
          }`} >Login</NavLink></div>
          <div className=" " ><NavLink to="/signup" className={({isActive})=>`nav-link rounded ${
            isActive ? "active-nav-link" : ""
          }`} >Signup</NavLink></div>
        </div>

      </div>
    </div>
  );
};

export default Navbar;


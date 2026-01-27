import logo from "../../assets/Talkylogo.jpg";

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

        
        <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-3 align-items-center mt-2 mt-lg-0 me-lg-4">
          <div className=" nav-link rounded" >Join as Guest</div>
          <div className=" nav-link rounded">Register</div>
          <div className=" nav-link rounded">Login</div>
        </div>

      </div>
    </div>
  );
};

export default Navbar;


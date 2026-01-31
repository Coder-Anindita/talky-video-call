import { useState } from "react";
import { NavLink } from "react-router-dom";

function Signup() {
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [serverError, setServerError] = useState("");
  const handleSubmit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (!form.checkValidity() || password !== confirmPassword) {
      event.preventDefault();
      event.stopPropagation();
      setPasswordMatch(false);
      //return;
    } else {
      setPasswordMatch(true);
    }

    setValidated(true);
    const data={name:username,password:password,email:email}

    try{
      const response=await fetch("http://localhost:3000/api/v1/auth/register",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        credentials:"include",
        body:JSON.stringify(data)
      })

      const result=await response.json();
      if (!response.ok) {
    
        setServerError(result.message || "Something went wrong");
        return;
      }

      console.log("Signed up successfully");
      setServerError("");
      setEmail("");
      setPassword("");
      setUsername("");
      

      

    }
    catch(e){
      setServerError("Server error. Please try again later.");

    }
    
    
  };

  return (
    <form
      noValidate
      className={`container p-4 m-4 shadow-md ${
        validated ? "was-validated" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <h4
        className="mb-3 text-center fs-2"
        style={{ color: "#28c52e" }}
      >
        Signup
      </h4>

      {/* Name */}
      <div className="mb-3">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Full Name"
          value={username}
          onChange={(e)=>{setUsername(e.target.value)}}
          required
        />
        <div className="invalid-feedback">
          Name is required.
        </div>
      </div>

      {/* Email */}
      <div className="mb-3">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          required
        />
        <div className="invalid-feedback">
          Please enter a valid email.
        </div>
      </div>

      {/* Password */}
      <div className="mb-3">
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
          required
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          minLength="6"
        />
        <div className="invalid-feedback">
          Password must be at least 6 characters.
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-3">
        <input
          type="password"
          name="confirmPassword"
          className={`form-control ${
            !passwordMatch ? "is-invalid" : ""
          }`}
          placeholder="Confirm Password"
          required
        />
        <div className="invalid-feedback">
          Passwords do not match.
        </div>
      </div>

      {serverError && (
        <div className="text-center py-1 pb-2" style={{color:"red"}}>
          {serverError}
        </div>
      )}
      <div className="d-flex justify-content-center">
        <button
          type="submit"
          className="text-center px-4 py-2 rounded get-started"
        >
          Signup
        </button>
        
      </div>
      <p className="text-center pt-1 text-muted">Already have an account? <NavLink to="/login" className="text-decoration-none">Login</NavLink></p>
      
    </form>
  );
}

export default Signup;

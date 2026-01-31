import { useState } from "react";
import { NavLink } from "react-router-dom";

function Login() {
    const [validated, setValidated] = useState(false);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
  const handleSubmit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      //return;
    }

    setValidated(true);
    const data={password:password,email:email}
    try{
        const response=await fetch("http://localhost:3000/api/v1/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",

            },
            credentials:"include",
            body:JSON.stringify(data)

        })
        const result=await response.json();
        if(response.ok){
            console.log("Logged in")
            setEmail("")
            setPassword("")
        }
        else{
            console.log("Error")
        }
    }
    catch(e){
        console.error("server error")

    }
    
  };

  return (
    <form
      noValidate
      className={`container p-4 m-4 shadow-md  ${validated ? "was-validated" : ""}`}
      onSubmit={handleSubmit}
    >
      <h4 className="mb-3 text-center fs-2" style={{color:"#28c52e"}}>Login</h4>

      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          name={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          required
        />
        <div className="invalid-feedback">
          Please enter a valid email.
        </div>
      </div>

      
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          required
          minLength="6"
          value={password}
          name="password"
          onChange={(e)=>{setPassword(e.target.value)}}
        />
        <div className="invalid-feedback">
          Password must be at least 6 characters.
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button type="submit"className="text-center px-4 py-2 rounded get-started" >
           Login         
        </button>
      </div>
      <p className="text-center pt-3">Don't have an account? <NavLink to="/signup" className="text-decoration-none ">signup</NavLink></p>
    </form>
  );
}

export default Login;

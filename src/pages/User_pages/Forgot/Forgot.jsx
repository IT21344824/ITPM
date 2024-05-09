import React from 'react'
import { useContext, useState } from "react";
import "./Forgot.scss";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const config ={
      //url:process.env.React_App_Register_url,
      continueUrl: 'https://example.com/reset-password',
      handleCodeInApp:true,
    };

    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmail("");
        
        console.log("ok");
        //setLoading(false)
        alert("An email has been sent to reset your password.");
      })
      .catch((error) => {
        //SsetLoading(false)
        console.log(error);
        setError(error.message);
      });
  };

  
  return (
    <div className='Fogotback'>
      <div className="forgot-password">
        <form className='Forgotform' onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <label htmlFor="email">Email</label>
          <input className='Forgotinput'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <span className="error-message">{error}</span>}
          <button  className='Forgotbtn' type="submit">Reset Password</button>
        </form>
      </div>
    </div>

  )
}

export default Forgot

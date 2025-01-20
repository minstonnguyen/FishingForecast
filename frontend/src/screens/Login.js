import React, { useState } from "react";
import '../styles/Login.css';
import axios from "axios";



const Login = () => {
  const [formData, setFormData] = useState({
      usernameOrEmail: "",
      password: ""
    });
    
  const [responseMessage, setResponseMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const isFilled = (value) => value !=="";

  const handleSignInSubmission = async(e) => {
    e.preventDefault();  

    if (!formData.usernameOrEmail || !formData.password)
    {
      setErrorMessage("Fill out all fields.");
      return;
    }
    
    try {
      const response = await fetch(process.env.REACT_APP_AWS_LAMDA_USER_SIGN_IN_API_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        
      }); 
      const responseData = await response.json();

      setResponseMessage(responseData + "Sign in succesfulSign in successful. Status code: ${response.status}");
      setErrorMessage(null);
      
    }
    catch(error){
      setErrorMessage("Error" + error.errorMessage);
    }
  }
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  return (
    <div className="form">
    
        <div className="title">Log In</div>
        <div className="subtitle"> Your Journey Awaits!</div>
        <div className="input-container ic4">
          <input type="text" placeholder="" id="usernameOrEmail" className="input" value={formData.usernameOrEmail} onChange={handleInputChange}/>
          <div className="cut cut-short"></div>
          <label htmlFor="usernameOrEmail" className={`iLabel ${isFilled(formData.usernameOrEmail) ? "hidden" : ""}`}>Username or Email</label>
        </div>

        <div className="input-container ic4">
          <input type="text" placeholder="" id="password" className="input" value={formData.password} onChange={handleInputChange}/>
          <div className="cut cut-short"></div>
          <label htmlFor="password" className={`iLabel ${isFilled(formData.password) ? "hidden" : ""}`}>Password</label>
        </div>


        <button className="submit" type="submit" onClick={handleSignInSubmission} >Sign In</button>

        <div>
          <p style={{color: "#08d"}}>{JSON.stringify(formData)}</p> {/* Display formData below the form */}
          {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    </div>
  );
};

export default Login;

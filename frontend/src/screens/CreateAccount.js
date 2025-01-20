import React, { useState } from "react";
import '../styles/CreateAccount.css';
import axios from "axios";

const CreateAccount = () => {
  
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });
  
  const [responseMessage, setResponseMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const isFilled = (value) => value !=="";
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };
  
  
  const isAFieldEmpty = (username, firstname, lastname, email, password) => {
    if (!username || !firstname || !lastname || !email || !password)
      {
        return true;
      }    
    else return false;
  }
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email))
    {
      return false;
    }
    return true;
  }
  const isPasswordValid = (password) => {
    if (password.length < 8) return false;
    else return true;
  }




  //Method that handles what happens when create account button is clicked.
  const handleSubmission = async (e)=> {

    e.preventDefault();  

    //check if creation fields are valid
    if (isAFieldEmpty(formData.username, formData.firstname, formData.lastname, formData.email, formData.password))
    {
      setErrorMessage("Fill out all fields.");
      setResponseMessage(null);
      return;
    }
    if (!isEmailValid(formData.email))
    {
      setErrorMessage("Invalid email address.");
      setResponseMessage(null);
      return;
    }
    if (!isPasswordValid(formData.password))
    {
      setErrorMessage("Password must be at least 8 characters long.");
      setResponseMessage(null);
      return;
    }


    //AWS API GATEWAY CALL
    try {
      
      const response = await fetch(process.env.REACT_APP_AWS_LAMDA_USER_INSERTION_API_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        
      }); 

      if (!response.ok) 
      {
        throw new Error(`HTTP error! status: ${response.status}`); //JSON Response error
      }

      const responseData = await response.json();

      setResponseMessage("Account Succesfully Created!");
      setErrorMessage(null);
    }             
    catch (error) {
      if (error.name === "TypeError") {
        // Likely a network error or CORS issue
        setErrorMessage(`Failure to create account: Network or CORS issue. Error Details: ${error.message}`);
        setResponseMessage(null);
      } else {
        setErrorMessage(`Failure to create account: ${error.message}. Error Details: ${JSON.stringify(error)}`);
        setResponseMessage(null);
      }
    }
  }
  
  return (
    
    <div className="form">
      
      <div className="title">Welcome</div>
      <div className="subtitle">Let's create your account!</div>
      <form onSubmit={handleSubmission}>
        <div className="input-container ic1">
          <input type="text" placeholder="" id="username" className="input" value = {formData.username} onChange={handleInputChange}/>
          <div className="cut"></div>
          <label htmlFor="username" className={`iLabel ${isFilled(formData.username) ? "hidden" : ""}`}>Username</label>
        </div>
        
        <div className="input-container ic2">
          <input type="text" placeholder="" id="firstname" className="input" value={formData.firstname} onChange={handleInputChange}/>
          <div className="cut"></div>
          <label htmlFor="firstname" className={`iLabel ${isFilled(formData.firstname) ? "hidden" : ""}`}>First name</label>
        </div>

        <div className="input-container ic3">
          <input type="text" placeholder="" id="lastname" className="input" value={formData.lastname} onChange={handleInputChange}/>
          <div className="cut"></div>
          <label htmlFor="lastname" className={`iLabel ${isFilled(formData.lastname) ? "hidden" : ""}`}>Last name</label>
        </div>

        <div className="input-container ic4">
          <input type="text" placeholder="" id="email" className="input" value={formData.email} onChange={handleInputChange}/>
          <div className="cut cut-short"></div>
          <label htmlFor="email" className={`iLabel ${isFilled(formData.email) ? "hidden" : ""}`}>Email</label>
        </div>
        
        <div className="input-container ic4">
          <input type="text" placeholder="" id="password" className="input" value={formData.password} onChange={handleInputChange}/>
          <div className="cut cut-short"></div>
          <label htmlFor="password" className={`iLabel ${isFilled(formData.password) ? "hidden" : ""}`}>Password</label>
        </div>

        <button className="submit" type="submit" >Create Account</button>
        
      </form>

      <div>
        
        {/*<p style={{color: "#08d"}}>{JSON.stringify(formData)}</p> {} */}
        {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>

    
    
  );


  
};


export default CreateAccount;

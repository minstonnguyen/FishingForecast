import React, { useState } from "react";
import '../styles/CreateAccount.css';

const CreateAccount = () => {
  console.log('hello world');
  const [username, setUsername] = useState(""); 
  const [firstname, setFirstName] = useState(""); 
  const [lastname, setLastName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState(null);
  const isFilled = (value) => value !=="";
  

  
  const handleSubmission = (e)=> {
    e.preventDefault();
    setFormData(`Username: ${username}, First Name: ${firstname}, Last Name: ${lastname}, Email: ${email}, Password: ${password}`);
  }
  
  return (
    
    <div className="form">
      
      <div className="title">Welcome</div>
      <div className="subtitle">Let's create your account!</div>
      <form onSubmit={handleSubmission}>
        <div className="input-container ic1">
          <input type="text" placeholder="" id="username" className="input" value = {username} onChange={(e) => setUsername(e.target.value)}/>
          <div className="cut"></div>
          <label htmlFor="username" className={`iLabel ${isFilled(username) ? "hidden" : ""}`}>Username</label>
        </div>
        
        <div className="input-container ic2">
          <input type="text" placeholder="" id="firstname" className="input" value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
          <div className="cut"></div>
          <label htmlFor="firstname" className={`iLabel ${isFilled(firstname) ? "hidden" : ""}`}>First name</label>
        </div>

        <div className="input-container ic3">
          <input type="text" placeholder="" id="lastname" className="input" value={lastname} onChange={(e) => setLastName(e.target.value)}/>
          <div className="cut"></div>
          <label htmlFor="lastname" className={`iLabel ${isFilled(lastname) ? "hidden" : ""}`}>Last name</label>
        </div>

        <div className="input-container ic4">
          <input type="text" placeholder="" id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <div className="cut cut-short"></div>
          <label htmlFor="email" className={`iLabel ${isFilled(email) ? "hidden" : ""}`}>Email</label>
        </div>

        <div className="input-container ic4">
          <input type="text" placeholder="" id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <div className="cut cut-short"></div>
          <label htmlFor="password" className={`iLabel ${isFilled(password) ? "hidden" : ""}`}>Password</label>
        </div>

        <button className="submit" type="submit" >Create Account</button>
        
      </form>

      <div>
        <p style={{color: "#08d"}}>{formData}</p> {/* Display formData below the form */}
      </div>
    </div>

    
    
  );


  
};


export default CreateAccount;

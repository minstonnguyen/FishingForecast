import React, { useState } from "react";



const Login = () => {
  
  return (
    <div>
        <h1>Login</h1>

        <label for="username"> Username </label>
        <input type="text" placeholder="Enter username" style={{marginLeft: "10px"}}/>
        <br></br>
        <label for="password"> Password</label>
        <input type="text" placeholder="Enter password" style={{marginLeft: "10px"}}/>
    </div>
  );
};

export default Login;

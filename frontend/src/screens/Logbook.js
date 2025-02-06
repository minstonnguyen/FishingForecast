import React, { useState } from "react";
import {useAuth} from "../context/AuthContext";
import '../styles/Logbook.css';

const Logbook = () => {
  const {user} = useAuth();
  return (
    <div>
        <h1>Snapcatch</h1>
        {user ? <p>Logged in</p> : <p>Please Log in.</p>}
    </div>
  );
};

export default Logbook;
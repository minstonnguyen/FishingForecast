import React, { useState } from "react";
import '../styles/Home.css';
import homeVideoBackground from "../images/fishingvideo.mp4";
import {Link} from 'react-router-dom';

const Home = () => {

  return (
    <div>
      <video autoPlay loop muted className="background-video">
        <source src={homeVideoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Fishing Forecast</h1>
        <p>The faster and easier way to plan and log your fishing trips.</p>
        <Link to="/fishingforecast">
          <button className="button">Plan your trip now.</button>
        </Link>
        
      </div>
    </div>




  );
};

export default Home;

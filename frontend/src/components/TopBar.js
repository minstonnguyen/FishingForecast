import { toBePartiallyChecked } from "@testing-library/jest-dom/matchers";
import React from "react";
import {Link} from "react-router-dom";
import '../styles/TopBar.css';
import {useAuth} from "../context/AuthContext";
import FishLogo from "../images/fish-logo.png";
var rightMargin = "20px";

const TopBar = () =>{
    const {user} = useAuth();
    return (
        <div className="topbar">
            <div className = "leftSideLogo">
                <Link to="/home">
                    <img className="fishlogo" src={FishLogo} alt="Fish Logo" />
                </Link>  
            </div>
            <div className = "middleLinks">
                <div className = "forecast">
                    <Link to="/fishingforecast" className="link" style={{ marginRight: rightMargin }}>☀️Fishing Forecast</Link>  
                </div>
                <div className = "logbook">
                    <Link to="/logbook" className="link" style={{ marginRight: rightMargin }}>🎣Snapcatch</Link>  
                </div>
            </div>
            
            <div className = "rightSideNav">
                
                <Link to="/login" className="link" style={{ marginRight: rightMargin }}>Login</Link>
                <Link to="/createaccount" className="link" style={{ marginRight: rightMargin }}>Create Account</Link>
                {user ? <h4 className="user">{user}</h4> : <h4 className="user">Not Signed In</h4>}
            </div>
        </div>
    );
}
export default TopBar;
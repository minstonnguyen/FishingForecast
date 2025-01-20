import { toBePartiallyChecked } from "@testing-library/jest-dom/matchers";
import React from "react";
import {Link} from "react-router-dom";
import '../styles/TopBar.css';
import FishLogo from "../images/fish-logo.png";
var rightMargin = "20px";

const TopBar = () =>{
    return (
        <div className="topbar">
            <div className = "leftSideLogo">
                <Link to="/home">
                    <img className="fishlogo" src={FishLogo} alt="Fish Logo" />
                </Link>  
            </div>
            <div className = "rightSideNav">
                
                <Link to="/login" className="link" style={{ marginRight: rightMargin }}>Login</Link>
                <Link to="/createaccount" className="link" style={{ marginRight: rightMargin }}>Create Account</Link>
                <h4 className="user">Not Signed In</h4>
            </div>
        </div>
    );
}
export default TopBar;
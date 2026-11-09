import { useState } from "react";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import { FiHome, FiKey, FiSettings } from "react-icons/fi";
import '../App.css';
import { useNavigate, useLocation } from "react-router-dom";
import { RiRobot3Fill } from "react-icons/ri";
import LogoutUser from "../helperfuncs/Logout";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const route = location.pathname;

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className={`nav-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={closeNav}
      />

      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>MENU</h2>
          <button className="nav-close" onClick={closeNav}>
            <IoClose size={24} />
          </button>
        </div>
        
        <div className="nav-item" onClick={()=>{navigate('/')}}>
          <FiHome />
          Dashboard
        </div>
        <div className="nav-item" onClick={()=>{navigate('/apis')}}>
          <FiKey />
          API Keys
        </div>
        <div className="nav-item">
          <RiRobot3Fill />
          AI Playground
        </div>
        <div className="nav-item">
          <FiSettings />
          Settings
        </div>
        <div className="nav-divider" />

        <div className="nav-footer">
          <div className="nav-footer-item" onClick={LogoutUser}>
            <IoLogOutOutline size={20} />
            Logout
          </div>
        </div>
      </div>

      <div className="nav-container">
        <button className="nav-toggle" onClick={toggleNav}>
          { !isOpen? <HiBars3CenterLeft size={28} /> : <label></label>}
        </button>
        <label className="headerText">
          { route === '/' ? 'Dashboard' : route === '/apis' ? 'API Keys' : route === '/playground' ? 'AI Playground' : route === '/settings' ? 'Settings' : '' }
        </label>
      </div>
    </>
  );
}
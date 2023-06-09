import '../../Style/Profile.css';
import user from '../../Images/user.png';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../Style/IntroCard.css';

const ProfileCard = () => {

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Welcome to your company event management! </h2>
      </div>
      <div className='descriere'>
        To see the events you will need to log with your company credentials. 
      </div>
      <div className='descriere'>
        If you don't have an account, please go to the register<br/> page and use your company email.
      </div>
      <div className="card-body">
        <div className="profile-details">
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>
        </div>
        <div className="profile-info">
        <Link to="/register">
            <button className="btn">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

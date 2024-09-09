import React from 'react';
import '../styles/sidebar.css'; // Ensure the path is correct

const Sidebar = ({ userInfo }) => {
    console.log("sidebar rendered");
    return (
        <div className="sidebar">
            <img src={userInfo.image} alt="Profile" className="image" />
            <h3>{userInfo.name}</h3>
            <p>Age: {userInfo.age}</p>
            <p>Height: {userInfo.height}</p>
            <p>Blood Group: {userInfo.bloodGroup}</p>
        </div>
    );
};

export default Sidebar;


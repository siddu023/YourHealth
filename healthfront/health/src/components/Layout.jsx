import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar'; // Assume you have a Sidebar component
import { useWeb3Context } from '../contexts/useWeb3Context';
import axios from 'axios';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { web3State } = useWeb3Context();
    const { selectedAccount, contractInstance } = web3State;

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchBasicInfo = async () => {
            try {
                const basicInfoHash = await contractInstance.getBasicData(selectedAccount);
                if (basicInfoHash) {
                    const response = await axios.post(
                        'http://localhost:3000/api/getBasicInfo',
                        { hash: basicInfoHash,
                        address:selectedAccount }
                    );
                    const data = response.data;
                    setUserInfo({
                        name: data.name,
                        age: data.age,
                        height: data.height,
                        bloodGroup: data.bloodGroup,
                        image: data.photoUrl
                    });
                } else {
                    navigate('/uploaduserinfo');
                }
            } catch (error) {
                console.error('Error fetching basic info:', error);
                navigate('/uploaduserinfo');
            }
        };

        if (selectedAccount) {
            fetchBasicInfo();
        }
    }, [selectedAccount, contractInstance, navigate]);

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                {location.pathname !== "/uploaduserinfo" && userInfo && <Sidebar userInfo={userInfo} />}
                <div style={styles.mainContent}>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        alignItems:'stretch',
        // Ensure full height of the viewport
    },
    mainContent: {
        padding: '1rem',
        backgroundColor: '#242424', // Match the global background color
        flex: 1, // Ensures the content takes up the remaining space
        marginLeft: '250px', // Width of the Sidebar
        overflowY: 'auto', // Enable vertical scrolling if content overflows
        minHeight: 'calc(100vh - 60px)', // Adjust height to accommodate Navbar
    },
};

export default Layout;


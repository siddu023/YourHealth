import React from "react";
import { useWeb3Context } from "../contexts/useWeb3Context";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { web3State } = useWeb3Context();
    const { selectedAccount } = web3State;

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/uploadHealthInfo" style={styles.link}>Upload Health Info</Link>
            <Link to="/uploadUserInfo" style={styles.link}>Upload User Info</Link>
            <div style={styles.walletAddress}>
                {selectedAccount ? `Connected: ${selectedAccount}` : "Not connected"}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#282c34",
        color: "#ffffff",
    },
    link: {
        color: "#61dafb",
        textDecoration: "none",
        margin: "0 1rem",
    },
    walletAddress: {
        marginRight: "1rem",
    },
};

export default Navbar;

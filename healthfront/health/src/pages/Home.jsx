import { useWeb3Context } from "../contexts/useWeb3Context";
import { useState, useEffect } from "react";
import UploadUserInfo from "../components/UploadUserInfo";
import UploadHealthInfo from "../components/UploadHealthInfo";  // Import the health info component

const Home = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const { web3State } = useWeb3Context();
    const { contractInstance, selectedAccount } = web3State;

    useEffect(() => {
        const checkRegistration = async () => {
            if (contractInstance && selectedAccount) {
                const registered = await contractInstance.isRegistered(selectedAccount);
                setIsRegistered(registered);
            }
        };

        checkRegistration();
    }, [contractInstance, selectedAccount]);

    return (
        <div>
            {isRegistered ? <UploadHealthInfo /> : <UploadUserInfo />}
        </div>
    );
};

export default Home;

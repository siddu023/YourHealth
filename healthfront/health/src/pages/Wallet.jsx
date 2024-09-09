import { useWeb3Context } from "../contexts/useWeb3Context";
import { connectWallet } from "../utils/connectWallet";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";
const Wallet = ()=>{
    const navigateTo=useNavigate()
    const {updateWeb3State,web3State}=useWeb3Context()
    const {selectedAccount}=web3State;
    useEffect(()=>{
        if(selectedAccount){
            navigateTo("/home")
        }
    },[selectedAccount,navigateTo])

    const handleWalletConnection = async()=>{
        const {contractInstance,selectedAccount} = await connectWallet();
        console.log(selectedAccount);
        updateWeb3State({contractInstance,selectedAccount})
       
    }
    return(
        <div>
            <h1>Your Health</h1>
            <button onClick={handleWalletConnection}>Connect Wallet</button>
        </div>
    )
}
export default Wallet;
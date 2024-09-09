import{ethers} from "ethers"
import toast from "react-hot-toast"
import axios from "axios"
import contractAbi from "../constants/contractAbi.json"


export const connectWallet= async()=>{

   
    try {
        if(!window.ethereum){
            throw new Error("Metamask is not installed")
        }
        const accounts= await window.ethereum.request({
            method:"eth_requestAccounts"
        })
        const selectedAccount=accounts[0];

        const provider= new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const message="welcome to YourHealth website";
        const signature= await signer.signMessage(message)

        const dataSignature={
            signature
        }

        const contractAddress="0xEcAC162DAD99252E5a86a4820238be163Fba33B1";
        const contractInstance = new ethers.Contract(contractAddress,contractAbi,signer);

        const isRegistered = await contractInstance.isRegistered(selectedAccount);

        
         return {contractInstance,selectedAccount,contractAddress,signer}
        
    } catch (error) {
        toast.error("wallet connection failed")
        console.log(error)
        
    }
}


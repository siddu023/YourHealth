const ethers = require('ethers');
const UserModel= require('../models/User');
const {decryptData}=require('../utils/decryption')
const axios = require('axios')
const PINATA_GATEWAY_URL="https://gateway.pinata.cloud/ipfs/"

async function returnIpfsResponse(ipfsHash){
    const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`)
   console.log("health ipfsHash:",res);
    return res.data

}


async function getHealthInfoController(req,res,next){
    const {hash,userAddress}=req.body;
    console.log("Health ipfsHash:",hash);
    console.log("Health address:",userAddress);

   
    try {
     
        

        const userrAddress=userAddress.toLowerCase()
        console.log("address from client;",userrAddress);
        const user = await UserModel.findOne({userAddress:userrAddress});

      

        if(!user){
            throw new Error("User Does not exists");
        }
        const pinataDataResponse = await returnIpfsResponse(hash);
       // console.log("encrypted data from getbasic:",pinataDataResponse);

        const { encryptedData,iv} = pinataDataResponse;

        const decryptedData = decryptData(encryptedData,iv,user.encryptionKey);
        
        const userInfo = JSON.parse(decryptedData);
        const {
            name,
            date,
            description,
            fileData} = userInfo;
            //console.log("userInfo:",userInfo);
            const photos = Array.isArray(fileData) ? fileData.map(data => `data:image/png;base64,${data}`) : [];
        res.json({
            name,
            date,
            description,
            photos
        });



       





    } catch (error) {
        console.error("error in getBasicController", error);
        return res.status(500).json({message:"internal server error"});
    }
}

module.exports = { getHealthInfoController};
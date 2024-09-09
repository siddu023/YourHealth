const ethers = require('ethers');
const UserModel= require('../models/User');
const {decryptData}=require('../utils/decryption')
const axios = require('axios')
const PINATA_GATEWAY_URL="https://gateway.pinata.cloud/ipfs/"

async function returnIpfsResponse(ipfsHash){
    const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`)
    return res.data
}


async function getBasicInfoController(req,res,next){
    try {
        const {hash,address}=req.body;
        //console.log("ipfsHash:",ipfsHash);
        // const address=req.address;
        const userAddress=address.toLowerCase()
        const user = await UserModel.findOne({userAddress:userAddress});

      

        if(!user){
            throw new Error("User Does not exists");
        }
        const pinataDataResponse = await returnIpfsResponse(hash);
       // console.log("encrypted data from getbasic:",pinataDataResponse);

        const { encryptedData,iv} = pinataDataResponse;

        const decryptedData = decryptData(encryptedData,iv,user.encryptionKey);
        
        const userInfo = JSON.parse(decryptedData);
        const {name,age,height,bloodGroup,fileData} = userInfo;

        res.json({name,age,height,bloodGroup,photoUrl:`data:image/png;base64,${fileData}`});


    } catch (error) {
        console.error("error in getBasicController", error);
        return res.status(500).json({message:"internal server error"});
    }
}

module.exports = {getBasicInfoController};
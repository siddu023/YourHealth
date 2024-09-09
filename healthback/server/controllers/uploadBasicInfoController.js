const ethers=require('ethers');
const UserModel=require('../models/User');
const{PINATA_APIKEY,PINATA_SECRETKEY} = require('../config/serverConfig')
const {generateEncryptionKey}=require('../utils/generateKey');
const {encryptFile}=require('../utils/encryption');
const {contractABI} = require('../constants/contractAbi.json');

async function uploadBasicInfoController(req,res,next){
    try {

        const {name,age,height,bloodGroup,selectedAccount}=req.body;
        console.log("accoun:",selectedAccount);
        const file = req.file;
        
        const user=await UserModel.findOne({userAddress:selectedAccount});
        if(!user){
            const user=await UserModel.create({userAddress:selectedAccount});
             
             console.log("userdata:", user);
       
         }
         if(!user.encryptionKey){
            const encryptionKey=generateEncryptionKey(32);
            user.encryptionKey=encryptionKey;
            await user.save()
            console.log("Encryption key generated and saved for user:", user.userAddress);
        }
        const combinedData={
            name,
            age,
            height,
            bloodGroup,
            fileData: file.buffer.toString('base64'),
        };
        const {encryptedData,iv}= encryptFile(JSON.stringify(combinedData),user.encryptionKey);
        //console.log("encrypteddata:",encryptedData);
        
        const pinataSDK = require('@pinata/sdk');
        const pinata = new pinataSDK({pinataApiKey:PINATA_APIKEY, pinataSecretApiKey:PINATA_SECRETKEY});
        const resPinata= await pinata.pinJSONToIPFS({encryptedData,iv})

        res.status(200).json({ipfsHash:resPinata.IpfsHash,message:"information uploaded"})

    } catch (error) {
        console.log(error);
        
    }
}
module.exports={uploadBasicInfoController}
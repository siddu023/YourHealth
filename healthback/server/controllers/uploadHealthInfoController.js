const ethers = require('ethers');
const UserModel= require('../models/User');
const{PINATA_APIKEY,PINATA_SECRETKEY} = require('../config/serverConfig')
const {generateEncryptionKey}= require('../utils/generateKey');
const {encryptFile}= require('../utils/encryption');

async function uploadHealthInfoController(req,res,next){
    try {

     const{name,date,description,address}=req.body;
     console.log("uploadbody:",req.body);
     const file = req.files;
     console.log("uplodfile:",file);

     const fileBuffers=file.map(file=>file.buffer.toString('base64'));

     //const address= req.address;
     console.log('recoveraddress:', address);
     const userAddress=address.toLowerCase()

     const user= await UserModel.findOne({userAddress:userAddress});
     if(!user){
        throw new Error("user doesnot exist");
     }
     const encryptionKey= user.encryptionKey;
     console.log("key:",encryptionKey);

     const combinedHealthData={
        name,
        date,
        description,
        fileData:fileBuffers
     };
     //console.log("combined data:", combinedHealthData);

     const{encryptedData,iv} = encryptFile(JSON.stringify(combinedHealthData),user.encryptionKey);

     const pinataSDK = require('@pinata/sdk');
     const pinata = new pinataSDK({pinataApiKey:PINATA_APIKEY, pinataSecretApiKey:PINATA_SECRETKEY});
     const resPinata= await pinata.pinJSONToIPFS({encryptedData,iv})
     console.log("health ipfshash:",resPinata.IpfsHash);


     res.status(200).json({ipfshash:resPinata.IpfsHash,message:"health inforamtion uploaded"})        






    } catch (error) {
        console.error("error in healthController", error);
        return res.status(500).json({message:"internal server error"});
    }
}
module.exports={uploadHealthInfoController}
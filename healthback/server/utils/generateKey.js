const crypto = require('crypto');

//function to generate encryptioin key

const generateEncryptionKey =(length)=>{
    return crypto.randomBytes(length/2).toString('hex');

};
module.exports={generateEncryptionKey}
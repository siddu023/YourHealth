const multer = require('multer');

const storage= multer.memoryStorage();

const uploadUserInfo = multer({ storage }).single('image');

const uploadHealthInfo = multer({ storage }).array('images');

module.exports = { 
    uploadUserInfo, 
    uploadHealthInfo 
};
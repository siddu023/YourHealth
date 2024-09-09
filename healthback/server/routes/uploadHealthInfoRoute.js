const express = require("express")
const router = express.Router();
const {uploadHealthInfo} = require('../middleware/multer');
const {uploadHealthInfoController} = require('../controllers/uploadHealthInfoController')
//const {authenticateToken}= require('../middleware/authenticationToken');

router.post('/uploadHealthInfo', uploadHealthInfo, (req, res, next) => {
    console.log('Request received at /uploadHealthInfo');
    console.log('Request body:', req.body);
    console.log('Files:', req.files); // If using .array() or .fields()
    next(); // Call the controller after logging
}, uploadHealthInfoController)

//router.post('/uploadHealthInfo',uploadHealthInfoController)

module.exports = router;
const express = require("express")
const router = express.Router();
const{uploadUserInfo} = require("../middleware/multer");
const {uploadBasicInfoController}=require("../controllers/uploadBasicInfoController");


router.post('/uploadBasicInfo',uploadUserInfo,uploadBasicInfoController)

module.exports = router;

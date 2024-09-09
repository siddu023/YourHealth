const express = require("express")
const router = express.Router();
const {getBasicInfoController} = require('../controllers/getBasicInfoController')


router.post('/getBasicInfo',getBasicInfoController)

module.exports = router;
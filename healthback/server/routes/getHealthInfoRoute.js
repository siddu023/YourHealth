const express = require("express")
const router = express.Router();

const {getHealthInfoController}=require("../controllers/getHealthInfoController");


router.post('/getHealthInfo',getHealthInfoController)

module.exports = router;
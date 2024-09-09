const express = require('express');
const app = express()
const cors = require('cors');
const {MONGODB_URL,PORT}= require("./config/serverConfig");
const {connectDB}= require('./db/connect');
const uploadBasicInfoRoute = require("./routes/uploadBasicInfoRoute");
const uploadHealthInfoRoute = require('./routes/uploadHealthInfoRoute')
const getHealthInfoRoute = require('./routes/getHealthInfoRoute')
const getBasicInfoRoute = require('./routes/getBasicInfoRoute');
app.use(cors())
app.use(express.json())
app.use('/api',uploadBasicInfoRoute)
app.use('/api',uploadHealthInfoRoute )
app.use('/api',getHealthInfoRoute)
app.use('/api',getBasicInfoRoute)

async function serverStart(){
    try {
        await connectDB(MONGODB_URL)
        app.listen(3000,()=>{
            console.log("connected to database");
        
        })
    } catch (error) {
        console.log(error)
        
    }
}

serverStart()
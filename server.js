require('dotenv').config()
const express = require('express')
 
const PORT = process.env.PORT
const app = express()

app.use(express.static('./public'))
const router = require('./routes/router')
app.use('/', router)

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`)
})
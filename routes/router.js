const express = require('express')
const path = require('path')

const router = express.Router()


router.get('/', (req,res)=>{
    
    console.log(path.join(__dirname,'..','views','index.html'))
    res.sendFile(path.join(__dirname,'..','public','index.html'))
})

router.get('/pixelizer', (req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','pixelizer.html'))
})

router.get('/reducer', (req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','reducer.html'))
})


module.exports = router
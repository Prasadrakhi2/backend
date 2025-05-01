const express = require('express');
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')


const app = express()

app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({extended : true}))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes)=>{
            const fs = bytes.toString("hex") + path.extname(file.originalname)
            cb(null, fs)          
    })
    }
  })
  
  const upload = multer({ storage: storage })

app.get('/', (req, res)=>{
    res.render('imageupload')
})

app.post('/upload', upload.single('image') , (req, res)=>{
    console.log(req.file)
    res.redirect('/')
})

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`server has been started at [http://localhost:${PORT}]`)
})
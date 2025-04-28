const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    fs.readdir(`./files`, function(err, files){
        res.render('index', {files: files})
    })
   
})

app.get('/files/:filename', (req, res)=>{
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('show', {filename : req.params.filename, filedata: filedata})
    })
   
})
app.get('/edit/:filename', (req, res)=>{
        res.render('edit', {filename: req.params.filename})
})

app.post('/create', (req, res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details,  function(err){
        res.redirect('/')
    })
})

app.post('/edit', (req, res)=>{
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        res.redirect('/')
    })
  
})

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`server has been started at [http://localhost:${PORT}]`);
})
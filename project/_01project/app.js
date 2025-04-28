const express = require('express');
const path = require('path');

const app = express();

// parser => helps to read the data ny the server
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// see all files in this folder
app.use(express.static(path.join(__dirname, 'public')));

//set what will be look on front end
app.set('view engine', 'ejs')

app.get('/', (req,res)=>{
    res.render('index')  //render the stup what to show in fe
})

// dynamic routing
app.get('/profile/:username', (req,res)=>{
    //req.params.username // get the username from the url
    res.send(`welcome ${req.params.username}` ) 

})

app.get('/author/:authername/:age', (req, res)=>{
    res.send(`Welcome ${req.params.authername} you age is ${req.params.age}`)
})

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`server has been started at [http://localhost:${PORT}]`);
})
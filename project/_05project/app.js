const express = require('express');
const path = require('path')
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const app = express();

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.get('/', (req, res)=>{
    let tocken = jwt.sign({email : 'rakhi@gmail.com'}, 'secreat')
    res.cookie('tocken', tocken)
    res.render('index')
})

app.post('/create',async (req, res)=>{
    let {name, email, image} = req.body;
    let newUser = await userModel.create({
        name,
        email,
        image
    })
    res.redirect('/read')
})

app.get('/delete/:userId', async(req,res)=>{
    let user = await userModel.findOneAndDelete({_id : req.params.userId})
    console.log(user)
    res.redirect('/read')
})

app.get('/read', async(req,res)=>{
    let users = await userModel.find();
    let data = jwt.verify(req.cookies.tocken, 'secreat')
    res.render('read', {users})
    console.log(data)
})

const PORT = 4008;
app.listen(PORT, ()=>{
    console.log(`server is running on port [http://localhost:${PORT}]`);
})
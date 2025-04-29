const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const userModel = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = express();

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/create', (req, res)=>{
    let {username, email, password, age} = req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async(err, hash)=>{
            
            let user = await userModel.create({
                username,
                email,
                password : hash,
                age
            })
            let token = jwt.sign({email}, 'secret')
            res.cookie('token', token)
            res.send(user)
        });
    });

    
})

app.get('/logout', (req, res)=>{
    res.cookie('token', '')
    res.redirect('/')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login',async (req, res)=>{
    let user = await userModel.findOne({email : req.body.email})
    if(!user) return res.send('something went wrong')
    
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if(result) {
                let token = jwt.sign({email : user.email}, 'secret')
                res.cookie('token', token)
                 res.send('user loged in succesfully')
            }
            else{
                res.send('Something went wrong')
            }
            
        });
})

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`server is running on port [http://localhost:${PORT}]`);
})
const express = require('express');
const path = require('path')
const userModel = require('./models/user')

const app = express();

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/read',async (req, res)=>{
    let Users = await userModel.find()
    res.render('read', {Users})
})

app.post('/create',async (req, res)=>{
    let {name, email, image} = req.body
    let createdUser = await userModel.create({
        name,
        email,
        image
    })
    res.redirect('/read')
})

app.get('/delete/:_id', async(req, res)=>{
    // console.log(req.params.id)
   let deletedUser = await userModel.findOneAndDelete({_id : req.params._id})
    res.redirect('/read')   
})

app.get('/edit/:_id', async(req, res)=>{
   let user = await userModel.findOne({_id : req.params._id})
   res.render('edit', {user})
})

app.post('/update/:_id', async (req, res) => {
    let {name, email, image} = req.body;
    let updatedUser = await userModel.findOneAndUpdate({_id: req.params._id}, {
        name,
        email,
        image
    }, {new: true});
    // console.log(updatedUser);
    res.redirect('/read');
    // res.send(updatedUser);
    // res.send(req.body)
})

const PORT = 5000;
app.listen(PORT, ()=>{
    console.log(`server is running on port [http://localhost:${PORT}]`);
})
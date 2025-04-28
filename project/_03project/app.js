const express = require('express');
const userModel = require('./mongodb');

const app = express();
app.get('/create',async (req,res)=>{
    try{
        let userData =  await userModel.create({
            name : 'vidhi',
            userName: 'bacha',
            email : 'rakhi@gmail.com'
            })
            res.send(userData)
    }
    catch(err){
        console.log(err.message)
    }
    
})

app.get('/update',async (req,res)=>{
   let updatedUser =  await userModel.findOneAndUpdate({userName : 'prasadr201'}, {name : 'sourabh prasad'}, {new : true})
    res.send(updatedUser)
})

app.get('/delete',async (req,res)=>{
   let deletedUser =  await userModel.findOneAndDelete({userName : 'bacha'})
    res.send(deletedUser)
})

app.get('/read',async (req, res)=>{
    let users =  await userModel.find();
    res.send(users)
})

app.get('/rakhi', (req,res)=>{
    res.send('rakhi page')
})

app.get('/', (req,res)=>{
    res.send('jee')
})



const PORT = 4000;
app.listen(PORT,()=>{
    console.log(`server is running on port [http://localhost:${PORT}]`);
})
const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render('index')
})

const PORT = 4000;
app.listen(PORT, ()=>{
    console.log(`server is running on port [http://localhost:${PORT}]`);
})
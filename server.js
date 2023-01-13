const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const {v4:uuidv4} = require("uuid");
const router = require('./router');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const morgan = require('morgan')

const port = process.env.PORT||3000;

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.use(morgan('tiny')) 

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));



app.set('view engine','ejs');

//load static assets
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))
app.use(session({
    secret: uuidv4(),
    resave:false,
    saveUninitialized:true
}));

app.use('/route',router);

// home route
app.get('/', (req,res) => {
    res.render('base',{title:"User Management System"});

}) 
app.put('/updateuser',(req, res) => {
	console.log(":: PUT /log");
  res.redirect('/');
})
    
app.delete('/updateuser',(req, res) => {
  console.log(":: Delete /log");
    res.redirect('/route/dashboard');
})


app.listen(port, ()=>{
    console.log(`Server Started at ${port}`)
})
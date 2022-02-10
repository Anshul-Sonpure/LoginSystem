const Joi = require("joi");
const { application, response } = require("express");
const express = require("express");
const router = express.Router();
const html_tablify = require('html-tablify');
const fs = require("fs");
const importdata = require("./users.json");



const creds ={
    email:"admin@gmail.com",
    password:"admin123"
}


var options = {
    data: importdata,border: 5,
    css: 'table {border: 5px solid red}'
};
var html_data = html_tablify.tablify(options);


//Login User
router.post('/login',(req,res) =>{
    if(req.body.email == creds.email && req.body.password == creds.password)
    {
        req.session.user = req.body.email;
        res.redirect('/route/dashboard')

    }else{
        
        res.render('base',{title:"Manage User System",authfail:"Authorization Failed!!!"})
    }

});


//dashboard Route
router.get('/dashboard',(req,res) =>{
    if(req.session.user){
        res.render('dashboard',{user:req.session.user,message1:"New data"})
    }else{
        res.render('base',{title:"Manage User System",logout:"Session Expired Please ReLogin"})
    }
})

//Logout Route
router.get('/logout',(req,res) => {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            res.render('base',{title:"Manage User System",logout:"Logout Successfully!!!"})
        }
    })
})

//Get all User Route
router.get('/getusers',(req,res) =>{
 if(req.session.user){
   res.send(html_data);
    
    }else{
        res.render('base',{title:"Manage User System",logout:"Session Expired Please ReLogin"})
    }

})

// Create a User
router.get('/createuser',(req,res) =>{
    if(req.session.user){
        res.render('createuser',{user:req.session.user})
    }else{
        res.render('base',{title:"Manage User System",logout:"Session Expired Please ReLogin"})
    }
})

router.post('/createuser',(req,res) =>{
    const schema = Joi.object().keys({
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        email: Joi.string().email().lowercase().required(),
        gender: Joi.string().min(4).required(),
        department: Joi.string().min(2).required(),
        
    }).options({abortEarly : false})
        const {error}  = schema.validate(req.body);
        console.log(error)
        if (error){
            return res.status(400).send('Please provide all details');
        }
        const data={
            id : importdata.length+1,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            department: req.body.department,
        };
        importdata.push(data);
        fs.writeFile("users.json", JSON.stringify(importdata,null, 2), err => {
     
            // Checking for errors
            if (err) throw err; 
           
            console.log("Done writing"); // users.json updated
            
        });
        
        res.render('dashboard',{title:"Manage User System",createuser:"User Created Successfully"})

})


router.get('/updateuser',(req,res) =>{
    if(req.session.user){
        res.render('updateuser',{user:req.session.user})
    }else{
        res.render('base',{title:"Manage User System",logout:"Session Expired Please ReLogin"})
    }
})


module.exports = router;
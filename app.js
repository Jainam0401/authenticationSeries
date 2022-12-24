//jshint esversion:6
require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// console.log(process.env.SECRET);


const user = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            const newUser = new user({
                email: req.body.username,
                password: hash
            });
            newUser.save((err)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render("secrets")
                }
            });
        
    });
    
    

    
});

app.post("/login",(req,res)=>{

    
        const username = req.body.username
        const password=  req.body.password
 
    user.findOne({email : username},(err,founduser)=> {
        if(err){
            res.send("wrong details");
        }else{
            if(founduser){
                bcrypt.compare(password, founduser.password, function(err, result) {
                    if(result==true){
                        res.render("secrets")
                    }
        });
            }
        }
    });
   
    });
       


app.listen(3000,()=>{
    console.log("Port Started on port 3000");
})
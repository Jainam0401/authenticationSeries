//jshint esversion:6
require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: "Our little Secret.",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
// console.log(process.env.SECRET);


const user = new mongoose.model("User",userSchema);

// passport.use(user.createStratergy());

passport.serializeUser(user.serializeUser());
   
  passport.deserializeUser(user.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",function (req,res) {
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
})

app.post("/register",(req,res)=>{
    user.register({username:req.body.username},req.body.password,function (err,user) {
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function() {
                res.redirect("/secrets");
            })
        }
    })
    
});



app.post("/login",(req,res)=>{
    const users = new user({
        username:req.body.username,
        password:req.body.password
    });
    req.login(users,function(err) {
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function() {
                res.redirect("/secrets");
            });  
        }
    })
    
   
    });
       


app.listen(3000,()=>{
    console.log("Port Started on port 3000");
})
const express=require("express");
const authRouter=express.Router();
const path=require("path");
const mongoose=require("mongoose");
require("../Modals/speakersModal");
const speakerSchema=mongoose.model("speakers");
const bcrypt = require('bcrypt');
const multer=require("multer");
const upload=multer({dest:'public/images'});



authRouter.get("/login",(request,response)=>{
    console.log(request.query); //query login string
    console.log(request.params); //params of routing
    response.render("authViews/login.ejs", { message: request.flash() });
})

authRouter.post("/login",(request,response)=>{
    if(request.body.username=="mahmoud"&&request.body.password==123){  
        request.session.role="admin";     
        response.redirect("/admin/profile");
    }         
    else{        
        speakerSchema.find({username:request.body.username})
        .then(function(user) {
            return bcrypt.compare(request.body.password, user[0].password);
        })
        .then(function(samePassword) {
            if(!samePassword) {
                request.flash('pass',"wrong password!");
                response.redirect("/login");
            }else{
                request.session.role="speaker";
                request.session.name=request.body.username;   
                response.redirect("/speakeraccess/profile/"+request.body.username);
            }
        })
        .catch(function(error){
            request.flash('user',"user not found!");
            response.redirect("/login");
        })    
    }  
})

authRouter.get("/register",(request,response)=>{
    response.render("authViews/registration.ejs",{ message: request.flash() });
})

authRouter.post("/register",upload.single('avatar'),(request,response)=>{
    console.log(request.file);
    let newspeaker;
    if(request.file){
        newspeaker=new speakerSchema({
            ...request.body,
            avatar:"/images/"+request.file.filename
        })
    }else{
        newspeaker=new speakerSchema({
            ...request.body 
        }) 
    }
    newspeaker.save().then((data)=>{
        response.redirect("/login");
    }).catch((error)=>{
        try{
                request.flash('registrationError',Object.keys(error.errors)[0]+" is invalid");
                response.redirect("/register");
                
        }catch{
            request.flash('registrationError',Object.keys(error.keyPattern)[0]+" is already taken");
                response.redirect("/register");
                console.log("pattern is"+error.keyPattern);
        }
        
    })
})

authRouter.get("/logout",(request,response)=>{
    request.session.destroy(()=>{
        response.redirect("/login");
    })
})
module.exports=authRouter;
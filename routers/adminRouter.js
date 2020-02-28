const express=require("express");
const adminRouter=express.Router();
const path=require("path");
const mongoose=require("mongoose");
require("../Modals/speakersModal");
const speakerSchema=mongoose.model("speakers");
require("../Modals/notificationsModal");
const notification=mongoose.model("notifications");

adminRouter.use((request,response,next)=>{
    if(request.session.role=="admin"){
        next();
    }else{
        response.redirect("/logout");
    }
})

adminRouter.get("/profile",(request,response)=>{
    notification.find({}).then((data)=>{
        
        response.render("adminViews/adminProfile.ejs",{data});
    }).catch((error)=>{
        console.log(error);
    })
})

module.exports=adminRouter;
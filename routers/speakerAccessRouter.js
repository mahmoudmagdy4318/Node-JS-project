const express=require("express");
const speakersAccessRouter=express.Router();
const path=require("path");
const mongoose=require("mongoose");
const Speaker=mongoose.model("speakers");
require("../Modals/eventsModal");
const eventsSchema=mongoose.model("events");
require("../Modals/notificationsModal");
const notification=mongoose.model("notifications");
const bcrypt = require('bcrypt');
const multer=require("multer");
const upload=multer({dest:'public/images'})



speakersAccessRouter.use((request,response,next)=>{
    debugger
    if(request.session.role=="speaker"){
        next();
    }else{
        response.redirect("/login");
    }
})
speakersAccessRouter.get("/profile/:username",(request,response)=>{
    
    let username=request.params.username;
    Speaker.find({username:username}).then((data)=>{
        let speakerId=data[0]._id;
        eventsSchema.find({$or:[{mainSpeaker:speakerId},{otherSpeakers:{$in:[speakerId]}}]})
        .populate({path:"mainSpeaker otherSpeakers"})
        .then((events)=>{
            let name=request.session.name;
            console.log(data);
            
            response.render("speakersViews/speakerProfile.ejs",{events,data,name});
        }).catch((error)=>{
            console.log(error+"");
            
        })
        // console.log(data[0]._id);
    }).catch((error)=>{
        console.log(error);
    })
})

speakersAccessRouter.get("/events",(request,response)=>{    
    
    console.log("hi events");
    
    eventsSchema.find({}).populate({path:"mainSpeaker otherSpeakers"})
    .then((data)=>{
        let name=request.session.name;
        response.render("speakersViews/eventsforSpeaker.ejs",{data,name});
    }).catch((error)=>{
        console.log(error+"");
    })
})

speakersAccessRouter.get("/edit/:name",(request,response)=>{ 
    Speaker.find({username:request.params.name}).then((data)=>{
        response.render("speakersViews/updateSpeakerData.ejs",{data});
    }).catch((error)=>{
        console.log(error);
    })  
})

speakersAccessRouter.post("/edit",upload.single('avatar'),(request,response)=>{
    let username=request.body.username;
    debugger
    if(request.file){
        Speaker.updateOne({_id:request.body._id},{$set:{ 
            ...request.body,
            avatar: "/images/"+request.file.filename
        }   
        }).then((data)=>{
            response.redirect("/speakeraccess/profile/"+username);
        }).catch((error)=>{
    
            response.redirect("/speakeraccess/edit/"+username);
        })
    }
    else{
        console.log(request.body);
        
        Speaker.updateOne({_id:request.body._id},{$set:
            request.body
        }).then((data)=>{
            console.log("success");
            response.redirect("/speakeraccess/profile/"+username);
        }).catch((error)=>{
        console.log("i'm out post edit");
    
            response.redirect("/speakeraccess/edit/"+username);
        })
    }
})

speakersAccessRouter.post("/apologize",(request,response)=>{
    console.log(request.body);
    let eventTitle;
    Speaker.find({username:request.body.name}).then((speaker)=>{
         eventsSchema.updateOne({_id:request.body.id},{$pull:{otherSpeakers: {$in: [speaker[0]._id] }}})
         .then((data)=>{
             let newNotificatione=new notification({
                 body:"Mr. "+request.body.name+" apologized for "+request.body.title+" event",
                 date: new Date()
             })
             newNotificatione.save().then((data2)=>{
                response.send("success");
             }).catch((error)=>{
                 console.log(error);
             })
         }).catch((error)=>{
             console.log(error);
         })
    }).catch((error)=>{
        console.log(error);
    })
})
module.exports=speakersAccessRouter;
const express=require("express");
const speakersRouter=express.Router();
const path=require("path");
const mongoose=require("mongoose");
const Speaker=mongoose.model("speakers");


speakersRouter.use((request,response,next)=>{
    if(request.session.role=="admin"){
        next();
    }else{
        response.redirect("/login");
    }
})



speakersRouter.get(["/list","/"],(request,response)=>{
        Speaker.find({}).then((data)=>{
            response.render("speakersViews/speakers.ejs",{data});
        }).catch((error)=>{
            console.log(error);
        })
})
speakersRouter.get("/add",(request,response)=>{
    response.render("speakersViews/addSpeakers.ejs");
})

speakersRouter.post("/add",(request,response)=>{
    let newspeaker=new Speaker(
            request.body
        )
    newspeaker.save().then((data)=>{
        response.redirect("/speakers/");
    }).catch((error)=>{
        response.redirect("/speakers/add");
    })
})

speakersRouter.post("/edit",(request,response)=>{
    Speaker.update({_id:request.body._id},{$set: 
        request.body    
    }).then((data)=>{
        response.redirect("/speakers/");
    }).catch((error)=>{
        response.redirect("/speakers/edit");
    })
})

speakersRouter.get("/edit/:id",(request,response)=>{ 
    Speaker.find({_id:request.params.id}).then((data)=>{
        response.render("speakersViews/editSpeaker.ejs",{data});
    }).catch((error)=>{
        console.log(error);
    })  
})

    
speakersRouter.post("/delete",(request,response)=>{
    Speaker.deleteOne({_id:request.body._id}).then((data)=>{
        console.log(request.body._id,"      here");
        response.send(data);
    }).catch((error)=>{
        console.log(error+"");
    })
});


module.exports=speakersRouter;

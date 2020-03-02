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
    response.render("speakersViews/addSpeakers.ejs",{message: request.flash()});
})

speakersRouter.post("/add",(request,response)=>{
    let newspeaker=new Speaker(
            request.body
        )
    newspeaker.save().then((data)=>{
        response.redirect("/speakers/");
    }).catch((error)=>{
        try{
            request.flash('registrationError',Object.keys(error.errors)[0]+" is invalid");
            response.redirect("/speakers/add");
            
    }catch{
        request.flash('registrationError',Object.keys(error.keyPattern)[0]+" is already taken");
        response.redirect("/speakers/add");
            console.log("pattern is"+error.keyPattern);
    }
    })
})

speakersRouter.post("/edit",(request,response)=>{
    let id= request.body._id;
    Speaker.update({_id:id},{$set: 
        request.body    
    }).then((data)=>{
        response.redirect("/speakers/");
    }).catch((error)=>{
        let errorRes=(error+"").split(" ")[(error+"").split(" ").length-1];
        request.flash('registrationError',errorRes.substring(9)+" is invalid");
        response.redirect("/speakers/edit/"+id);
    })
})

speakersRouter.get("/edit/:id",(request,response)=>{ 
    Speaker.find({_id:request.params.id}).then((data)=>{
        response.render("speakersViews/editSpeaker.ejs",{data, message: request.flash()});
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

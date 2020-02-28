const express=require("express");
const eventsRouter=express.Router();
const mongoose=require("mongoose");
require("../Modals/eventsModal");
const eventsSchema=mongoose.model("events");
require("../Modals/speakersModal");
const speakerSchema=mongoose.model("speakers");


eventsRouter.use((request,response,next)=>{
    if(request.session.role=="admin"){
        next();
    }else{
        response.redirect("/login");
    }
})

eventsRouter.get(["/list","/"],(request,response)=>{    
    
    console.log("hi events");
    
    eventsSchema.find({}).populate({path:"mainSpeaker otherSpeakers"})
    .then((data)=>{
        response.render("eventViews/events.ejs",{data});
    }).catch((error)=>{
        console.log(error+"");
    })
})



eventsRouter.get("/add",(request,response)=>{
    speakerSchema.find({},{_id:1,fullname:1}).then((data)=>{
        response.render("eventViews/addEvents.ejs",{data});
    }).catch((error)=>{
        console.log(error);
    })
})

eventsRouter.post("/add",(request,response)=>{
    debugger
    let newEvent=new eventsSchema(
        request.body
    )
    newEvent.save().then((data)=>{
        response.redirect("/events/")
    }).catch((error=>{
        console.log(error+"");
    }))
})

eventsRouter.get("/update/:id",(request,response)=>{

    eventsSchema.find({_id:request.params.id}).populate({path:"mainSpeaker otherSpeakers"})
    .then((eventData)=>{
        let event=eventData[0];
        speakerSchema.find({},{_id:1,fullname:1}).then((data)=>{
            response.render("eventViews/editEvents.ejs",{data,event});
            console.log(event.otherSpeakers);
            
        }).catch((error)=>{
            console.log(error+" ");
        })      
    }).catch((error)=>{
        console.log(error+" ");
    })
    
    
})

eventsRouter.post("/update",(request,response)=>{
    console.log(request.body);
    eventsSchema.update({_id:request.body._id},{
        $set: request.body
    }).then((data)=>{
        response.redirect("/events/")})
    .catch((error)=>{
        response.redirect("/events/update")
    })
})

eventsRouter.post("/delete",(request,response)=>{
    eventsSchema.deleteOne({_id:request.body.id}).then((data)=>{
        response.send(data);
    }).catch((error)=>{
        console.log(error);
    })
})

module.exports=eventsRouter;
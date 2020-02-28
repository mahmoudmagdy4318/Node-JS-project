const express = require("express");
const server= express();
const authRouter=require ("./routers/authunticationRouter");
const speakersRouter=require("./routers/speakersRouter");
const speakersAccessRouter=require("./routers/speakerAccessRouter");
const eventsRouter=require("./routers/eventsRouter");
const adminRouter=require("./routers/adminRouter");
const mongoose=require("mongoose");
const path=require("path");
const session=require("express-session");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


server.listen(8082,()=>{
    console.log("server is connected and listening on port number 8082");   
})

mongoose.connect("mongodb://localhost:27017/eventsDB",{ useNewUrlParser: true,useUnifiedTopology: true }).then((data)=>{
    console.log("dataBase connected");
}).catch((error)=>{
    console.log(error);
})

server.use(function(request,response,next){
    console.log("first Middleware "+request.url+" with method "+request.method);
    next();
})

server.use(express.json());
server.use(express.urlencoded({ extended: false }));


server.set('view enginpne', 'ejs');
server.set("views",path.join(__dirname,"views"));
server.use(session({
    secret: 'iti mansoura',
    maxAge: 100000000
}));

server.use(express.static(path.join(__dirname,"public")));
server.use(express.static(path.join(__dirname,"images")));

server.use(express.static(path.join(__dirname,"node_modules","bootstrap","dist")));
server.use(express.static(path.join(__dirname,"node_modules","jquery")));


server.use(authRouter);

// middlware for sessions

server.use((request,response,next)=>{
    if(request.session.role){
        next();
    }else{
        response.redirect("/login");
    }
})

server.use("/speakers",speakersRouter);

server.use("/events",eventsRouter);

server.use("/admin",adminRouter);

server.use("/speakeraccess",speakersAccessRouter);
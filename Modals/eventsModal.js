const mongoose=require("mongoose");
const eventsSchema=new mongoose.Schema({
   _id:{type:Number,required:true},
   title:{type:String,required:true},
   eventDate:{type:Date,required:true},
   mainSpeaker:{type:Number,ref:"speakers"},
   otherSpeakers:[{type:Number,ref:"speakers"}]
});

//mapping
mongoose.model("events",eventsSchema);
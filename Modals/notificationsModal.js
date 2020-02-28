const mongoose=require("mongoose");
const notificationsSchema=new mongoose.Schema({
   body:{type:String,required:true},
   date:{type:Date,required:true}
});

//mapping
mongoose.model("notifications",notificationsSchema);
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const speakerSchema=new mongoose.Schema({
    _id:{type:Number,required:true},
    fullname:{ type: String, required: true},
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    address:{
        city:String,
        street:Number,
        building:Number
    },
    image:String,
    avatar:String
})

const hashPassword = function(next) {
    let password;
    const self = this
    if (self.op=="updateOne"){
        password = self.get('password')
    }else{
        password = self.password
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(password, salt, function(err, hash) {
            debugger
            if (err) return next(err);
            if (self.op=="updateOne"){
                password = self.set('password',hash)
            }else{
                self.password = hash
            }
            next();
        });
    });
}

speakerSchema.pre('save', hashPassword);
speakerSchema.pre('updateOne', { document: false, query: true },hashPassword);
speakerSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//mapping
mongoose.model("speakers",speakerSchema);

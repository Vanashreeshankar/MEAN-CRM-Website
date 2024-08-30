const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const userSchema = new Schema({
    
    email: {type: String, required:[true, 'Please Enter an Email'], unique: true},
    username: {type: String, required:true},
    password: {type: String, required:[true, 'Please Enter an Password']},
    role:{type: String, default: "user"},
    key: {type: String},
    refreshJWT:{token:{
        type:String,
        maxlength: 500,
        default:''
    },
    addedAt:{
       type:Date,
       required: true,
       default: Date.now()
    }}
});




module.exports = mongoose.model('User', userSchema);



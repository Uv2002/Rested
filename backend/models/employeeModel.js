const mongoose = require('mongoose')


const employeeSchema = new mongoose.Schema({
    // schema goes here
    name:{
        type:String,
        required:true
    },
    SIN:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    phoneNumber:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    position:{
        type:String,
        required:true
    },
    timeIn:{
        type:String,
        required:false
    },
    timeOut:{
        type:String,
        required:false
    },
    clockedIn:{
        type:Boolean,
        required:false
    }
}, {timestamps: true});



module.exports = mongoose.model('Employee', employeeSchema)
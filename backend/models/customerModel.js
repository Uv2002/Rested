const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    // schema goes here
    customerName: {
        type: String,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true
    },
    tableID: {
        type: 'ObjectId',
        ref: 'Table',
        required: false
    },
    phoneNumber:{
        type:Number,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    reservationID: {
        type:'ObjectId',
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Customers', customerSchema)
const mongoose = require('mongoose')


const tableSchema = new mongoose.Schema({
    // schema goes here
    transform: { 
        x: {type: Number, required: true}, 
        y: {type: Number, required: true}, 
        width: {type: Number, required: true}, 
        height: {type: Number, required: true}, 
        rotation: {type: Number, required: true}, 
    },    
    title: {
        type: String,
        required: true
    },  
    seatsNumber: {
        type: Number,
        required: true
    },
    peopleAssigned: {
        type: Number,
        required: true
    },
    isOccupied: {
        type: Boolean,
        required: true
    },
    isReserved: {
        type: Boolean,
        required: true
    },
    isClean: {
        type: Boolean,
        required: true
    },
    orderArray: {
        type: Array,
        required: false
    },
    customerID: {
        type: 'ObjectId',
        ref: 'Employees',
        required: false    //array of customer IDs
    },
    totalPeopleAssigned:{
        type: Number,
        required: true
    },
    totalAssignedTimes:{
        type: Number,
        required: true
    },
    section: {
        type: 'ObjectId',
        ref: 'Section',
        required: false,
    }
}, {timestamps: true})

module.exports = mongoose.model('Table', tableSchema)
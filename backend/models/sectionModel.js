const mongoose = require('mongoose')


const sectionSchema = new mongoose.Schema({
    // schema goes here
    sectionTitle:{
        type: String,
        required:true
    },
    listOfTables :[{
        type: 'ObjectId',
        ref: 'Table',
        required: false
    }],
    numberOfTable: {
        type: Number,
        required: true
    },
    totalNumberOfseats: {
        type: Number,
        required: true
    },
    specialNotes: {
        type: String,
        required: false
    },
    isOpened: {
        type: Boolean,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('section', sectionSchema)
const mongoose = require('mongoose')


const reservationSchema = new mongoose.Schema({
    // schema goes here
    title: {
        type: String,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    reservationDate: {
        type: Date,
        required: false
    },
    tableID: {
        type: 'ObjectId',
        ref: 'Table',
        required: false
    },
    customerName: {
        type: String,
        required: false
    },
    customerPhone: {
        type: String,
        required: false
    },
    customerEmail: {
        type: String,
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Reservation', reservationSchema)
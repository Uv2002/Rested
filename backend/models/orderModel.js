const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    // schema goes here
    title: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    dishArray: {
        type: Array,
        required: true
    },
    specialNotes: {
        type: String,
        required: false
    },
    customerID: {
        type: 'ObjectId',
        ref: 'Customers',
        required: false
    },
    tableID: {
        type: 'ObjectId',
        ref: 'Table',
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Order', orderSchema)
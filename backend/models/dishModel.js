const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
    // schema goes here
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    orderID: {
        type: 'ObjectId',
        required: false
    },
    description: {
        type: String,   
        required: false
    },
    dishCount: {
        type: Number,
        required: true,
        default:0,
        min:0,
        // max:3000,
    },
}, {timestamps: true})

module.exports = mongoose.model('Dish', dishSchema)
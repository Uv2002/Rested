const mongoose = require('mongoose')

const Schema = new mongoose.Schema

const mapSchema = new Schema({
    // schema goes here
    sectionArray: {
        type: ['ObjectId'],
        required: false
    },
}, {timestamps: true})

module.exports = mongoose.model('Map', mapSchema)
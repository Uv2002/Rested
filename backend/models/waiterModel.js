const mongoose = require('mongoose')
const employees = require('./employeeModel');
const section = require('./sectionModel');

const waiterSchema = new mongoose.Schema({
    // schema goes here
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: false
    },
    
}, {timestamps: true})

module.exports = mongoose.model('Waiter', waiterSchema)
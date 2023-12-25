const Customers = require('../models/customerModel')
const mongoose = require('mongoose')

// get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customers.find({}).sort({createdAt: -1})
        res.status(200).json(customers)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one Customer
const getCustomer = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const customer = await Customers.findById(id)
        if (!customer) {
            return res.status(404).json({
                error: 'customer not found'
            })
        }
        
        res.status(200).json(customer)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new Customer
const createCustomer = async (req, res) => {
    const {title,
        numberOfPeople,
        tableID,
        phoneNumber,
        email,
        reservationID, } = req.body
    // try to create a new customer. add to db
    try {
        const newCustomer = await Customers.create({
            title,
        numberOfPeople,
        tableID,
        phoneNumber,
        email,
        reservationID,
        })
        res.status(200).json(newCustomer)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete a customer
const deleteCustomer = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to customer the customer
    const customer = await Customers.findByIdAndDelete({_id: id})
    if (!customer) {
        return res.status(400).json({
            error: 'customer not found'
        })
    }

    res.status(200).json({
        msg: 'customer deleted'
    })
}

// update a customer
const updateCustomer = async (req, res) => {
    const {id} = req.params
    const updatedData = req.body

    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    const customer = await Customers.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the customer exists
    if (!customer) {
        return res.status(400).json({
            error: 'customer not found'
        })
    }

    // return the updated customer
    res.status(200).json(customer)


}


module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    deleteCustomer,
    updateCustomer
}
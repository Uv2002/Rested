const Waiter = require('../models/waiterModel')
const mongoose = require('mongoose')

// get all Waiters
const getWaiters = async (req, res) => {
    try {
        const Waiters = await Waiter.find({}).sort({createdAt: -1})
        res.status(200).json(Waiters)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal Server error',
            err: err.message
        })
    }
}

// get one Waiter
const getWaiter = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const Waiter = await Waiter.findById(id)
        if (!Waiter) {
            return res.status(404).json({
                error: 'Waiter not found'
            })
        }
        
        res.status(200).json(Waiter)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal Server error',
            err: err.message
        })
    }
}

// create a new Waiter
const createWaiter = async (req, res) => {
    const { employeeID} = req.body
    // try to create a new Waiter. add to db
    try {
        const newWaiter = await Waiter.create({
            employeeID
        })
        res.status(200).json(newWaiter)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal Waiter error',
            err: err.message
        })
    }
}

// delete a Waiter
const deleteWaiter = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to delete the Waiter
    const Waiter = await Waiter.findByIdAndDelete({_id: id})
    if (!Waiter) {
        return res.status(400).json({
            error: 'Waiter not found'
        })
    }

    res.status(200).json({
        msg: 'Waiter deleted'
    })
}

// update a Waiter
const updateWaiter = async (req, res) => {
    const {id} = req.params
    const updatedData = req.body

    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    const Waiter = await Waiter.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the Waiter exists
    if (!Waiter) {
        return res.status(400).json({
            error: 'Waiter not found'
        })
    }

    // return the updated Waiter
    res.status(200).json(Waiter)


}


module.exports = {
    createWaiter,
    getWaiters,
    getWaiter,
    deleteWaiter,
    updateWaiter
}
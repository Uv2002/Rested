const Dish = require('../models/dishModel')
const mongoose = require('mongoose')

// get all dishes
const getDishes = async (req, res) => {
    try {
        const dishes = await Dish.find({}).sort({createdAt: -1})
        res.status(200).json(dishes)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one dish
const getDish = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const dish = await Dish.findById(id)
        if (!dish) {
            return res.status(404).json({
                error: 'dish not found'
            })
        }
        // return the dish to the client
        res.status(200).json(dish)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new dish
const createDish = async (req, res) => {
    const { 
       name,
       price,
        orderID,
        description,
        dishCount} = req.body
    // try to create a new dish. add to db
    try {
        const newOrder = await Dish.create({
            name,
            price,
            orderID,
            description,
            dishCount
        })
        res.status(200).json(newOrder)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete a dish
const deleteDish = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to delete the dish
    const dish = await Dish.findByIdAndDelete({_id: id})
    if (!dish) {
        return res.status(400).json({
            error: 'dish not found'
        })
    }

    res.status(200).json({
        msg: 'dish deleted'
    })
}

// update a dish
const updateDish = async (req, res) => {
    const {id} = req.params
    const updatedData = req.body
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    const dish = await Dish.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the dish exists
    if (!dish) {
        return res.status(400).json({
            error: 'dish not found'
        })
    }

    // return the updated dish
    res.status(200).json(dish)
}

const getCount = async(req, res) =>{
    try {
        const dishCount = await Dish.find({},{name:true,dishCount:true}).sort({createdAt: -1})
        res.status(200).json(dishCount)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

module.exports = {
    createDish,
    getDishes,
    getDish,
    deleteDish,
    updateDish,
    getCount
}
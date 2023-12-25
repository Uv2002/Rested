const Order = require('../models/orderModel')
const mongoose = require('mongoose')
const Dish = require('../models/dishModel')

// get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({createdAt: -1})
        res.status(200).json(orders)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one order
const getOrder = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({
                error: 'order not found'
            })
        }
        // return the order to the client
        res.status(200).json(order)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new order
const createOrder = async (req, res) => {
    const {title,
        creationDate,
        dishArray,
        specialNotes,
        customerID,
        tableID} = req.body
    // try to create a new order. add to db
    try {
        const newOrder = await Order.create({
            title,
    creationDate,
    dishArray,
    specialNotes,
    customerID,
    tableID
        });
        res.status(200).json(newOrder)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete an order
const deleteOrder = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // // find the order to decrease the dish count
    // const dborder = await Order.findById(id);
    // for(let i = 0; i < dborder.dishArray.length; i++){
    //     const dishid = dborder.dishArray[i];
    //     const update = await Dish.findById(dishid);
    //     update.dishCount = update.dishCount - 1;
    //     await update.save();
    // }
    // try to delete the order
    const order = await Order.findByIdAndDelete({_id: id})
    if (!order) {
        return res.status(400).json({
            error: 'order not found'
        })
    }

    res.status(200).json({
        msg: 'order deleted'
    })
}

// update an order
const updateOrder = async (req, res) => {
    const {id} = req.params;
    const updatedData = req.body;
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // comparing the order with the database order to update another feild in the database
    const dborder = await Order.findById(id);
    if( dborder.dishArray.length != updatedData.dishArray.length){
        if(dborder.dishArray.length < updatedData.dishArray.length){
            const dishid = updatedData.dishArray[updatedData.dishArray.length - 1]
            const update = await Dish.findById(dishid);
            update.dishCount = update.dishCount + 1;
            await update.save();
        }
        // }else {
        //     var i=dborder.dishArray.length;
        //     while(i > 0){
        //         let element = dborder.dishArray.shift();
        //         if(!updatedData.dishArray.includes(element)){
        //             const update = await Dish.findById(element);
        //             update.dishCount = update.dishCount - 1;
        //             await update.save();
        //         }
        //         i--;
        //     }
        // }
    } 

    const order = await Order.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the order exists
    if (!order) {
        return res.status(400).json({
            error: 'order not found'
        })
    }
    res.status(200).json(order)
}


module.exports = {
    createOrder,
    getOrders,
    getOrder,
    deleteOrder,
    updateOrder
}
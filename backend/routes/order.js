const express = require('express')
const router = express.Router()

const { 
    createOrder,
    getOrders,
    getOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/orderController')

// GET all of the orders status
router.get('/', getOrders)

// GET an single order status
router.get('/:id', getOrder)

// POST a new order
router.post('/', createOrder)

// DELETE an order
router.delete('/:id', deleteOrder)

// UPDATE an order
router.patch('/:id', updateOrder)

// any other routes we need for the map...


module.exports = router
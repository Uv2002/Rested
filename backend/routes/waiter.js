const express = require('express')
const router = express.Router()
const { 
    createWaiter,
    getWaiter,
    getWaiters,
    deleteWaiter,
    updateWaiter
} = require('../controllers/waiterController')

// GET all of liszt of waiter
router.get('/', getWaiters)

// GET a single waiter
router.get('/:id', getWaiter)

// POST a new info for waiter
router.post('/', createWaiter)

// DELETE a waiter
router.delete('/:id', deleteWaiter)

// UPDATE a info for waiter
router.patch('/:id', updateWaiter)




module.exports = router
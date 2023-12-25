const express = require('express')
const router = express.Router()
const { 
    createCustomer,
    getCustomers,
    getCustomer,
    deleteCustomer,
    updateCustomer
 } = require('../controllers/customerController')

// GET all of the Customers status
router.get('/', getCustomers)

// GET a single Customer status
router.get('/:id', getCustomer)

// POST a new Customer
router.post('/', createCustomer)

// DELETE a Customer
router.delete('/:id', deleteCustomer)

// UPDATE a Customer
router.patch('/:id', updateCustomer)


module.exports = router
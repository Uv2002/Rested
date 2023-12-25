const express = require('express')
const router = express.Router()
const { 
    createEmployee,
    getEmployees,
    getEmployee,
    deleteEmployee,
    updateEmployee
} = require('../controllers/employeeController')

// GET all of the Employees status
router.get('/', getEmployees)

// GET a single Employee status
router.get('/:id', getEmployee)

// POST a new Employee
router.post('/', createEmployee)

// DELETE a Employee
router.delete('/:id', deleteEmployee)

// UPDATE a Employee
router.patch('/:id', updateEmployee)


module.exports = router
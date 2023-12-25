const Employee = require('../models/employeeModel')
const mongoose = require('mongoose')

// get all employees
const getEmployees = async (req ,res) => {
    try {
        const employees = await Employee.find({}).sort({createdAt: -1})
        res.status(200).json(employees)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one Employee
const getEmployee = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const employee = await Employee.findById(id)
        if (!employee) {
            return res.status(404).json({
                error: 'order not found'
            })
        }
        // return theEmployees to the client
        res.status(200).json(employee)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new Employee
const createEmployee = async (req, res) => {
    const { name, SIN, address, phoneNumber, email, position, timeIn, timeOut, clockedIn } = req.body;
    // try to create a new order. add to db
    try {
        const newEmployee = await Employee.create({
            name, SIN, address, phoneNumber, email, position, timeIn, timeOut, clockedIn,
        })
        res.status(200).json(newEmployee)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete an Employee
const deleteEmployee = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to delete the Employee
    const employees = await Employee.findByIdAndDelete({_id: id})
    if (!employees) {
        return res.status(400).json({
            error: 'Employees not found'
        })
    }

    res.status(200).json({
        msg: 'Employees deleted'
    })
}

// update an Employee
const updateEmployee = async (req, res) => {
    const {id} = req.params
    const updatedData = req.body

    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    const employees = await Employee.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the Employees exists
    if (!employees) {
        return res.status(400).json({
            error: 'Employees not found'
        })
    }

    // return the updated Employees
    res.status(200).json(employees)
}


module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    deleteEmployee,
    updateEmployee
}
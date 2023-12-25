const express = require('express')
const router = express.Router()
const { 
    createTable,
    getTables,
    getTable,
    deleteTable,
    updateTable,
    getCount
} = require('../controllers/tableController')

// GET all of the tables status
router.get('/', getTables)

// GET a single table status
router.get('/singletable/:id', getTable)

// POST a new table
router.post('/', createTable)

// DELETE a table
router.delete('/:id', deleteTable)

// UPDATE a table
router.patch('/:id', updateTable)

// Get the Count of each table assigned number of times
router.get('/getCount',getCount)


module.exports = router
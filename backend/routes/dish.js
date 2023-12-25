const express = require('express')
const router = express.Router()

const { 
    createDish,
    getDishes,
    getDish,
    deleteDish,
    updateDish,
    getCount
} = require('../controllers/dishController')

// GET all of the dishes status
router.get('/', getDishes)

// GET an single dish status
router.get('/singledish/:id', getDish)

// POST a new dish
router.post('/', createDish)

// DELETE an dish
router.delete('/:id', deleteDish)

// UPDATE an dish
router.patch('/:id', updateDish)

// Get the Count of dishes
router.get('/getCount',getCount)

module.exports = router
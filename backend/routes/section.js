const express = require('express')
const router = express.Router()
const { 
    createsection,
    getsections,
    getsection,
    deletesection,
    updatesection
 } = require('../controllers/sectionController')

// GET all of the section status
router.get('/', getsections)

// GET a single section status
router.get('/:id', getsection)

// POST a new section
router.post('/', createsection)

// DELETE a section
router.delete('/:id', deletesection)

// UPDATE a section
router.patch('/:id', updatesection)


module.exports = router
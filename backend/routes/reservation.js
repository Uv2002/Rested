const express = require('express')
const router = express.Router()
const { 
    createReservation,
    getReservations,
    getReservation,
    deleteReservation,
    updateReservation,
} = require('../controllers/reservationController')

// GET all of the reservation status
router.get('/', getReservations)

// GET a single reservation status
router.get('/:id', getReservation)

// POST a new reservation
router.post('/', createReservation)

// DELETE a reservation
router.delete('/:id', deleteReservation)

// UPDATE a section
router.patch('/:id', updateReservation)


module.exports = router
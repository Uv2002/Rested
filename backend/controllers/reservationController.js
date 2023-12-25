const Reservation = require('../models/reservationModel')
const mongoose = require('mongoose')

// get all reservations
const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({}).sort({createdAt: -1})
        res.status(200).json(reservations)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one reservation
const getReservation = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const reservation = await Reservation.findById(id)
        if (!reservation) {
            return res.status(404).json({
                error: 'reservation not found'
            })
        }
        
        res.status(200).json(reservation)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new Reservation
const createReservation = async (req, res) => {
    const {title, groupSize, reservationDate, tableID, customerName, customerPhone, customerEmail} = req.body
    // try to create a new reservation. add to db
    try {
        const newReservation = await Reservation.create({
            title, groupSize, reservationDate, tableID, customerName, customerPhone, customerEmail
        })
        res.status(200).json(newReservation)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete a Reservation
const deleteReservation = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to delete the reservation
    const reservation = await Reservation.findByIdAndDelete({_id: id})
    if (!reservation) {
        return res.status(400).json({
            error: 'reservation not found'
        })
    }

    res.status(200).json({
        msg: 'reservation deleted'
    })
}

// update a Reservation
const updateReservation = async (req, res) => {
    const {id} = req.params
    const updatedData = req.body;

    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    const reservation = await Reservation.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the Reservation exists
    if (!reservation) {
        return res.status(400).json({
            error: 'reservation not found'
        })
    }

    // return the updated reservation
    res.status(200).json(reservation)


}

module.exports = {
    createReservation,
    getReservations,
    getReservation,
    deleteReservation,
    updateReservation
}
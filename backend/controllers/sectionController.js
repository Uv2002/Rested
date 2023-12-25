const Section = require('../models/sectionModel')
const mongoose = require('mongoose')

// get all Sections
const getsections = async (req, res) => {
    try {
        const section = await Section.find({}).sort({createdAt: -1})
        res.status(200).json(section)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one Section
const getsection = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const section = await Section.findById(id)
        if (!section) {
            return res.status(404).json({
                error: 'server not found'
            })
        }
        
        res.status(200).json(section)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new Section
const createsection = async (req, res) => {
    const {sectionTitle,
        listOfTables,
        numberOfTable,
        totalNumberOfseats,
        specialNotes,
        isOpened,} = req.body
    // try to create a new Section. add to db
    try {
        const newsection = await Section.create({
            sectionTitle,
            listOfTables,
            numberOfTable,
            totalNumberOfseats,
            specialNotes,
            isOpened,
        })
        res.status(200).json(newsection)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete a Section
const deletesection = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to delete the Section
    const section = await Section.findByIdAndDelete({_id: id})
    if (!section) {
        return res.status(400).json({
            error: 'Section not found'
        })
    }

    res.status(200).json({
        msg: 'Section deleted'
    })
}

// update a Section
const updatesection = async (req, res) => {
    const {id} = req.params
    const updatedData = req.body

    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    const section = await Section.findOneAndUpdate({_id: id}, updatedData, { new: true})
    // make sure the Section exists
    if (!section) {
        return res.status(400).json({
            error: 'Section not found'
        })
    }

    // return the updated Section
    res.status(200).json(section)


}


module.exports = {
    createsection,
    getsections,
    getsection,
    deletesection,
    updatesection
}
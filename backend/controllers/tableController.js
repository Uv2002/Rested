const Table = require('../models/tableModel')
const Section = require('../models/sectionModel')
const mongoose = require('mongoose')

// get all tables
const getTables = async (req, res) => {
    try {
        const tables = await Table.find({}).sort({createdAt: -1})
        res.status(200).json(tables)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// get one table
const getTable = async (req, res) => {

    try {
        const {id} = req.params

        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }

        // search for the id in the db
        const table = await Table.findById(id)
        if (!table) {
            return res.status(404).json({
                error: 'table not found'
            })
        }
        // return the table to the client
        res.status(200).json(table)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// create a new Table
const createTable = async (req, res) => {
    const {transform, title,  seatsNumber, isOccupied, isReserved, isClean, orderArray, customerID, peopleAssigned, totalPeopleAssigned, totalAssignedTimes} = req.body
    // try to create a new table. add to db
    try {
        const newTable = await Table.create({
            transform, title,  seatsNumber, isOccupied, isReserved, isClean, orderArray, peopleAssigned, customerID, totalPeopleAssigned, totalAssignedTimes   
        })
        res.status(200).json(newTable)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

// delete a table
const deleteTable = async (req, res) => {
    const {id} = req.params
    // check if its a valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            error: 'invalid id'
        })
    }

    // try to delete the table
    const table = await Table.findByIdAndDelete({_id: id})
    if (!table) {
        return res.status(400).json({
            error: 'table not found'
        })
    }

    // if we removed a table from the database we need to recalculate the values for the section
    if (table.section) {
        const section = await Section.findById(table.section);
        if (!section) {
            return res.status(400).json({
                error: 'section not found'
            })
        } 
        // if the section does exist, we need to remove the table from the section
        // remove the table from the section

        
        section.listOfTables = section.listOfTables.filter(tableId => tableId.toString() !== table._id.toString());

        // ******* Recalculate all the values for the section *******

        // Calculate the total number of seats in the section
        let totalSeats = 0;
        for (const tableId of section.listOfTables) {
            const table = await Table.findById(tableId);
            if (!table) continue; // hotfix for when a table is deleted from the database but not from the section
            totalSeats += table.seatsNumber;
        }
        // Update the number of tables in the section
        section.totalNumberOfseats = totalSeats;

        // Calculate the total number of tables in the section
        const numberOfTables = section.listOfTables.length;
        if (numberOfTables === 0) section.isOpened = false;
        section.numberOfTable = numberOfTables;
        
        // Save the updated section back to the database
        await section.save();

    }

    res.status(200).json({
        msg: 'table deleted'
    })
}

// update a table
const updateTable = async (req, res) => {
    try {
        const {id} = req.params
        const updatedData = req.body;
    
        // check if its a valid id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                error: 'invalid id'
            })
        }
    
        const table = await Table.findOneAndUpdate({_id: id}, updatedData, { new: true})
        // make sure the table exists
        if (!table) {
            return res.status(400).json({
                error: 'table not found'
            })
        }
    
        // If we added the table to a section we need to add the table id to the list of tables in the section
        if (updatedData.section) {
            const section = await Section.findById(updatedData.section);
            if (!section) {
                res.status(400).json({
                    error: 'section not found'
                })
            } else {
              // if the section does exist, we need to add the table to the section
              // add the table to the section

            // first check if already pushed to the section
            if (!section.listOfTables.includes(table._id)) {
                section.listOfTables.push(table._id);
            }

        
            //Check that there is no duplicate table in the section in the listOfTables
            section.listOfTables = [...new Set(section.listOfTables)];
    
            }
    
            // ******* Recalculate all the values for the section *******
    
            try {
                // Calculate the total number of seats in the section
                let totalSeats = 0;
                
                for (const tableId of section.listOfTables) {
                    const table = await Table.findById(tableId);
                    if (!table) continue; // hotfix for when a table is deleted from the database but not from the section
                    totalSeats += table.seatsNumber;
                }

                // Update the number of tables in the section
                section.totalNumberOfseats = totalSeats;
        
                // Calculate the total number of tables in the section
                const numberOfTables = section.listOfTables.length;
                if (numberOfTables === 0) section.isOpened = false;
                section.numberOfTable = numberOfTables;
                
                // Save the updated section back to the database
                await section.save();
            } catch (err) {
                res.status(400).json({
                    error: 'no list of tables found'
                })
            }
        }
    
        // return the updated table
        res.status(200).json(table)
    } catch (err) {
        res.status(500).json({
            error: 'internal server error',
            err: err.message
        })
    }

}

const getCount = async(req, res) =>{
    try {
        const tableAssignCount = await Table.find({},{title:true,totalAssignedTimes:true}).sort({createdAt: -1})
        res.status(200).json(tableAssignCount)
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'internal server error',
            err: err.message
        })
    }
}

module.exports = {
    createTable,
    getTables,
    getTable,
    deleteTable,
    updateTable,
    getCount
}
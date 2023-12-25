// Importing dependencies
const mongoose = require('mongoose');
const Table = require('../models/tableModel'); // To be modified
/**
 * Update the table metrics to track the total time assigned and total number of people assigned
 * @param {number} CustomerGroupSize: The size of the customer group
 * @param {string} TableID: The ID of the table to update
 * @throws {Error} When there is an issue with database operations
 */
async function updateTableMetric(CustomerGroupSize, TableID) {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find the table by its ID
        const table = await Table.findById(TableID);

        if (!table) {
            throw new Error('Table not found');
        }

        // Update the table metrics
        table.totalTimeAssigned += 1; 
        table.totalPeopleAssigned += CustomerGroupSize; 

        // Save the updated table document
        await table.save();

        console.log('Table metrics updated successfully');
    } catch (error) {
        console.error('Error while updating table metrics: ', error);
        throw error; // Rethrow error to handle appropriately
    } finally {
        // Close the database connection
        //mongoose.connection.close();
    }
}

module.exports = updateTableMetric;
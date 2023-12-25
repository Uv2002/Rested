//Importing dependencies
const mongoose = require('mongoose');
const findAvailableTables = require('./findAvailableTables'); 

// const dbURI =  "mongodb+srv://cmpt370group33:wr5iUACzlVwqOjTk@cmpt370.wwdgyfu.mongodb.net/?retryWrites=true&w=majority";
// mongoose.connect(dbURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

/**
 * Seating customer in a table
 * @param {number} groupSize: The # of people in the group
 * @returns {Object | null}: A table if available, or null if none available
 * @throws {Error}: When there is an issue with seating 
 */
const seatCustomers = async (req, res) => {
    try {
        const groupSize = req.body.groupSize; // Assuming the groupSize is sent in the request body
        var availableTables = await findAvailableTables(groupSize);

        if (availableTables.length > 0) {
            var selectedTable = availableTables[0];

            // Update table occupation in the database
            selectedTable.isOccupied = true;
            selectedTable.totalPeopleAssigned += groupSize;
            selectedTable.peopleAssigned = groupSize;
            selectedTable.totalAssignedTimes += 1;
            await selectedTable.save(); 
            console.log("\nASSIGN THIS TABLE:\n", selectedTable);

            // Respond with the assigned table
            res.status(200).json(selectedTable);
        } else {
            // When no tables are available
            console.log('No table available!');
            res.status(404).json({ error: 'No table available for the given group size.' });
        }
    } catch (error) {
        console.error('Error while seating customers: ', error);
        res.status(500).json({ error: 'Error while seating customers.' });
    } finally {
        // Closing the database connection
        //mongoose.connection.close();
    }
};

// Uncomment below and const dbURL above, then this file could be tested in terminal as 'node seatCustomers.js'

// const req = {
//     body: {
//         groupSize: 4
//     }
// };
// const res = {
//     status: (statusCode) => ({
//         json: (data) => console.log(`Response Status ${statusCode}:`, data),
//     }),
// };
// seatCustomers(req, res);
module.exports = seatCustomers;

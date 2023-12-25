const mongoose = require('mongoose');
const Table = require('../models/tableModel');
const Section = require('../models/sectionModel');

// const dbURI =  "mongodb+srv://cmpt370group33:wr5iUACzlVwqOjTk@cmpt370.wwdgyfu.mongodb.net/?retryWrites=true&w=majority";
// mongoose.connect(dbURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


/**
 * Find tables with seat capacity equal to or greater than the group size in 
 * the emptiest section.
 *
 * @param {number} groupSize - The size of the customer group.
 * @returns {Array} - An array of tables that meet the criteria in the emptiest 
 * section, the array is sort based on table's seats.
 */
async function findAvailableTables(groupSize) {
    try {
        var maxAvailableTablesGeqGS = 0;
        var maxAvailableTables = 0;
        var tablesInEmptiestSection = [];

        let openSections = await Section.find({ isOpened: true });
        //console.log(openSections);

        // Loop through all the openning sections 
        for (var section of openSections) {
            // Get the list of table IDs in a section
            var tableIds = section.listOfTables;

            // Get the list of open tables in a section that could accommodate 
            // group size
            var openTablesGeqGS = await Table.find({
                _id: { $in: tableIds },
                isOccupied: false,
                isReserved: false,
                isClean: true,
                'seatsNumber': { $gte: groupSize }
            }).sort({ seatsNumber: 1 }) ;
            
            var allOpenTables = await Table.find({
                _id: { $in: tableIds },
                isOccupied: false,
                isReserved: false,
                isClean: true
            });
            
            // Find emptiest section
            if (openTablesGeqGS.length >= maxAvailableTablesGeqGS && allOpenTables.length >= maxAvailableTables) {
                maxAvailableTablesGeqGS = openTablesGeqGS.length;
                maxAvailableTables = allOpenTables.length;
                tablesInEmptiestSection = openTablesGeqGS;
            }
        }
        // If all sections have the same emptiness, the tables in the last 
        // section is chosen.
        console.log("\nLIST OF AVAILABLE TABLES\n",tablesInEmptiestSection);
        return tablesInEmptiestSection;
    } catch (error) {
        console.error('Error while finding available tables: ', error);
        throw error; // Rethrow error to handle appropriately
    } finally {
        //Closing the database connection
        //mongoose.connection.close();
    }
}
module.exports = findAvailableTables;
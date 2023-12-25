// Importing dependencies
const mongoose = require('mongoose');
const Order = require('../models/orderModel'); // To be modified

/**
 * Update the order metrics to track the total time a dish on the menu got orders
 * @param {string} dishID: The ID of the dish to update
 * @throws {Error} When there is an issue with database operations
 */
async function updateOrderMetric(dishID) {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Find orders that include the specified dish
        const orders = await Order.find({ dish: dishID });

        // Calculate the total time the dish got orders
        let totalTimeOrdered = 0;
        const currentTime = new Date();

        for (const order of orders) {
            const orderTime = order.orderTime;
            const orderDuration = currentTime - orderTime;
            totalTimeOrdered += orderDuration;
        }

        // Update the dish's total time ordered
        const dish = await Dish.findById(dishID);
        dish.totalTimeOrdered = totalTimeOrdered;

        // Save the updated dish document
        await dish.save();

        console.log('Dish metrics updated successfully');
    } catch (error) {
        console.error('Error while updating dish metrics: ', error);
        throw error; // Rethrow error to handle appropriately
    } finally {
        // Close the database connection
        //mongoose.connection.close();
    }
}

module.exports = updateOrderMetric;

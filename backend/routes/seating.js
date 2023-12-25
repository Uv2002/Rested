const express = require('express');
const router = express.Router();
const seatCustomers = require('../controllers/seatCustomers.js');

// Defining the seating endpoint
router.post('/', async (req, res) => {
    // The code  here was redundant, the actual function is in backend/controllers/seatCustomers.js
    await seatCustomers(req, res);
});

module.exports = router; 
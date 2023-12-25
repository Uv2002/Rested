const express = require('express')
const router = express.Router()

// GET all of the Map status
router.get('/', (req, res) => {
    res.json({
        msg: 'GET map'
    })
})

// GET a single section of the map status
router.get('/:id', (req, res) => {
    res.json({
        msg: 'GET a single section of the map'
    })
})

// any other routes we need for the map...


module.exports = router
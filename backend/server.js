
require('dotenv').config({path: './config.env'})
const express = require('express')
const mongoose = require('mongoose')
const mapRoutes = require('./routes/map')
const tableRoutes = require('./routes/table')
const customerRoutes = require('./routes/customer')
const serverRoutes = require('./routes/waiter')
const sectionRoutes = require('./routes/section')
const employeeRoutes = require('./routes/employee')
const orderRoutes = require('./routes/order')
const dishRoutes = require('./routes/dish')
const reservationRoutes = require('./routes/reservation')
const seatingRoutes = require('./routes/seating'); 

// express app
const app = express()

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes for the map. Found in ./routes/map.js
app.use('/api/map', mapRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/customer',customerRoutes)
app.use('/api/server',serverRoutes)
app.use('/api/section',sectionRoutes)
app.use('/api/employees',employeeRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/dish', dishRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/seating', seatingRoutes);
// connect to db;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })  
    })
    .catch(err => {
        console.log(err)
    })


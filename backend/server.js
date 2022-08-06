const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require('./config/db')
const {errorHandler} = require("./middleware/errorHandler")
const sendSMS = require("./services/sendSMS")

const PORT = process.env.PORT || 5000
const app = express()

// Connect to DB
connectDB()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// sendSMS()
app.use('/api/users', require('./routes/user'))
app.use('/api/ncc', require('./routes/ncc'))

// custom error handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))


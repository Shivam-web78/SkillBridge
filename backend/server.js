require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const studentRoutes = require('./routes/student')
const industryRoutes = require('./routes/industry')
const adminRoutes = require('./routes/admin')
const sharedRoutes = require('./routes/shared')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'skillbridge-backend' }))

app.use('/api/auth', authRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/industry', industryRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/shared', sharedRoutes)

// Central error handler - catches anything thrown/rejected inside route
// handlers that wasn't already caught (e.g. a Mongoose CastError from
// a malformed ObjectId).
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' })
})

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }))

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`SkillBridge backend running on port ${PORT}`))
})

module.exports = app

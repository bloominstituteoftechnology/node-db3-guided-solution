const express = require('express')

const userRouter = require('./users/user-router.js')

const server = express()

server.use(express.json())
server.use('/api/users', userRouter)
server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = server

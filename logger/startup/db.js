const mongoose = require('mongoose')
const { S3logger, logger } = require('../helpers/logger')
require('dotenv').config()
const logInfo = {
  file: 'startup/db.js'
}

try {
  mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoCreate: true,
      serverApi: mongoose.mongo.ServerApiVersion.v1
    }
  )
  logInfo.servicename = 'logger'
  logInfo.line = 17
  logInfo.clientInfo = 'logger mongoose'
  logInfo.logdata = '[+] mongoose connected'
  logInfo.type = 'info'
  logger(logInfo)
}catch (e) {
  logInfo.servicename = 'logger'
  logInfo.line=24
  logInfo.clientInfo = 'logger mongoose'
  logInfo.logdata = e.message
  logInfo.type = 'error'
  S3logger(logInfo)
}



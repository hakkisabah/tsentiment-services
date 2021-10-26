const mongoose = require('mongoose')
const { logger } = require('../helpers/logger')
const logInfo = {
  servicename : 'db',
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
  logInfo.line = 17
  logInfo.clientInfo = 'db server'
  logInfo.logdata = '[+] mongoose connected'
  logInfo.type = 'info'
  logger(logInfo)
}catch (e) {
  console.log('mongo connect error >',e)
  logInfo.line = 23
  logInfo.clientInfo = 'db server'
  logInfo.logdata = e.message
  logInfo.type = 'error'
  logger(logInfo)
}



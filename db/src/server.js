const { logger } = require('../helpers/logger')
const express = require('express')
const app = express()
const logInfo = {
  file: 'src/server.js'
}
try {
  /* Setup the logger */
  require('../helpers/logger')

  /* Connect DB */
  require('../startup/db')

  require('../startup/setupExpress')(app)
  require('../startup/routes')(app)

  logInfo.servicename = 'db'
  logInfo.line = 18
  logInfo.clientInfo = 'db server'
  logInfo.logdata = 'db server started'
  logInfo.type = 'info'
  logger(logInfo)
}catch (e) {
  logInfo.servicename = 'db'
  logInfo.line = 25
  logInfo.clientInfo = 'db server'
  logInfo.logdata = e
  logInfo.type = 'error'
  logger(logInfo)
}

module.exports = app
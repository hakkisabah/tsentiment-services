const axios = require('axios')
const oauthLogInfo = {
  servicename: 'db',
  file: 'helpers/logger.js',
  clientInfo: 'db server',
  type: 'error'
}
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.LOG_SERVICE_TOKEN}`
}
const logger = async (data) => {
  await axios.post(`${process.env.LOG_SERVER_URL}`, data, { headers })
}

/* Catch unhandledRejection and  uncaughtExceptions */
process.on('unhandledRejection', (err) => {
  oauthLogInfo.line = 19
  oauthLogInfo.logdata = err
  logger(oauthLogInfo)
})
process.on('uncaughtException', (err) => {
  oauthLogInfo.line = 24
  oauthLogInfo.logdata = err
  logger(oauthLogInfo)
})

exports.logger = logger
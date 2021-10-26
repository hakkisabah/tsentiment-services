const axios = require('axios')
const oauthLogInfo = {
  servicename: 'oauth',
  file: 'helpers/logger.js',
  clientInfo: 'oauth server',
  type: 'error'
}
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.LOG_SERVICE_TOKEN}`
}
const logger = async (data) => {
  try {
    await axios.post(`${process.env.LOG_SERVER_URL}`, data, { headers })
  }catch (e) {
    console.log('logger err >',e)
    throw e
  }
}

/* Catch unhandledRejection and  uncaughtExceptions */
process.on('unhandledRejection', (err) => {
  oauthLogInfo.line = 20
  oauthLogInfo.logdata = err
  logger(oauthLogInfo)
})
process.on('uncaughtException', (err) => {
  oauthLogInfo.line = 25
  oauthLogInfo.logdata = err
  logger(oauthLogInfo)
})

exports.logger = logger
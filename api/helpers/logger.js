const axios = require('axios')
const oauthLogInfo = {
  servicename: 'api',
  file: 'helpers/logger.js',
  clientInfo: 'api server',
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
  oauthLogInfo.line = 12
  oauthLogInfo.logdata = err
  logger(oauthLogInfo)
})
process.on('uncaughtException', (err) => {
  oauthLogInfo.line = 19
  oauthLogInfo.logdata = err
  logger(oauthLogInfo)
})

exports.logger = logger
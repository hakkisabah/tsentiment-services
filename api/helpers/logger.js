const axios = require('axios')
const apiLogInfo = {
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
    await axios.post(`${process.env.LOG_SERVER_URL}`, !data ? {} : data , { headers })
  }catch (e) {
    console.log('logger err >',e)
    throw e
  }

}

/* Catch unhandledRejection and  uncaughtExceptions */
process.on('unhandledRejection', (err) => {
  apiLogInfo.line = 12
  apiLogInfo.logdata = err
  logger(apiLogInfo)
})
process.on('uncaughtException', (err) => {
  apiLogInfo.line = 19
  apiLogInfo.logdata = err
  logger(apiLogInfo)
})

exports.logger = logger
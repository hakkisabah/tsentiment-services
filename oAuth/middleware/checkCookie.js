const axios = require('axios')
const logInfo = {
  servicename: 'oauth',
  file: 'middleware/checkCookie.js'
}

exports.checkCookie = async (request, response, next) => {
  const cookie = request.token
  if (cookie === undefined || cookie === 'undefined' || cookie === 'null' || cookie === '0' || cookie === 0) {
    return next()
  } else {
    logInfo.line = 14
    logInfo.clientInfo = 'unknown'
    logInfo.logdata = 'wrong endpoint'
    return response.sendError('wrong endpoint', 422, logInfo)
  }

}
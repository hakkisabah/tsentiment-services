const jwt = require('jsonwebtoken')
require('dotenv').config()
const logInfo = {
  servicename: 'logger',
  file: 'helpers/checkCookie'
}
// Next Future :
// Its will be need next version for web services logging.
exports.checkCookie = async (request, response, next) => {
  const cookie = request.token
  console.log(cookie)
  if (cookie === 'undefined' || cookie === 'null' || cookie === '0') {
    logInfo.line = 12
    logInfo.clientInfo = {ip:request.clietnIp,user:request.useragent}
    logInfo.logdata = 'request cookie hast not verified'
    return response.sendError('Cookie has not verified', 406, logInfo)
  }
  try {
    jwt.verify(cookie, process.env.JWT_SECRET)
    return next()
  }catch (e) {
    logInfo.line = 21
    logInfo.clientInfo = {ip:request.clietnIp,user:request.useragent}
    logInfo.logdata = 'request cookie hast not verified'
    return response.sendError('Cookie has not verified', 406, logInfo)
  }
}
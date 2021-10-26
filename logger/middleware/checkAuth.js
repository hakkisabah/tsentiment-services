const { propChecker } = require('../utils/checker')
const apiTokens = [
  process.env.API_SERVICE_TOKEN,
  process.env.OAUTH_SERVICE_TOKEN,
  process.env.WEB_SERVICE_TOKEN,
  process.env.DB_SERVICE_TOKEN
]
const loggerInfo = {
  file: 'middleware/checkAuth.js'
}
exports.checkAuth = async (request, response, next) => {
  try {
    const isFalsy = propChecker(request)
    if (isFalsy.falsyRequest) {
      return response.sendError('Parameter error', 400, isFalsy.falsyRequest)
    }
    const findedApiToken = apiTokens.some(token => token === request.token)
    if (findedApiToken) {
      return next()
    } else {
      const logInfo = {
        servicename: request.body.servicename,
        file: request.body.file,
        line: request.body.line,
        clientInfo: request.body.clientInfo,
        logdata: request.body.logdata,
        type: 'error'
      }
      return response.sendError('Need Auth', 401, logInfo)
    }
  } catch (e) {
    loggerInfo.line = 23
    loggerInfo.servicename = 'logger'
    loggerInfo.logdata = e
    loggerInfo.type = 'critical'
    return response.sendError(`tsentiment log service given an error currently`, 500, loggerInfo)
  }
}
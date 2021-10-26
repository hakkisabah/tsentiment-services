const apiTokens = [
  process.env.API_SERVICE_TOKEN,
  process.env.OAUTH_SERVICE_TOKEN,
  process.env.LOG_SERVICE_TOKEN,
]
const loggerInfo = {
  file: 'middleware/checkAuth.js'
}
exports.checkAuth = async (request, response, next) => {
  try {
    const authToken = request.token
    const findedApiToken = apiTokens.some(token => token === authToken)
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
    loggerInfo.line = 27
    loggerInfo.servicename = 'logger'
    loggerInfo.logdata = e
    loggerInfo.type = 'critical'
    return response.sendError(`tsentiment log service given an error currently`, 500, loggerInfo)
  }
}
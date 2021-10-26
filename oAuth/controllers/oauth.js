const jwt = require('jsonwebtoken')
const oAuthlogInfo = {
  servicename: 'oauth',
  file: 'controllers/oauth'
}
exports.oAuth = (request, response) => {
  try {
    return request.oa.getOAuthRequestToken(function(error, oAuthToken, oAuthTokenSecret, results) {
      oAuthlogInfo.logdata = results
      results.oAuthTokenSecret = oAuthTokenSecret
      results.oAuthToken = oAuthToken
      oAuthlogInfo.line = 12
      oAuthlogInfo.clientInfo = 'oAuth server'
      oAuthlogInfo.type = 'info'
      results.cookie = jwt.sign(results, process.env.JWT_SECRET)
      return response.sendData(results, oAuthlogInfo)
    })
  } catch (e) {
    oAuthlogInfo.line = 19
    oAuthlogInfo.clientInfo = 'oAuth server'
    oAuthlogInfo.logdata = e
    oAuthlogInfo.type = 'error'
    return response.sendError('tsentiment or twitter services has an a error', 500, oAuthlogInfo)
  }
}
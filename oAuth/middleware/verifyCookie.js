const jwt = require('jsonwebtoken')
const { getUserTokens } = require('../helpers/getusertokens')
const logInfo = {
  servicename: 'oauth',
  file: 'middleware/verifyCookie.js'
}
exports.verifyCookie = async (request,response,next)=>{
  try {
    const cookie = request.token
    request.verifiedCookie = await jwt.verify(cookie,process.env.JWT_SECRET)
    const user_id = request.verifiedCookie.user_id
    const userTokens = await getUserTokens(user_id)
    request.currentAuthData = {
      user_id,
      user_twitter_access_token: userTokens.user_access_token,
      user_twitter_access_token_secret: userTokens.user_access_token_secret
    }
    return next()
  }catch (e) {
    logInfo.line = 8
    logInfo.clientInfo = {}
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('cookie not verifed',406,logInfo)
  }

}
const { rateLimitTimeChecker } = require('../utils/checker')
const { getRedis } = require('../helpers/redis')

const logInfo = {
  servicename: 'api',
  file: 'middleware/checkAuth.js'
}
const rateLogic = async (request, userId) => {
  try {
    const userRateLimit = await rateLimitTimeChecker(request, userId)
    if (userRateLimit) {
      request.rateLimit = userRateLimit
      return true
    } else {
      return false
    }
  }catch (e) {
    throw e;
  }

}
exports.apiCheck = async (request, response, next) => {
  try {
    const findedUserId = await getRedis(request.token)
    if (findedUserId) {
      const user_id = findedUserId
      const user_access_token = await getRedis(`${user_id}_twitter_access_token`)
      const user_access_token_secret = await getRedis(`${user_id}_twitter_access_token_secret`)
      request.currentAuthData = {
        user_id,
        user_twitter_access_token: user_access_token,
        user_twitter_access_token_secret: user_access_token_secret
      }
      const isRate = await rateLogic(request, user_id)
      if (isRate) {
        return next()
      } else {
        logInfo.line = 40
        logInfo.clientInfo = user_id
        logInfo.logdata = 'Too many request'
        logInfo.type = 'error'
        return response.sendError('Too Many Requests ', 429, logInfo)
      }
    } else {
      logInfo.line = 47
      logInfo.logdata = 'Need Auth'
      logInfo.type = 'error'
      return response.sendError('Need Twitter Auth ', 406, logInfo)
    }
  } catch (e) {
    logInfo.line = 53
    logInfo.logdata = e
    logInfo.type = 'critical'
    return response.sendError('Api server error ', 500, logInfo)
  }

}
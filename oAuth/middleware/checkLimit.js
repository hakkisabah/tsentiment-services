const { rateLimitTimeChecker } = require('../utils/checker')
const redisCG = require('../controllers/redisprocess')
const logInfo = {
  servicename:'oauth',
  file: 'middleware/checkAuth.js'
}
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.DB_SERVICE_TOKEN}`
}
const rateLogic = async (request, userId) => {
  const userRateLimit = await rateLimitTimeChecker(request, userId)
  if (userRateLimit) {
    await redisCG.updateRateLimit(userId, userRateLimit)
    return true
  } else {
    return false
  }
}
// Next Future :
// It will be use web service
exports.userLimitCheck = async (request, response, next) => {
  // request.verifiedCookie get from verifyCookie middleware, it means if any web user want to web analyze before check with this function
    const isRate = await rateLogic(request, user_id)
    if (isRate) {
      return next()
    } else {
      logInfo.line = 33
      logInfo.clientInfo = {user:user_id}
      logInfo.logdata = 'Too many request'
      logInfo.type = 'error'
      return response.sendError('Too Many Requests 1', 429, logInfo)
    }
}
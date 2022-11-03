const { rateLimitChecker } = require('../utils/checker')
const { getUser, setUser } = require('../helpers/user')
const reducedTweetQty = +process.env.REDUCED_REQUEST_QTY
// userRateLimit will be required, and it has to know because it's provided from Twitter API.
const userRateLimit = +process.env.TWITTER_TOTAL_USER_REQUEST_RATE_LIMIT

const logInfo = {
  servicename: 'api',
  file: 'middleware/checkAuth.js'
}

const isReset = (reset) => ((Date.now() / 1000) - reset) >= 0
const getRates = async ({request, twitterAccessToken, twitterAccessTokenSecret}) => {
  return await rateLimitChecker(request, twitterAccessToken, twitterAccessTokenSecret)
}
const createTimer = (req) => {
  // aws api gateway limit 30 sec, and we need to have some time to finish the request
  // I think 25 sec is enough
  // Also, setTimeout is forbidden at lambda, so we need to check time to be sure that we will not get timeout
  req.apiTimeout = Date.now()
  req.apiTimeLimit = 20 * 1000
}
const userProcessConditions = async ({request, response, next}, userCache) => {
  // its most important to check if user is in process now because any error will be thrown and
  // user request  is will be blocked accidentally, so we need to check if user is in process now
  const remaningMinute = (Date.now().toString().slice(0,-3) - userCache.reset) // Date.now for twitter
  if (remaningMinute > 900){
    userCache.isProcessNow = true
    const { remaining, reset } = await getRates({ request, ...userCache })
    userCache.remaining = remaining
    userCache.reset = reset
    await setUser(userCache);
    request.currentAuthData = userCache
    return next();
  }
  if (!isReset(userCache.reset)){
    const remainedTime = new Date((userCache.reset * 1000) - Date.now())
    const resetTime = `${remainedTime.getMinutes() === 0 ? remainedTime.getSeconds() + 'seconds' : remainedTime.getMinutes() + 'minutes'}`;
    logInfo.line = 34
    logInfo.clientInfo = userCache.user_id
    logInfo.logdata = `Try ${resetTime} later`
    logInfo.type = 'error'
    userCache.isProcessNow = false
    await setUser(userCache);
    return response.sendError(`Try ${resetTime} later`, 409, logInfo)
  }
  logInfo.line = 34
  logInfo.clientInfo = userCache.user_id
  logInfo.logdata = 'User is processing now'
  logInfo.type = 'error'
  return response.sendError('User is processing now', 409, logInfo)
}
exports.apiCheck = async (request, response, next) => {
  request.apiTimeout = false
  const userCache = await getUser(request.token)
  try {
    if (userCache && userCache.isProcessNow) {
      return await userProcessConditions({request, response, next}, userCache)
    }
    if (userCache) {
      request.currentAuthData = userCache
      if (userCache.remaining > reducedTweetQty) {
        userCache.isProcessNow = true
        await setUser(userCache);
        createTimer(request)
        return next()
      } else {
        if (isReset(userCache.reset)) {
          const { remaining, reset } = await getRates({ request, ...userCache })
          userCache.remaining = remaining
          userCache.reset = reset
          userCache.isProcessNow = true
          createTimer(request)
          await setUser(userCache);
          request.currentAuthData = userCache
          return next()
        } else {
          logInfo.line = 77
          logInfo.clientInfo = userCache.user_id
          logInfo.logdata = request.query.nextId ? 'Limit has reached' : 'Too many request'
          logInfo.type = request.query.nextId ? 'warning' : 'error'
          userCache.isProcessNow = false
          await setUser(userCache);
          if (request.query.nextId) {
            return response.sendData({Tweets:[],msg:'Limit has reached'}, logInfo)
          }
          return response.sendError('Too Many Requests ', 429, logInfo)
        }
      }
    } else {
      logInfo.line = 47
      logInfo.logdata = 'Need Auth'
      logInfo.type = 'error'
      return response.sendError('Need Twitter Auth ', 406, logInfo)
    }
  } catch (e) {
    console.log("e",e)
    logInfo.line = 53
    logInfo.logdata = e
    logInfo.type = 'critical'
    userCache.isProcessNow = false
    await setUser(userCache);
    return response.sendError('Api server error ', 500, logInfo)
  }

}
const { getRedis } = require('../helpers/redis')
const { updateRateLimit } = require('../controllers/redisprocess')
const reducedTweetQty = process.env.REDUCED_REQUEST_QTY
const userRateLimit = process.env.TWITTER_TOTAL_USER_REQUEST_RATE_LIMIT

const getApiLimit = async (request) => {
  try {
    const checked = await rateLimitChecker(request,
      request.currentAuthData.user_twitter_access_token,
      request.currentAuthData.user_twitter_access_token_secret)
    return checked ? { remaining: checked.remaining, reset: checked.reset } : checked
  } catch (e) {
    throw e
  }

}

exports.rateLimitTimeChecker = async (request, userId) => {
  try {
    // slice last 3 number for twitter rate limit reset time equality
    const dateNow = +Date.now().toString().slice(0, -3)
    const userReset = await getRedis(`${userId}_reset`)
    const userRemain = await getRedis(`${userId}`)
    if (userRemain <= 0 && userReset >= dateNow) {
      return false
    }
    else if (userRemain > 0 && userReset >= dateNow) {
      return { remaining: userRemain, reset: userReset }
    }
    else if (userReset < dateNow) {
      const isLimit = await getApiLimit(request)
      if (isLimit.remaining === userRateLimit || isLimit.remaining > reducedTweetQty) {
        await updateRateLimit(userId,isLimit)
        return { remaining: isLimit.remaining - reducedTweetQty, reset: isLimit.reset }
      } else {
        return false
      }
    }
  } catch (e) {
    throw e
  }

}

const rateLimitChecker = async (request, oAuthAccessToken, oAuthAccessTokenSecret) => {
  try {
    return new Promise(resolve => {
      request.oa.get(`${process.env.TWITTER_RATE_LIMIT_API_URL}`,
        oAuthAccessToken,
        oAuthAccessTokenSecret,
        function(error, twitterResponseData, result) {
          const rateLimit = !error
            ? JSON.parse(twitterResponseData).resources.search['/search/tweets']
            : false
          resolve(rateLimit)
        })
    })
  } catch (e) {
    throw e
  }

}
exports.rateLimitChecker = rateLimitChecker
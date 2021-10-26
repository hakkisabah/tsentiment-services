const {getRedis}= require('../helpers/redis')

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
  // slice last 3 number for twitter rate limit reset time equality
  const dateNow = +Date.now().toString().slice(0, -3)
  const userReset = await getRedis(`${userId}_reset`)
  const userRemain = await getRedis(`${userId}`)
  // extraction to dateNow and we catch real reset time difference
  if (userRemain <= 0 && userReset >= dateNow) {
    return false
  } else if (userRemain > 0 && userReset >= dateNow) {
    return { remaining: userRemain, reset: userReset }
  } else if (userReset < dateNow) {
    const { remaining, reset } = await getApiLimit(request)
    if (remaining === userRateLimit || remaining > reducedTweetQty) {
      return { remaining: remaining - reducedTweetQty, reset: reset }
    } else {
      return false
    }
  }
}

const rateLimitChecker = async (request, oAuthAccessToken, oAuthAccessTokenSecret) => {
  return new Promise(resolve => {
    request.oa.get('https://api.twitter.com/1.1/application/rate_limit_status.json',
      oAuthAccessToken,
      oAuthAccessTokenSecret,
      function(error, twitterResponseData, result) {
        const rateLimit = !error
          ? JSON.parse(twitterResponseData).resources.search['/search/tweets']
          : false
        resolve(rateLimit)
      })
  })
}
exports.rateLimitChecker = rateLimitChecker
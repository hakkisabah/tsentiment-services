const { wordRule } = require('../utils/rule')
const redisCG = require('../controllers/redisprocess')
const { tweetFetcher } = require('../helpers/tweetFetcher')
const logInfo = {
  servicename: 'api',
  file: 'controllers/twitter.js'
}
exports.getTweet = async (request, response) => {
  if (!request.query.word) {
    logInfo.line = 10
    logInfo.logdata = 'user do not enter word query'
    logInfo.type = 'error'
    return response.sendError('Keyword must be type', 405, logInfo)
  }
  const searchWord = wordRule(request.query.word)
  if (searchWord === null) {
    logInfo.line = 17
    logInfo.logdata = 'search word not compliant with the rules'
    logInfo.type = 'error'
    return response.sendError('NOT ACCEPTABLE WORD PLEASE TRY ONLY ALPHANUMERIC ENTRY', 403, logInfo)
  }
  const { user_id } = request.currentAuthData
  const rateLimit = request.rateLimit
  request.searchWord = searchWord.input

  await tweetFetcher(request, response, async function(fetchedTweet, logInfo, error = false) {
    try {
      if (!fetchedTweet.statuses && error) {
        // adding remaining limit info for api response
        rateLimit.remaining = +rateLimit.remaining - 1
        fetchedTweet.remainingRateLimit = rateLimit.remaining
        await redisCG.updateRateLimit(user_id, rateLimit)
        logInfo.clientInfo = user_id
        logInfo.line = 34
        return response.sendError('Tweets currently do not fetched', fetchedTweet.error.statusCode, logInfo)
      }
      if (fetchedTweet.statuses.length < 1) {
        // adding remaining limit info for api response
        rateLimit.remaining = +rateLimit.remaining - 1
        await redisCG.updateRateLimit(user_id, rateLimit)
        logInfo.line = 39
        logInfo.clientInfo = user_id
        logInfo.logdata = 'not find any tweet data'
        logInfo.type = 'warning'
        return response.sendError('Not find any data', 404, logInfo)
      }
      // adding remaining limit info for api response
      rateLimit.remaining = +rateLimit.remaining - 1
      fetchedTweet.remainingRateLimit = +rateLimit.remaining
      await redisCG.updateRateLimit(user_id, rateLimit)
      logInfo.line = 46
      logInfo.clientInfo = user_id
      logInfo.logdata = 'user tweet fetch successful'
      logInfo.type = 'info'
      return response.sendData(fetchedTweet, logInfo)
    } catch (parseError) {
      rateLimit.remaining = +rateLimit.remaining - 1
      await redisCG.updateRateLimit(user_id, rateLimit)
      logInfo.line = 54
      logInfo.clientInfo = 'oAuth server'
      logInfo.logdata = 'oAuth seerver error'
      logInfo.type = 'critical'
      return response.sendError('tsentiment service given an error currently', 500, logInfo)
    }
  })
}
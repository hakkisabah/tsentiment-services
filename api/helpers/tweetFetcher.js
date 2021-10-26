const logInfo = {
  servicename: 'api',
  file: 'helpers/tweetFetcher.js'
}
exports.tweetFetcher = async (request, response, cb) => {
  const { user_id, user_twitter_access_token, user_twitter_access_token_secret } = request.currentAuthData
  const twResult = (callback) => {
    request.oa.get(
      typeof request.query.nextResultLink == 'string'
      && request.query.nextResultLink.length > 0
        ? `${process.env.TWITTER_SEARCH_API_URL}${request.query.nextResultLink}`
        : `${process.env.TWITTER_SEARCH_API_URL}?q=${encodeURIComponent(request.searchWord)}`,
      user_twitter_access_token,
      user_twitter_access_token_secret,
      function(error, twitterResponseData, result) {
        if (error) {
          logInfo.line = 17
          logInfo.clientInfo = user_id
          logInfo.logdata = error
          logInfo.type = 'error'
          return callback({}, logInfo,error)
        }
        logInfo.line = 23
        logInfo.logdata = 'tweet fetched'
        logInfo.type = 'info'
        return callback(JSON.parse(twitterResponseData), logInfo,false)
      })
  }
  await twResult(cb)
}
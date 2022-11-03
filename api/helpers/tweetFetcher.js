const logInfo = {
  servicename: 'api',
  file: 'helpers/tweetFetcher.js'
}

exports.tweetFetcher = async (request) => {
  const { user_id, twitterAccessToken, twitterAccessTokenSecret } = request.currentAuthData
  return new Promise(resolve => {
    request.oa.get(
      request.nextId
        ? `${process.env.TWITTER_SEARCH_API_URL}?max_id=${request.nextId}&q=${encodeURIComponent(request.searchWord)}&include_entities=1`
        : `${process.env.TWITTER_SEARCH_API_URL}?q=${encodeURIComponent(request.searchWord)}`,
      twitterAccessToken,
      twitterAccessTokenSecret,
      function(error, twitterResponseData, result) {
        if (error) {
          logInfo.line = 17
          logInfo.clientInfo = user_id
          logInfo.logdata = error
          logInfo.type = 'error'
          return resolve({twitterResponseData:{}, logInfo,error})
        }
        logInfo.line = 23
        logInfo.logdata = 'tweet fetched'
        logInfo.type = 'info'
        return resolve({twitterResponseData:JSON.parse(twitterResponseData), logInfo,error:false})
      })
  })
}
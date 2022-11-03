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
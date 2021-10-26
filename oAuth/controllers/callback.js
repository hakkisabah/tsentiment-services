const { rateLimitChecker } = require('../utils/checker')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const redisCG = require('./redisprocess')
const { getUserMail } = require('../helpers/getusermail')
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.DB_SERVICE_TOKEN}`
}
const logInfo = {
  servicename: 'oauth',
  file: 'controllers/callback.js'
}

exports.callback = (request, response) => {
  const verifiedCookie = request.verifiedCookie

  /** Obtaining access_token */
  const getOAuthRequestTokenCallback = async function(error, oAuthAccessToken,
                                                      oAuthAccessTokenSecret, results) {
    if (error) {
      logInfo.line = 24
      logInfo.clientInfo = results
      logInfo.logdata = error
      logInfo.type = 'error'
      return response.sendError('Error occured while getting access token', 500, logInfo)
    }
    try {
      const { user_id, screen_name } = results
      // request.currentAuthData.user_id  define for getUserMail error log information
      request.currentAuthData.user_id = user_id
      const payload = {
        user_id,
        screen_name,
        twitterOauthTokens: {
          oAuthAccessToken,
          oAuthAccessTokenSecret
        }
      }
      await getUserMail(request, oAuthAccessToken, oAuthAccessTokenSecret).then(email => {
        payload.email = email
      })
      const { data } = await axios.post(`${process.env.DB_SERVER_URL}user`, payload, { headers })
      const processedUser = data.data
      const rateLimit = await rateLimitChecker(request,
        oAuthAccessToken,
        oAuthAccessTokenSecret)
      rateLimit.reset = +rateLimit.reset - 900
      rateLimit.remaining = +rateLimit.remaining - 30
      await redisCG.updateRateLimit(user_id, rateLimit)
      if (!processedUser.token) {
        logInfo.line = 52
        logInfo.clientInfo = results
        logInfo.logdata = processedUser
        logInfo.type = 'error'
        return response.sendError(`tsentiment service has a problem currently`, 500, logInfo)
      }
      results.token = processedUser.token
      const jwtToken = jwt.sign(results, process.env.JWT_SECRET)
      await redisCG.updateUserToken(payload.user_id,results.token,payload.twitterOauthTokens)
      logInfo.line = 61
      logInfo.clientInfo = results
      logInfo.logdata = 'user has been saved and granted'
      logInfo.type = 'info'
      return response.sendData(jwtToken,logInfo)
    } catch (e) {
      logInfo.line = 68
      logInfo.clientInfo = 'oauth server'
      logInfo.logdata = e
      logInfo.type = 'critical'
      response.sendError(`tsentiment service given an error currently`, 500, logInfo)
    }
  }

  // request.oAuthTokenSecret refreshed from controllers/auth.js
  request.oa.getOAuthAccessToken(request.query.oauth_token, verifiedCookie.oAuthTokenSecret,
    request.query.oauth_verifier,
    getOAuthRequestTokenCallback)
}
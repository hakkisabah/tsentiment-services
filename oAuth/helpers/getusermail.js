const { logger } = require('../helpers/logger')
const logInfo = {
  servicename: 'oauth',
  file: 'helpers/getusermail.js'
}
exports.getUserMail = async (request, oAuthAccessToken, oAuthAccessTokenSecret) => {
  const getMail = async (callback) => {
    request.oa.get(
      'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      oAuthAccessToken,
      oAuthAccessTokenSecret,
      async function(error, twitterResponseData, result) {
        try {
          const { email } = JSON.parse(twitterResponseData)
          callback(email)
        } catch (fetchError) {
          logInfo.line = 17
          logInfo.clientInfo = request.currentAuthData.user_id
          logInfo.logdata = fetchError
          logInfo.type = 'error'
          await logger(logInfo)
          throw fetchError
        }
      })
  }
  return new Promise(async resolve => {
    return getMail((email) => {
      resolve(email)
    })
  })

}
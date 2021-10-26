const OAuth = require('oauth').OAuth

const tsentimentappKeys = {
  consKey:process.env.TWITTER_APP_CONS_KEY,
  consSecret: process.env.TWITTER_APP_CONS_SECRET_KEY,
  // bearer token is optional for Twitter API V2
  bearerToken: process.env.TWITTER_APP_BEARER_TOKEN,
  callbackUrl:process.env.TWITTER_APP_CALLBACK_URL
}

exports.oa = new OAuth(
  process.env.TWITTER_API_REQUEST_URL,
  process.env.TWITTER_API_ACCESS_URL,
  tsentimentappKeys.consKey,
  tsentimentappKeys.consSecret,
  '1.0A',
  tsentimentappKeys.callbackUrl,
  'HMAC-SHA1'
)

const {getRedis,setRedis,delRedis} = require('../helpers/redis')
const getRateInfo = async (user_id) => {
  const remaining = await getRedis(user_id)
  const reset = await getRedis(`${user_id}_reset`)
  return {
    remaining: remaining,
    reset: reset
  }
}

const updateRateLimit = async ( userId, rateLimit) => {
  await setRedis(`${userId}`, rateLimit.remaining)
  await setRedis(`${userId}_reset`, rateLimit.reset)
}

const updateUserToken = async (userId,userToken,twitterOauthTokens) =>{
  const isUserOldToken = await getRedis(`${userId}_token`)
  // this condition usable for first time because if use response another first time it might be return null.
  if (isUserOldToken){
   await delRedis(`${userId}_token`)
  }
  await setRedis(`${userToken}`,userId)
  await setRedis(`${userId}_token`,userToken)
  await setRedis(`${userId}_twitter_access_token`,twitterOauthTokens.oAuthAccessToken)
  await setRedis(`${userId}_twitter_access_token_secret`,twitterOauthTokens.oAuthAccessTokenSecret)
}

module.exports = {
  updateRateLimit,
  getRateInfo,
  updateUserToken
}
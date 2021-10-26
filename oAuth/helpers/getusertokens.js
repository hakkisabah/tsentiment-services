const { getRedis } = require('../helpers/redis')

exports.getUserTokens = async (user_id) => {
  const user_access_token = await getRedis(`${user_id}_twitter_access_token`)
  const user_access_token_secret = await getRedis(`${user_id}_twitter_access_token_secret`)
  return { user_access_token, user_access_token_secret }
}
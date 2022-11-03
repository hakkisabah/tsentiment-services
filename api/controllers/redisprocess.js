const {getRedis,setRedis} = require('../helpers/redis')
const getRateInfo = async (user_id) => {
  const remaining = await getRedis(user_id)
  const reset = await getRedis(`${user_id}_reset`)
  return {
    remaining: remaining,
    reset: reset
  }
}

const updateRateLimit = async ( userId, rateLimit) => {
  await setRedis(`${userId}`, +rateLimit.remaining)
  await setRedis(`${userId}_reset`, rateLimit.reset)
}

module.exports = {
  updateRateLimit,
  getRateInfo,
}
const { logger } = require('../helpers/logger')
const axios = require('axios')
const logInfo = {
  file: 'helpers/redis.js'
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.REDIS_SERVICE_TOKEN}`
}

const setRedis = async (key, value) => {
  try {
    const payload = {
      key:key,
      value:value
    }
    const setted = await axios.post(`${process.env.REDIS_SERVER_URL}set`, payload, { headers })
    return setted.data.setted
  } catch (e) {
    logInfo.servicename = 'api'
    logInfo.line = 27
    logInfo.clientInfo = 'redis server'
    logInfo.logdata = e
    logInfo.type = 'error'
    await logger(logInfo)
    throw e
  }
}
const getRedis = async (key) => {
  try {
    const getted = await axios.get(`${process.env.REDIS_SERVER_URL}get?key=${key}`, { headers })
    return getted.data.getted
  } catch (e) {
    logInfo.servicename = 'api'
    logInfo.line = 40
    logInfo.clientInfo = 'redis server'
    logInfo.logdata = e
    logInfo.type = 'error'
    await logger(logInfo)
    throw e
  }
}

module.exports = {
  setRedis,
  getRedis,
}
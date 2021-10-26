const axios = require('axios')
const { logger } = require('../helpers/logger')

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
      key,
      value
    }
    const setted = await axios.post(`${process.env.REDIS_SERVER_URL}set`, payload, { headers })
    return setted.data.setted
  } catch (e) {
    logInfo.servicename = 'api'
    logInfo.line = 23
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
    logInfo.line = 37
    logInfo.clientInfo = 'redis server'
    logInfo.logdata = e
    logInfo.type = 'error'
    await logger(logInfo)
    throw e
  }
}
const delRedis = async (key) => {
  try {
    const deleted = await axios.get(`${process.env.REDIS_SERVER_URL}del?key=${key}`, { headers })
    return deleted.data.deleted
  } catch (e) {
    logInfo.servicename = 'oAuth'
    logInfo.line = 23
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
  delRedis
}

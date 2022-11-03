const { logger } = require('../helpers/logger')
const axios = require('axios')
const logInfo = {
  file: 'helpers/user.js'
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.REDIS_SERVICE_TOKEN}`
}

const getUser = async (token) => {
  try {
    const user = await axios.get(`${process.env.REDIS_SERVER_URL}getuser?token=${token}`, { headers })
    return user.data
  } catch (e) {
    logInfo.servicename = 'api'
    logInfo.line = 18
    logInfo.clientInfo = 'redis server'
    logInfo.logdata = e
    logInfo.type = 'error'
    await logger(logInfo)
    throw e
  }
}
exports.getUser = getUser

const setUser = async (payload) => {
  try {
    const user = await axios.post(`${process.env.REDIS_SERVER_URL}setuser`,payload, { headers })
    return user.data
  } catch (e) {
    logInfo.servicename = 'api'
    logInfo.line = 34
    logInfo.clientInfo = 'redis server'
    logInfo.logdata = e
    logInfo.type = 'error'
    await logger(logInfo)
    throw e
  }
}
exports.setUser = setUser
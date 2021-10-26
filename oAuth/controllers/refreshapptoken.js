const { setRedis } = require('../helpers/redis')
const axios = require('axios')

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.DB_SERVICE_TOKEN}`
}
const logInfo = {
  servicename: 'oauth',
  file: 'controllers/refreshapptoken.js'
}

exports.refreshAppToken = async (request, response) => {
  try {
    const payload = {
      user_id: request.currentAuthData.user_id
    }
    const { data } = await axios.post(`${process.env.DB_SERVER_URL}refreshapptoken`, payload, { headers })
    const updatedUserAppToken = data.data
    await setRedis(`${request.currentAuthData.user_id}_token`, updatedUserAppToken.token)
    logInfo.line = 21
    logInfo.clientInfo = { user: request.currentAuthData.user_id, ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = `${request.currentAuthData.user_id} user app token refreshed`
    logInfo.type = 'info'
    return response.sendData({ token: updatedUserAppToken.token }, logInfo)
  } catch (e) {
    logInfo.line = 27
    logInfo.clientInfo = request.currentAuthData.user_id
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('refresh error', 500, logInfo)
  }

}
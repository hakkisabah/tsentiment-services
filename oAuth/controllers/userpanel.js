const { getRedis } = require('../helpers/redis')
const logInfo = {
  servicename: 'oauth',
  file: 'controllers/userpanel.js'
}

exports.userPanel = async (request, response) => {
  try {
    const userAppToken = await getRedis(`${request.currentAuthData.user_id}_token`)
    if (userAppToken){
      logInfo.line = 11
      logInfo.clientInfo = { user: request.currentAuthData.user_id, ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = `${request.currentAuthData.user_id} user is finded`
      logInfo.type = 'info'
      return response.sendData({token:userAppToken}, logInfo)
    }
    logInfo.line = 17
    logInfo.clientInfo = { user: request.currentAuthData.user_id, ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = `user App token not find on redis`
    logInfo.type = 'error'
    return response.sendData({token:'error (refresh your token)',errors:'token not find!'}, logInfo)
  } catch (e) {
    logInfo.line = 23
    logInfo.clientInfo = request.currentAuthData.user_id
    logInfo.logdata = e
    return response.sendError('Panel error', 500, logInfo)
  }
}
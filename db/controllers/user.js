const { Token } = require('../models/Token')
const { User } = require('../models/User')
const { saveChecker } = require('../utils/checker')
const logInfo = {
  servicename: 'db',
  file: 'controllers/user.js'
}

async function saveUser(payload, request, response) {
  try {
    const tokenPayload = {
      user_id: payload.user_id,
      twitterOauthTokens: {
        oAuthAccessToken: payload.twitterOauthTokens.oAuthAccessToken,
        oAuthAccessTokenSecret: payload.twitterOauthTokens.oAuthAccessTokenSecret
      }
    }
    // saveToken method generate and returning new token for user
    const userToken = await Token.saveToken(tokenPayload)
    if (userToken.token) {
      const userPayload = {
        user_id: payload.user_id,
        screen_name: payload.screen_name,
        email:payload.email
      }
      await User.saveUser(userPayload)
      logInfo.line = 27
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'user token saved'
      logInfo.type = 'info'
      return response.sendData(userToken, logInfo)
    }
  } catch (e) {
    logInfo.line = 34
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('db service error', 500, logInfo)
  }
}

async function updateUser(findedUserToken, payload, request, response) {
  try {
    findedUserToken.twitterOauthTokens.oAuthAccessToken = payload.twitterOauthTokens.oAuthAccessToken
    findedUserToken.twitterOauthTokens.oAuthAccessTokenSecret = payload.twitterOauthTokens.oAuthAccessTokenSecret
    const findedUser = await User.findUser({ user_id: findedUserToken.user_id })
    findedUser.user_id = findedUserToken.user_id
    findedUser.screen_name = payload.screen_name
    findedUser.email = payload.email
    await User.saveUser(findedUser)
    const userToken = await Token.saveToken(findedUserToken)
    logInfo.line = 52
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = 'user token updated'
    logInfo.type = 'info'
    return response.sendData(userToken, logInfo)
  } catch (e) {
    console.log('ERRR > ',e)
    logInfo.line = 59
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('Process user Error', 500, logInfo)
  }
}

async function processUser(request, response) {
  const payload = saveChecker(request)
  try {
    if (!payload) {
      logInfo.line = 71
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'parameter error for process user'
      logInfo.type = 'error'
      return response.sendError('Parameter Error', 406, logInfo)
    }
    const findedUserToken = await Token.findUserToken({ user_id: payload.user_id })
    // update
    if (findedUserToken !== null) {
      await updateUser(findedUserToken, payload, request, response)
    } else { // save
      await saveUser(payload, request, response)
    }
  } catch (e) {
    logInfo.line = 85
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('Process user Error', 500, logInfo)
  }
}

exports.processUser = processUser

async function getUser(request, response) {
  try {
    if (!request.headers.user_id){
      logInfo.line = 98
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'Parameter error'
      logInfo.type = 'error'
      return response.sendError('Parameter Error',406,logInfo)
    }
    const findedUserToken = await Token.findUserToken({ user_id: request.headers.user_id })
    logInfo.line = 105
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = 'user token finded'
    logInfo.type = 'info'
    return response.sendData(findedUserToken,logInfo)
  }catch (e) {
    logInfo.line = 111
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('tsentiment services error',500,logInfo)
  }
}
exports.getUser = getUser

async function getApiUser(request, response) {
  // requested user token from api
  const userToken = request.headers.usertoken
  try {
    if (!userToken){
      logInfo.line = 125
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'Api parameter error'
      logInfo.type = 'error'
      return response.sendError('Parameter Error',406,logInfo)
    }
    const findedUserToken = await Token.findUserToken({token:userToken})
    if (findedUserToken){
      logInfo.line = 133
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'api user token finded'
      logInfo.type = 'info'
      return response.sendData(findedUserToken,logInfo)
    }else{
      logInfo.line = 139
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'user token not find !'
      logInfo.type = 'error'
      return response.sendError('Token error',404,logInfo)
    }
  }catch (e) {
    logInfo.line = 146
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = e
    logInfo.type = 'critical'
    return response.sendError('tsentiment services error',500,logInfo)
  }
}

exports.getApiUser = getApiUser

async function refreshAppToken (request, response) {
  try {
    if (!request.body.user_id){
      logInfo.line = 159
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'Parameter error'
      logInfo.type = 'error'
      return response.sendError('Parameter Error',406,logInfo)
    }
    const findedUserToken = await Token.findUserToken({ user_id: request.body.user_id })
    if (!findedUserToken) {
      logInfo.line = 167
      logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
      logInfo.logdata = 'User not find'
      logInfo.type = 'error'
      return response.sendError('User not find',400,logInfo)
    }
    // null value require for generating new user app token, this condition on saveToken
    findedUserToken.token = null
    const updatedUserAppToken = await Token.saveToken(findedUserToken)
    logInfo.line = 176
    logInfo.clientInfo = { user: request.body.user_id, ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = 'user token refreshed'
    logInfo.type = 'info'
    return response.sendData(updatedUserAppToken,logInfo)
  }catch (e) {
    logInfo.line = 182
    logInfo.clientInfo = { ip: request.clientIp, agent: request.useragent }
    logInfo.logdata = e
    logInfo.type = 'error'
    return response.sendError('tsentiment services error',500,logInfo)
  }
}

exports.refreshAppToken = refreshAppToken
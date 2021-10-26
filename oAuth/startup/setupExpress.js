const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { genRes } = require('../utils/general')
const requestIp = require('request-ip')
const helmet = require('helmet')
const { oa } = require('../src/oAuth')
const bearerToken = require('express-bearer-token')
const { logger } = require('../helpers/logger')
const useragent = require('express-useragent')
const cors = require('cors')

const corsOptions = {
  // you should use this addresses if you want a signal => '127.0.0.1:8080','localhost:8080',
  origins:['app.tsentiment.com','auth.tsentiment.com']
}


const logInfoSetup = {
  file: 'startup/setupExpress.js'
}

module.exports = (app) => {

  /* Xss & Cors Protection */
  app.use(helmet())

  app.use(cors(corsOptions))

  app.use(useragent.express())

  // get client ip
  app.use(requestIp.mw())

  // bearer token middleware
  app.use(bearerToken())

  app.use(cookieParser())

  /* Other configurations */
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
  app.use(bodyParser.json())

  /* Helper middleware */
  app.use((req, res, next) => {

    // OAuth middleware
    req.oa = oa

    // A helper to send response as data
    res.sendData = async (data, logInfo) => {
      const ip = req.clientIp
      try {
        const response = genRes(data, 200, data.errors || [])
        logInfo.servicename = 'oauth'
        logInfo.clientInfo = { user: req.currentAuthData ? req.currentAuthData.user_id : 'unknown', ip, agent: req.useragent }
        logInfo.logdata = data.token ? {
          data: 'user token hidden',
          userInfo: { user: req.currentAuthData ? req.currentAuthData.user_id : 'unknown', ip, agent: req.useragent }
        } : {
          data: 'user data succesful',
          user: req.currentAuthData ? req.currentAuthData.user_id : 'unknown',
          userInfo: { ip, agent: req.useragent }
        }
        logInfo.type = 'info'
        await logger(logInfo)
        return res.json(response)
      } catch (e) {
        logInfoSetup.line = 74
        logInfoSetup.servicename = 'oauth'
        logInfoSetup.clientInfo = {
          user: req.currentAuthData ? req.currentAuthData.user_id : 'uknown',
          ip,
          agent: req.useragent
        }
        logInfoSetup.logdata = e.message
        logInfoSetup.type = 'error'
        await logger(logInfoSetup)
        return res.json({ msg: 'Server error', statusCode: 500 })
      }

    }

    // A helper to send response as error
    res.sendError = async (msg, statusCode, logInfo) => {
      const ip = req.clientIp
      try {
        res.statusCode = statusCode || 404
        logInfo.servicename = 'oauth'
        logInfo.clientInfo = logInfo.clientInfo ? logInfo.clientInfo : {
          user: req.currentAuthData ? req.currentAuthData.user_id : 'unknown',
          ip,
          agent: req.useragent
        }
        logInfo.type = logInfo.type ? logInfo.type : 'error'
        await logger(logInfo)
        return res.json({ msg, statusCode: res.statusCode })
      } catch (e) {
        logInfoSetup.servicename = 'oauth'
        logInfoSetup.line = 101
        logInfoSetup.clientInfo = {
          user: req.currentAuthData ? req.currentAuthData.user_id : 'uknown',
          ip,
          agent: req.useragent
        }
        logInfoSetup.logdata = e.message
        logInfoSetup.type = 'error'
        await logger(logInfoSetup)
        return res.json({ msg: 'Server error', statusCode: 500 })
      }

    }

    next()
  })
}
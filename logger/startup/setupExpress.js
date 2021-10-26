const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { genRes } = require('../utils/general')
const helmet = require('helmet')
const requestIp = require('request-ip')
const bearerToken = require('express-bearer-token')
const { logger, S3logger } = require('../helpers/logger')
const useragent = require('express-useragent')

const logInfoSetup = {
  file: 'controllers/setupExpress.js'
}

module.exports = (app) => {


  /* Xss & Cors Protection */
  app.use(helmet())

  app.use(useragent.express())

  // get client ip
  app.use(requestIp.mw())

  // bearer token middleware
  app.use(bearerToken())

  app.use(cookieParser())

  /* Other configurations */
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
  app.use(bodyParser.json({limit: '50mb'}))

  /* Helper middleware */
  app.use((req, res, next) => {
    // A helper to send response as data
    res.sendData = async (data, logInfo) => {
      const ip = req.clientIp
      try {
        const response = genRes(data, 200, [])
        logInfo.type = logInfo.type ? logInfo.type : 'info'
        logInfo.clientInfo = { info:logInfo.clientInfo, ip, agent: req.useragent }
        await logger(logInfo)
        return res.json(response)
      } catch (e) {
        logInfoSetup.line = 43
        logInfoSetup.servicename = 'logger'
        logInfoSetup.type = 'error'
        logInfoSetup.clientInfo = { ip, agent: req.useragent }
        logInfoSetup.logdata = e.message
        S3logger(logInfoSetup)
        return res.json({msg:'Server error',statusCode:500})
      }

    }

    // A helper to send response as error
    res.sendError = async (msg, statusCode, logInfo) => {
      const ip = req.clientIp
      try {
        res.statusCode = statusCode || 404
        logInfo.type = logInfo.type !== 'unknown' ? logInfo.type : 'error'
        logInfo.clientInfo = { info:logInfo.clientInfo, ip, agent: req.useragent }
        await logger(logInfo)
        return res.json({ msg, statusCode: res.statusCode })
      } catch (e) {
        logInfoSetup.line = 62
        logInfoSetup.servicename = 'logger'
        logInfoSetup.type = 'error'
        logInfoSetup.clientInfo = { ip, agent: req.useragent }
        logInfoSetup.logdata = e.message
        S3logger(logInfoSetup)
        return res.json({msg:'Server error',statusCode:500})
      }
    }
    next()
  })
}
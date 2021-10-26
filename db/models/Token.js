const mongoose = require('mongoose')
const randtoken = require('rand-token')
const { Schema } = mongoose
const { logger } = require('../helpers/logger')
const logInfo = {
  file: 'models/Token.js'
}
const schema = new Schema({
    user_id: {
      type: Number,
      required: true,
      index: true,
      unique: true
    },
    twitterOauthTokens: {
      oAuthAccessToken: {
        type: String,
        required: true
      },
      oAuthAccessTokenSecret: {
        type: String,
        required: true
      }
    },
    token: {
      type: String,
      required: true
    }
  },
  { timestamps: true })
schema.statics.saveToken = async function(payload) {
  console.log('saveToken payload >',payload)
  payload.token = payload.token && payload.token !== null ? payload.token : randtoken.generate(64)
  const userToken = new this(payload)
  try {
    const result = await userToken.save()
    return { token: payload.token }
  } catch (e) {
    logInfo.line = 38
    logInfo.servicename = 'db'
    logInfo.clientInfo = 'db server'
    logInfo.logdata = e
    logInfo.type = 'critical'
    await logger(logInfo)
  }
}

schema.statics.findUserToken = async function(payload) {
  try {
    const result = await mongoose.model('Token', schema)
      .findOne(payload)
    return result
  } catch (e) {
    logInfo.line = 53
    logInfo.servicename = 'db'
    logInfo.clientInfo = 'db server'
    logInfo.logdata = e
    logInfo.type = 'critical'
    await logger(logInfo)
  }

}
exports.Token = mongoose.model('Token', schema)
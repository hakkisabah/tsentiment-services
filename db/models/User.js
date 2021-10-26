const mongoose = require('mongoose')
const { Schema } = mongoose
const { logger } = require('../helpers/logger')
const logInfo = {
  file: 'models/User.js'
}
const schema = new Schema({
    user_id: {
      type: Number,
      required: true,
      index: true,
      unique: true
    },
    screen_name: {
      type: String,
      required: true
    },
    email:{
      type:String,
      required:true
    }
  },
  { timestamps: true })
schema.statics.saveUser = async function(payload) {
  const user = new this(payload)
  try {
    const result = await user.save()
    return result
  } catch (e) {
    logInfo.line = 26
    logInfo.servicename = 'db'
    logInfo.clientInfo = 'db server'
    logInfo.logdata = e
    logInfo.type = 'critical'
    logger(logInfo)
  }

}

schema.statics.findUser = async function(payload) {
  try {
    const result = await mongoose.model('User', schema)
      .findOne(payload)
    return result
  } catch (e) {
    logInfo.line = 41
    logInfo.servicename = 'db'
    logInfo.clientInfo = 'db server'
    logInfo.logdata = e
    logInfo.type = 'critical'
    logger(logInfo)
  }

}

exports.User = mongoose.model('User', schema)
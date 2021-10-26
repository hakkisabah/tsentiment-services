const logModel = require('../models/logger')
const moment = require('moment')
require('dotenv').config()

const S3StreamLogger = require('s3-streamlogger').S3StreamLogger

const s3stream = new S3StreamLogger({
  bucket: process.env.AWS_LOG_BUCKET_NAME,
  access_key_id: process.env.AWS_ACCOUNT_ACCESS_ID,
  secret_access_key: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY
})
/* Catch unhandledRejection and  uncaughtExceptions */
process.on('unhandledRejection', (err) => {
  s3stream.write(JSON.stringify(err))
})
process.on('uncaughtException', (err) => {
  s3stream.write(JSON.stringify(err))
})
exports.logger = async (data) => {
  try {
    await logModel.saveLog(data)
  } catch (e) {
    s3stream.write(JSON.stringify(data))
  }

}

exports.S3logger = (data) => {
  try {
    data.createdAt = moment().format()
    s3stream.write(JSON.stringify(data))
  } catch (e) {
    throw e
  }

}
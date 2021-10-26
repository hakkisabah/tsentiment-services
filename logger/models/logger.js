const mongoose = require('mongoose')
const { Schema } = mongoose
const LogSchema = new Schema({
  servicename:String,
  file: String,
  line: String,
  clientInfo: Schema.Types.Mixed,
  logdata: Schema.Types.Mixed,
  type: String

},{timestamps: true});

LogSchema.statics.saveLog = async function(payload) {
  const log = new this(payload)
  try {
    const result = await log.save()
    return true
  } catch (e) {
    throw e
  }
}

module.exports = mongoose.model('logs', LogSchema);
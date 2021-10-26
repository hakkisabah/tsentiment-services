const express = require('express')
const app = express()

/* Setup the logger */
require('../helpers/logger')

require('../startup/setupExpress')(app)
require('../startup/routes')(app)

module.exports = app
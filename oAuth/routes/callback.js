const router = require('express').Router()
const { callback } = require('../controllers/callback')
const { verifyCookie } = require('../middleware/verifyCookie')

router.get('/', verifyCookie, callback)

module.exports = router
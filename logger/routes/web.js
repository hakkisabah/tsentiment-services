const router = require('express').Router()
const { checkCookie } = require('../middleware/checkCookie')
const { web } = require('../controllers/web')
router.post('/', checkCookie, web)
module.exports = router
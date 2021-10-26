const router = require('express').Router()
const { oAuth } = require('../controllers/oauth')
const { userPanel } = require('../controllers/userpanel')
const { refreshAppToken } = require('../controllers/refreshapptoken')
const { checkCookie } = require('../middleware/checkCookie')
const { verifyCookie } = require('../middleware/verifyCookie')

router.use('/callback',require("./callback"))
router.get('/getcode',checkCookie, oAuth)
router.get('/panel',verifyCookie,userPanel)
router.get('/refreshapptoken',verifyCookie,refreshAppToken)


module.exports = router
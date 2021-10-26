const router = require('express').Router()
const { checkAuth } = require('../middleware/checkAuth')
const { processUser,getUser,refreshAppToken } = require('../controllers/user')

router.post('/user',checkAuth, processUser)
router.post('/refreshapptoken',checkAuth, refreshAppToken)
router.get('/user',checkAuth,getUser)

module.exports = router
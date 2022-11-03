const router = require('express').Router()
const { getTweet } = require('../controllers/twitter')
const { apiCheck } = require('../middleware/checkAuth')

router.get('/gettweet', apiCheck, getTweet)

module.exports = router
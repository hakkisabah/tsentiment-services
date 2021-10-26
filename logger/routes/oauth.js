const router = require('express').Router()
const { checkAuth } = require('../middleware/checkAuth')
const { oauth } = require('../controllers/oauth')
router.post('/', checkAuth, oauth)
module.exports = router
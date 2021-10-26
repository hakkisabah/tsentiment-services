const router = require('express').Router()
const { api } = require('../controllers/api')
const { checkAuth } = require('../middleware/checkAuth')
router.post('/', checkAuth, api)
module.exports = router
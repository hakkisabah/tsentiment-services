const router = require('express').Router()
const { checkAuth } = require('../middleware/checkAuth')
const { db } = require('../controllers/db')
router.post('/', checkAuth, db)
module.exports = router
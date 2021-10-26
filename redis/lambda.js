const serverlessExpress = require('@vendia/serverless-express')
const express = require('express')
const app = express()
const port = process.env.PORT || 3031
const bodyParser = require('body-parser')
const bearerToken = require('express-bearer-token')
const helmet = require('helmet')
const apiTokens = [
  process.env.API_SERVICE_TOKEN,
  process.env.OAUTH_SERVICE_TOKEN
]

app.use(bodyParser.json())

// bearer token middleware
app.use(bearerToken())
/* Xss & Cors Protection */
app.use(helmet())

app.listen(port, () => {})

const redisBase = require('redis')


const client = redisBase.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT
})
const { promisify } = require('util')
client.get = promisify(client.get)
client.set = promisify(client.set)
client.del = promisify(client.del)
client.on('error', function(error) {
  console.log(error)
})

const checkAuth = (requestedToken) => apiTokens.some(token => token === requestedToken)
app.get('/get', async (req, res) => {
  const isAuth = checkAuth(req.token)
  if (isAuth && req.query.key) {
    const getted = await client.get(req.query.key)
    return res.json({ getted: getted })
  } else {
    return res.json({ msg: 'error', statusCode: 406 })
  }
})
app.post('/set', async (req, res) => {
  const isAuth = checkAuth(req.token)
  // IMPORTANT : check value length because when value is 0 and then condition is false
  if (isAuth && req.body.key && req.body.value.length > 0) {
    const setted = await client.set(req.body.key, req.body.value)
    return res.json({ setted: setted })
  } else {
    return res.json({ msg: 'error', statusCode: 406 })
  }
})

app.get('/del', async (req, res) => {
  const isAuth = checkAuth(req.token)
  if (isAuth && req.query.key) {
    const deleted = await client.del(req.query.key)
    return res.json({ deleted: deleted })
  } else {
    return res.json({ msg: 'error', statusCode: 406 })
  }
})

module.exports.universal = async (event, context) => {
  const serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}
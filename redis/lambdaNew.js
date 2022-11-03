const serverlessExpress = require('@vendia/serverless-express')
const express = require('express')
const app = express()
const port = process.env.PORT || 3031
const bodyParser = require('body-parser')
const bearerToken = require('express-bearer-token')
const helmet = require('helmet')
const {getPayload} = require("./controllers/redisToDynamoDB")
const { setUser, getUser, getKey, saveKey } = require("./controllers/user")

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


// private endpoints

const checkAuth = (requestedToken) => apiTokens.some(token => token === requestedToken)
// after update ..
app.get('/getuser', async (req, res) => {
  const isAuth = checkAuth(req.token)
  if (isAuth && req.query.token){
    const user = await getUser(req.query.token)
    return res.json(user)
  } else {
    res.json({ msg: 'error', statusCode: 400 })
  }
})

app.post('/setuser', async (req, res) => {
  const isAuth = checkAuth(req.token)
  if (isAuth && req.body){
    const user = await setUser(req.body)
    return res.json(user)
  } else {
    res.json({ msg: 'error', statusCode: 400 })
  }
})


// before update.. but getPayload implementations is new
app.get('/get', async (req, res) => {
  const isAuth = checkAuth(req.token)
  if (isAuth && req.query.key) {
    const payload = getPayload({key:req.query.key})
    if (payload){
      const getted = await getKey(payload);
      return res.json({ getted: getted })
    } else {
      res.json({ msg: 'error', statusCode: 400 })
    }
  } else {
    return res.json({ msg: 'error', statusCode: 406 })
  }
})
app.post('/set', async (req, res) => {
  const isAuth = checkAuth(req.token)
  // IMPORTANT : check value length because when value is 0 and then condition is false
  if (isAuth && req.body.key && req.body.value.length > 0) {
    const payload = getPayload({key:req.body.key,value:req.body.value})
    if (payload){
      const setted = await saveKey(payload);
      return res.json({ setted: setted })
    } else {
      res.json({ msg: 'error', statusCode: 400 })
    }
  } else {
    return res.json({ msg: 'error', statusCode: 406 })
  }
})

app.get('/del', async (req, res) => {
  const isAuth = checkAuth(req.token)
  if (isAuth && req.query.key) {
    const payload = getPayload({key:req.query.key})
    if (payload){
      // delete manipulation with saving
      const deleted = await saveKey({user_id:payload.user_id,[payload.key]:"0"});
      return res.json({ deleted: deleted })
    } else {
      res.json({ msg: 'error', statusCode: 400 })
    }
  } else {
    return res.json({ msg: 'error', statusCode: 406 })
  }
})

module.exports.universal = async (event, context) => {
  const serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}
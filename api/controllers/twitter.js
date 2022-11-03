const { wordRule } = require('../utils/rule')
const { tweetFetcher } = require('../helpers/tweetFetcher')
const { setUser } = require('../helpers/user')
const reducedTweetQty = +process.env.REDUCED_REQUEST_QTY

const logInfo = {
  servicename: 'api',
  file: 'controllers/twitter.js'
}

const checkQueries = (request) => {
  if (!request.query.word) {
    logInfo.line = 10
    logInfo.logdata = 'user do not enter word query'
    logInfo.type = 'error'
    return { queries: 'Keyword must be type', statusCode: 405, logInfo }
  }
  const searchWord = wordRule(request.query.word)
  if (searchWord === null) {
    logInfo.line = 17
    logInfo.logdata = 'search word not compliant with the rules'
    logInfo.type = 'error'
    return { queries: 'NOT ACCEPTABLE WORD PLEASE TRY ONLY ALPHANUMERIC ENTRY', statusCode: 403, logInfo }
  }
  return {queries: searchWord, statusCode: false, logInfoForQueries : logInfo}
}

const Tweets = []
const setTweets = (statuses) => statuses.map(status => Tweets.push(status.text))
const collectAndSendResponse = async (request,response,i, news = null)=> {
  // adding remaining limit info for api response
  request.currentAuthData.remaining = +request.currentAuthData.remaining - i
  request.currentAuthData.isProcessNow = false
  await setUser(request.currentAuthData)
  logInfo.line = 56
  logInfo.clientInfo = request.currentAuthData.user_id
  logInfo.logdata = 'user tweet fetch successful'
  logInfo.type = 'info'
  return response.sendData({Tweets,nextId:request.nextId,news}, logInfo)
}
const isTimeout = (request) => (Date.now() - request.apiTimeout) > request.apiTimeLimit
const getTweet = async (request, response) => {
  const { queries, statusCode, logInfoForQueries } = checkQueries(request)
  if (!statusCode) {
    const { remaining } = request.currentAuthData
    request.searchWord = queries.input
    let tmpi = 0;
    try {
      let i = 1
      request.nextId = request.query.nextId?request.query.nextId:null
      for (;i < (remaining - reducedTweetQty); i++) {
        // api gateway limit 30 sec
        if (isTimeout(request)) {
          // reduce limit for non realized tweet fetch
          return collectAndSendResponse(request,response,(i - 1));
        }
        tmpi = i
        const { twitterResponseData, logInfo, error } = await tweetFetcher(request, response)
        if (!twitterResponseData.statuses && error && Tweets.length === 0) {
          // adding remaining limit info for api response
          request.currentAuthData.remaining = +request.currentAuthData.remaining - i
          request.currentAuthData.isProcessNow = false
          await setUser(request.currentAuthData)
          return response.sendError(JSON.parse(error.data), error.statusCode, logInfo)
        }
        if (!twitterResponseData.statuses && Tweets.length === 0) {
          // adding remaining limit info for api response
          request.currentAuthData.remaining = +request.currentAuthData.remaining - i
          request.currentAuthData.isProcessNow = false
          await setUser(request.currentAuthData)
          return response.sendError('Not find any data', 404, logInfo)
        }
        if (Tweets.length > 0 && (error || !twitterResponseData.statuses))
        {
          return collectAndSendResponse(request,response,i);
        }
        if (twitterResponseData.statuses && !error){
          setTweets(twitterResponseData.statuses)
        }
        if (twitterResponseData.search_metadata.next_results) {
          // get next id for next request
          request.nextId = twitterResponseData.search_metadata.next_results.split("=")[1].slice(0,-2)
        } else {
          // reset nextId
          request.nextId = null
          break
        }
      }
      return collectAndSendResponse(request,response,i)
    } catch (error) {
      console.log("catched error",error)
      request.currentAuthData.remaining = +request.currentAuthData.remaining - tmpi
      request.currentAuthData.isProcessNow = false
      await setUser(request.currentAuthData)
      logInfo.line = 69
      logInfo.clientInfo = 'api server'
      logInfo.logdata = error
      logInfo.type = 'critical'
      return response.sendError('tsentiment service given an error currently', 500, logInfo)
    }
  }else {
    request.currentAuthData.isProcessNow = false
    await setUser(request.currentAuthData)
    return response.sendError(`${queries}`, statusCode, logInfoForQueries)
  }
}
exports.getTweet = getTweet
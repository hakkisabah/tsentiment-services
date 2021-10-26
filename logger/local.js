let app = require('./src/server.js');
const { logger } = require('./helpers/logger');
let port = process.env.PORT || 8000;
const baseUrl = `http://localhost:${port}`
const logInfo = {
    file:'index.js'
}
// Server
app.listen(port, () => {
    logInfo.servicename = 'logger'
    logInfo.line = 11
    logInfo.clientInfo = `${baseUrl}`
    logInfo.logdata = `${baseUrl} listening`
    logInfo.type = 'info'
    logger(logInfo);
});

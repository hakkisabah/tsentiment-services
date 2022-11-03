if (process.env.NODE_ENV === "development") {
    const dotenv = require("dotenv");
    dotenv.config();
}
const app = require('./src/server.js');
const { logger } = require('./helpers/logger');
let port = process.env.PORT || 8004;
const baseUrl = `http://localhost:${port}`
const logInfo = {
    file:'local.js'
}
// Server
console.log("local > ",baseUrl)
app.listen(port, async() => {
    logInfo.servicename = 'api'
    logInfo.line = 11
    logInfo.clientInfo = `${baseUrl}`
    logInfo.logdata = `${baseUrl} listening`
    logInfo.type = 'info'
    await logger(logInfo);
});

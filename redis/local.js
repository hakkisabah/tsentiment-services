let app = require('./src/server.js');
let port = process.env.PORT || 3031;
const baseUrl = `http://localhost:${port}`
// Server

app.listen(port, () => {
    console.log(`Listening on: ${baseUrl}`);
});

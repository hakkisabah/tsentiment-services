module.exports = (app) => {

  const oauthRoutes = require('../routes/index');

  app.use('/', oauthRoutes);

};
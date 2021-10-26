module.exports = (app) => {

  const logRoutes = require('../routes/index');

  app.use('/', logRoutes);

};
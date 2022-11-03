module.exports = (app) => {

  const apiRoutes = require('../routes/index');

  app.use('/', apiRoutes);

};
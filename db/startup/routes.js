module.exports = (app) => {

  const dbRoutes = require('../routes/index');

  app.use('/', dbRoutes);

};
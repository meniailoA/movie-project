const path = require('path');
const fs = require('fs');

function initializeRouter(app) {
  
  bootstrap(__dirname).forEach(loadRouteFile);
 
  return app;

  function bootstrap(dir) {
    let files = fs
      .readdirSync(dir)
      .filter(isJsFile)
      .filter(isNotIndexFile);
    let routesFiles = files.map(function(file) {
      return path.join(__dirname, file);
    });
   
    app.set('routesFiles', routesFiles);
    return files;
    function isNotIndexFile(file) {
      return path.basename(file).toLowerCase() !== 'index.js';
    }
    function isJsFile(file) {
      return path.extname(file).toLowerCase() === '.js';
    }
  }
  function loadRouteFile(file) {

    let ctrl = require(path.join(__dirname, file));
    let isObj = typeof ctrl === 'object' && ctrl !== null;

    if (Array.isArray(ctrl)) {
      
      app.use(ctrl[0], ctrl[1]);
    } else if (isObj) {
      
      app.use(ctrl.path, ctrl.controller);
    } else {
      
      app.use( ctrl);
    }
  }
}

module.exports = initializeRouter;

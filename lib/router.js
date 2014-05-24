exports.route = route;

var search = require('./searcher').search;

function route(routes) {
  var fetch = search(routes);

  return function(req, res, next) {
    var fetched = fetch(req.url);
    if (! fetched ) return next();
    req.params = fetched[1];
    fetched[0](req, res);
  };
};

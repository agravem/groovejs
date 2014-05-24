exports.search = search

var match   = require('./matcher').match;

function search(routes) {
  var matchers = [], 
      patterns = Object.keys(routes);
  
  
  for (var i=0, max=patterns.length; i < max; i++) {
    (function(pattern){
      matchers.push(function(url) {
        var m = match(pattern)(url);
        if ( m === false ) return [false, {}];
        if ( m === true  ) return [routes[pattern], {}];
        return [routes[pattern], m];
      });
    })(patterns[i]);
  }

  return function(url) {
    for (var i=0, max= matchers.length; i < max; i++) {
      var m = matchers[i](url);
      if (m[0] === false) continue;
      return m;
    }
  }
}

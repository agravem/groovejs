exports.match = match

var _         = require('lodash');
var Tokenizer = require('./tokenizer');

function tokenize(input) {
  var tokenizer = new Tokenizer(input);
  return tokenizer.tokens();
}

function match(pattern) {
  var p = tokenize(pattern);
  return function(url) {
    var u = tokenize(url);
    var x, isMatch, matches;

    if (p.verb !== u.verb) return false;

    x = matchPath(p, u);
    isMatch = x[0]; matches = x[1];

    if (! isMatch ) return false;

    x = matchQuerystring(p, u);
    isMatch = x[0]; 
    matches = _.merge(matches, x[1]);
    
    if (! isMatch ) return false;
    if ( _.keys(matches).length === 0) return true;
    return matches;
  }
}

function matchPath(p, s) {
  var placeholders = [], values = [], regexp, parsed;
  var isMatch = _.reduce(p.path, function(isMatch, value, index) {
    if (! isMatch ) return false;
    if ( value === s.path[index]) return true;

    parsed = parsePlaceholders(value);
    placeholders = placeholders.concat(parsed[0]);
    regexp = parsed[1];
    value = regexp.exec(s.path[index]);

    if (! value ) return false;

    values = values.concat(value.slice(1, placeholders.length + 1));
    return true;
  }, true);

  if (! isMatch ) return [false, {}];
  if (placeholders.length === 0) return [true, {}];
  return [true, mergeArraysToHash(placeholders, values)];
}

function matchQuerystring(p, s) {
  var placeholders = [], values = [], regexp, parsed;
  var isMatch = _.reduce(p.query, function(isMatch, value, key) {
    
    if (! isMatch ) return false;
    if (! _.has(s.query, key) ) return false;
    if ( value === s.query[key]) return true;
    
    parsed = parsePlaceholders(value);
    placeholders = placeholders.concat(parsed[0]);
    regexp = parsed[1];
    value  = regexp.exec(s.query[key])

    if (! value ) return false;
    
    values = values.concat(value.slice(1, placeholders.length + 1));
    return true;
  }, true);

  if (! isMatch ) return [false, {}];
  if (placeholders.length === 0) return [true, {}];
  return [true, mergeArraysToHash(placeholders, values)];
}

function parsePlaceholders(string) {
  var regexp  = /:([a-zA-Z0-9]+)/g;
  var matches = [], found;
  while (found = regexp.exec(string)) {
    matches.push(found[1]);
    regexp.lastIndex = found.index + 1;
  }

  if (matches.length > 0) {
    string = string.replace('.', '\\.').replace(regexp, '([a-zA-Z0-9]+)');
    var pathRegexp = new RegExp(string, 'g');
    return [matches, pathRegexp];
  } else {
    return [false, new RegExp(string.replace('.', '\\.'))];
  }
}

function mergeArraysToHash(a1, a2) {
  var hash = {};
  for(var i in a1) hash[a1[i]] = a2[i];
  return hash;
}

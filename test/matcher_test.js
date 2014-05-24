var expect = require('chai').expect;
var match  = require('../lib/matcher').match;

suite('Matcher');

test("unmatched verbs", function(){
  var pattern = 'GET /ponies.json';
  var url     = 'POST /ponies.json';

  expect(match(pattern)(url)).to.be.false
});

test('exact matches', function() {
  var pattern = 'GET /ponies.json';
  var url     = 'GET /ponies.json';

  expect(match(pattern)(url)).to.be.true
});

test('matched one placeholder', function() {
  var pattern = 'GET /:resource.json';
  var url     = 'GET /ponies.json';
  var matches = { resource: 'ponies'};

  expect(match(pattern)(url)).to.be.deep.equal(matches);
});

test('order of matches', function() {
  var pattern = 'GET /:resource.json';
  var url     = 'GET /ponies/applejack.json';

  expect(match(pattern)(url)).to.be.false;
});

test('matched for many placeholders', function() {
  var pattern = 'GET /ponies/:id.:ext';
  var url     = 'GET /ponies/applejack.json';
  var matches = { id: 'applejack', ext: 'json' };

  expect(match(pattern)(url)).to.deep.equal(matches);
});

test('unmatched querystrings for exact matches', function() {
  var pattern = 'GET /ponies.json';
  var url     = 'GET /ponies.json?kind=earth';

  expect(match(pattern)(url)).to.be.true
});

test('unmatched querystrings for pattern matches', function() {
  var pattern = 'GET /:resource.json';
  var url     = 'GET /ponies.json?kind=earth';
  var matches = { resource: 'ponies' };

  expect(match(pattern)(url)).to.be.deep.equal(matches);
});

test('matched querystring key/value pair', function() {
  var pattern = 'GET /ponies.json?kind=earth';
  var url     = 'GET /ponies.json?kind=earth';

  expect(match(pattern)(url)).to.be.true
});

test('matched many querystring key/value pairs', function() {
  var pattern = 'GET /ponies.json?kind=earth&mane=pink';
  var url     = 'GET /ponies.json?kind=earth&mane=pink';

  expect(match(pattern)(url)).to.be.true
});

test('unmatched querystring key/value pair', function(){
  var pattern = 'GET /ponies.json?kind=earth';
  var url     = 'GET /ponies.json?kind=pegasus';

  expect(match(pattern)(url)).to.be.false;
});

test('partially matched querystring key/value pair', function(){
  var pattern = 'GET /ponies.json?kind=earth&mane=pink';
  var url     = 'GET /ponies.json?kind=pegasus&mane=pink';

  expect(match(pattern)(url)).to.be.false;
});

test('matched querystring pattern', function() {
  var pattern = 'GET /ponies.json?kind=:kind';
  var url     = 'GET /ponies.json?kind=earth';
  var matches = { kind: 'earth' };

  expect(match(pattern)(url)).to.deep.equal(matches);
});

test('matched many querystring pattern', function() {
  var pattern = 'GET /ponies.json?kind=:kind&mane=:mane';
  var url     = 'GET /ponies.json?kind=earth&mane=pink';
  var matches = { kind: 'earth', mane: 'pink' };

  expect(match(pattern)(url)).to.deep.equal(matches);
});

test('unmatched querystring pattern', function() {
  var pattern = 'GET /ponies.json?kind=:kind&mane=:mane';
  var url     = 'GET /ponies.json?kind=earth';
  var matches = { kind: 'earth' };

  expect(match(pattern)(url)).to.be.false
});

test('partially matched querystring pattern', function(){
  var pattern = 'GET /ponies.json?kind=:kind&mane=pink';
  var url     = 'GET /ponies.json?kind=earth&mane=blue';

  expect(match(pattern)(url)).to.be.false;
});

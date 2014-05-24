var expect = require('chai').expect
var search = require('../lib/searcher').search;

suite("Searcher");

var table = {
  'GET /:resource.json': 0,
  'GET /ponies.json'   : 1
};

test('first to match is returned', function(){
  var fetch = search(table);
  var value = [0, { resource: 'ponies' }];

  expect(fetch('GET /ponies.json')).to.deep.eq(value);
});

test('returns undefined when route is not found', function(){
  var fetch = search(table);

  expect(fetch('GET /ponies/applejack.json')).to.be.undefined;
});

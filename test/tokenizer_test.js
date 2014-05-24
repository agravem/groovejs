var expect     = require('chai').expect;
var Tokenizer  = require('../lib/tokenizer');

suite('Tokenizer');

test('GET /', function(){
  var tokenizer = new Tokenizer('GET /');
  var tokens    = { verb: 'GET', path: ['/'], query: {} };

  expect(tokenizer.tokens()).to.deep.equal(tokens);
});

test('POST /ponies/:id.json', function(){
  var tokenizer = new Tokenizer('POST /ponies/:id.json');
  var tokens    = { verb: 'POST', path: ['/ponies', '/:id.json'], query: {} };

  expect(tokenizer.tokens()).to.deep.equal(tokens);
});

test('GET /ponies.json?kind=earth&mane=:mane', function(){
  var tokenizer = new Tokenizer('GET /ponies.json?kind=earth&mane=:mane');
  var tokens    = { verb: 'GET', 
                    path: ['/ponies.json'], 
                    query: { 
                      kind: 'earth',
                      mane: ':mane' }};

  expect(tokenizer.tokens()).to.deep.equal(tokens);
});

var expect = require('chai').expect;
var route  = require('../lib/router').route;

suite("Router");

test('calls next when route is not found', function(){
  var routes = { 'GET /': function(){} };
  var nextCalled = false
  var next  = function() { nextCalled = true };
  var req   = { url: 'POST /' };
  var res   = {};

  route(routes)(req, res, next);

  expect(nextCalled).to.be.true;
});

test('inject params into request', function() {
  var routes = { 'GET /:resource.json': function() {} }
  var req = { url: 'GET /ponies.json' };

  route(routes)(req)

  expect(req.params).not.to.be.undefined;
});

test('calls handler when route is found', function() {
  var handlerCalled = false;
  var routes = { 'GET /': function() { handlerCalled = true } };
  var req = { url: 'GET /' };

  route(routes)(req)

  expect(handlerCalled).to.be.true;
});

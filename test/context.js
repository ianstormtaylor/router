
describe('Context', function () {

  var assert = require('assert');
  var history = require('history');
  var Context = require('router').Context;

  afterEach(function () {
    history.replace('/');
  });

  it('should store a path', function () {
    var context = new Context('/path');
    assert('/path' == context.path);
  });

  it('should store a querystring', function () {
    var context = new Context('/path?key=value');
    assert('value' == context.query.key);
  });

  it('should create an empty params array', function () {
    var context = new Context();
    assert(context.params instanceof Array);
    assert(0 === context.params.length);
  });

  it('should get state from history', function () {
    history.push('/', { state: 'state' });
    var context = new Context();
    assert('state' == context.state.state);
  });

  it('should default to an empty state object', function () {
    var context = new Context();
    assert('object' == typeof context.state);
  });
});
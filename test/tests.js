describe('Router', function () {

var assert = require('assert')
  , history = require('history')
  , noop = function () {}
  , Router = require('router')
  , trigger = require('trigger-event');

describe('.use', function () {
  it('should be pluggable', function (done) {
    Router.use(function (r) {
      assert(Router === r);
      done();
    });
  });
});

describe('#push', function () {
  it('should push path to history', function () {
    var router = new Router().push('/push');
    assert('/push' == history.path());
  });

  it('should push state to history', function () {
    var router = new Router().push('/push', { state: 'push' });
    assert('push' == history.state().state);
  });
});

describe('#replace', function () {
  it('should replace history', function () {
    var router = new Router().replace('/replace');
    assert('/replace' == history.path());
  });

  it('should replace state in history', function () {
    var router = new Router().replace('/replace', { state: 'replace' });
    assert('replace' == history.state().state);
  });
});

describe('#on', function () {
  it('should add callbacks', function () {
    var router = new Router().on('/something', noop, noop);
    assert(2 == router.callbacks.length);
  });
});

describe('#dispatch', function () {
  it('should invoke a matching route', function (done) {
    var router = new Router()
      .on('/user', function () {
        assert(false); // shouldn't be invoked
      })
      .on('/user/:id/:page', function (context, next) {
        assert('7' == context.params.id);
        assert('bio' == context.params.page);
        done();
      })
      .dispatch('/user/7/bio');
  });

  it('should pass a next callback', function (done) {
    var router = new Router()
      .on('/user', function (context, next) { next(); })
      .on('/user', function (context, next) { next(); done(); })
      .dispatch('/user');
  });
});

describe('#go', function () {
  it('should push and dispatch a path', function (done) {
    var router = new Router()
      .on('/user', function () {
        assert('/user' == history.path());
        done();
      })
      .go('/user');
  });

  it('should default to the current path', function (done) {
    var router = new Router()
      .replace('/something')
      .on('/something', function () { done(); })
      .go();
  });
});

describe('#listen', function () {
  it('should go and listen clicks', function (done) {
    var i = 0;
    var router = new Router()
      .push('/start')
      .on('/start', function () { i++; })
      .on('/link', function () {
        assert(1 == i);
        done();
      })
      .listen();
    trigger(document.getElementById('link'), 'click');
  });
});

});
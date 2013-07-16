describe('Router', function () {

var assert = require('assert')
  , history = require('history')
  , noop = function () {}
  , Router = require('router');

describe('.use', function () {
  it('should be pluggable', function (done) {
    Router.use(function (r) {
      assert(Router === r);
      done();
    });
  });
});

describe('#on', function () {
  // it('should return a route', function () {
  //   var router = new Router();
  //   var route = router.on('/something');
  //   assert('Route' === route.constructor.name);
  // });

  it('should add callbacks', function () {
    var router = new Router();
    var route = router.on('/something', noop, noop);
    assert(2 === router.callbacks.length);
  });
});

describe('#dispatch', function () {
  it('should invoke a matching route', function (done) {
    var router = new Router();

    router.on('/user', function () {
      assert(false); // shouldn't be invoked
    });

    router.on('/user/:id/:page', function (id, page, next) {
      assert('7' === id);
      assert('bio' === page);
      done();
    });

    router.dispatch('/user/7/bio');
  });

  it('should pass a next callback', function (done) {
    var router = new Router();
    router.on('/user', function (next) { next(); });
    router.on('/user', function (next) { next(); done(); });
    router.dispatch('/user');
  });
});

describe('#go', function () {
  it('should push and dispatch a path', function (done) {
    var router = new Router();
    router.on('/user', function () {
      assert('/user' === location.pathname);
      done();
    });
    router.go('/user');
  });

  it('should default to the current path', function (done) {
    var router = new Router();
    router.on('/something', function () { done(); });
    history.replace('/something');
    router.go();
  });
});

describe('#listen', function () {
  it('should go', function (done) {
    var router = new Router();
    router.on('/start', function () {
      done();
    });
    history.push('/start');
    router.listen();
  });

  it('shouldnt go if false', function () {
    var router = new Router();
    router.on('/start', function () {
      assert(false); // shoudln't be invoked
    });
    history.push('/start');
    router.listen(false);
  });

  it('should start listening for href clicks', function (done) {
    var router = new Router();
    router.on('/link', function () {
      done();
    });
    router.listen(false);
    click(document.getElementById('link'));
  });

  it('should namespace listening');
});

describe('#push', function () {
  it('should push to history', function () {
    var router = new Router();
    router.push('/push');
    assert('/push' === location.pathname);
  });
});

describe('#replace', function () {
  it('should replace history', function () {
    var router = new Router();
    router.replace('/replace');
    assert('/replace' === location.pathname);
  });
});

});


/**
 * Pseudo-click a `link` element cross-browser.
 *
 * @param {Element} link
 */

function click (link) {
  if (document.createEvent) {
    var e = document.createEvent('MouseEvent');
    e.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
  } else {
    link.fireEvent('onClick');
  }
}
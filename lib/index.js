
var Context = require('./context')
  , history = require('history')
  , link = require('link-delegate')
  , prevent = require('prevent')
  , Route = require('./route')
  , stop = require('stop')
  , url = require('url');


/**
 * Expose `Router`.
 */

module.exports = exports = Router;


/**
 * Expose `Route`.
 */

exports.Route = Route;


/**
 * Expose `Context`.
 */

exports.Context = Context;


/**
 * Initialize a new `Router`.
 */

function Router () {
  this.callbacks = [];
  this.running = false;
}


/**
 * Use the given `plugin`.
 *
 * @param {Function} plugin
 * @return {Router}
 */

Router.use = function (plugin) {
  plugin(this);
  return this;
};


/**
 * Attach a route handler.
 *
 * @param {String} path
 * @param {Functions...} fns
 * @return {Router}
 */

Router.prototype.on = function (path) {
  var route = new Route(path);
  var fns = Array.prototype.slice.call(arguments, 1);
  for (var i = 1; i < arguments.length; i++) {
    this.callbacks.push(route.middleware(arguments[i]));
  }
  return this;
};


/**
 * Trigger a route at `path`.
 *
 * @param {String} path
 * @return {Router}
 */

Router.prototype.dispatch = function (path) {
  var context = this._context = new Context(path, this._context);
  var callbacks = this.callbacks;
  var i = 0;

  function next () {
    var fn = callbacks[i++];
    if (fn) fn(context, next);
  }

  next();
  return this;
};


/**
 * Dispatch a new `path` and push it to the history, or use the current path.
 *
 * @param {String} path (optional)
 * @return {Router}
 */

Router.prototype.go = function (path) {
  if (!path) {
    var l = window.location;
    path = l.pathname;
    if (l.search) path += l.search;
  } else {
    this.push(path);
  }

  this.dispatch(path);
  return this;
};


/**
 * Start the router and listen for link clicks relative to an optional `path`.
 * You can optionally set `go` to false to manage the first dispatch yourself.
 *
 * @param {String} path
 * @return {Router}
 */

Router.prototype.listen = function (path, go) {
  if ('boolean' === typeof path) {
    go = path;
    path = null;
  }

  if (go || go === undefined) this.go();

  var self = this;
  link(function (e) {
    var el = e.target;
    var href = el.href;
    if (!routable(href, path)) return;
    var parsed = url.parse(href);
    self.go(parsed.pathname);
    prevent(e);
    stop(e);
  });

  return this;
};


/**
 * Push a new `path` to the browsers history.
 *
 * @param {String} path
 * @return {Router}
 */

Router.prototype.push = function (path) {
  history.push(path);
  return this;
};


/**
 * Replace the current path in the browsers history.
 *
 * @param {String} path
 * @return {Router}
 */

Router.prototype.replace = function (path) {
  history.replace(path);
  return this;
};


/**
 * Check if a given `href` is routable under `path`.
 *
 * @param {String} href
 * @return {Boolean}
 */

function routable (href, path) {
  if (!path) return true;
  var parsed = url.parse(href);
  if (parsed.pathname.indexOf(path) === 0) return true;
  return false;
}

var bind = require('event').bind;
var Context = require('./context');
var history = require('history');
var link = require('link-delegate');
var prevent = require('prevent');
var Route = require('./route');
var stop = require('stop');
var tick = require('next-tick');
var url = require('url');

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
  this.routes = [];
  this.bind();
}

/**
 * Use the given `plugin`.
 *
 * @param {Function} plugin
 * @return {Router}
 */

Router.prototype.use = function (plugin) {
  plugin(this);
  return this;
};

/**
 * Attach a route handler.
 *
 * @param {String} path
 * @param {Functions...} (optional)
 * @return {Router}
 */

Router.prototype.on = function (path) {
  var route = this._route = new Route(path);
  var fns = [].slice.call(arguments, 1);
  this.in.apply(this, fns);
  this.routes.push(route);
  return this;
};

/**
 * Add `in` middleware for the current route.
 *
 * @param {Functions...}
 */

Router.prototype.in = function () {
  return this.add('in', [].slice.call(arguments));
};

/**
 * Add `out` middleware for the current route.
 *
 * @param {Functions...}
 */

Router.prototype.out = function () {
  return this.add('out', [].slice.call(arguments));
};

/**
 * Trigger a route at `path`.
 *
 * @param {String} path
 * @return {Router}
 */

Router.prototype.dispatch = function (path) {
  var context = this.context(path);
  var route = this._route;
  if (route && context.previous) route.run('out', context.previous);

  var routes = this.routes;
  for (var i = 0, l = routes.length; i < l; i++) {
    routes[i].run('in', context);
  }

  return this;
};

/**
 * Dispatch a new `path` and push it to the history, or use the current path.
 *
 * @param {String} path (optional)
 * @param {Object} state (optional)
 * @return {Router}
 */

Router.prototype.start =
Router.prototype.go = function (path, state) {
  if (!path) {
    path = location.pathname + location.search;
  } else {
    this.push(path, state);
  }

  this.dispatch(path);
  return this;
};

/**
 * Start the router and listen for link clicks relative to an optional `path`.
 * You can optionally set `start` to false to manage the first dispatch yourself.
 *
 * @param {String} path
 * @param {Boolean} start
 * @return {Router}
 */

Router.prototype.listen = function (path, start) {
  if ('boolean' == typeof path) {
    start = path;
    path = null;
  }

  if (start || start === undefined) this.start();

  var self = this;
  link(function (e) {
    var el = e.delegateTarget;
    var href = el.href;
    if (!el.hasAttribute('href') || !routable(href, path)) return;
    prevent(e);
    stop(e);
    var parsed = url.parse(href);
    self.go(parsed.pathname);
  });

  return this;
};

/**
 * Push a new `path` to the browsers history.
 *
 * @param {String} path
 * @param {Object} state (optional)
 * @return {Router}
 */

Router.prototype.push = function (path, state) {
  history.push(path, state);
  return this;
};

/**
 * Replace the current path in the browsers history.
 *
 * @param {String} path
 * @param {Object} state (optional)
 * @return {Router}
 */

Router.prototype.replace = function (path, state) {
  history.replace(path, state);
  return this;
};

/**
 * Bind to `popstate` so that the router follow back events. Bind after the
 * document has loaded, and after an additional tick because some browsers
 * trigger a `popstate` event when the page first loads.
 *
 * @api private
 */

Router.prototype.bind = function () {
  var self = this;
  setTimeout(function () {
    bind(window, 'popstate', function (e) {
      self.go();
    });
  }, 2000);
};

/**
 * Add `type` middleware `fns` to the current route.
 *
 * @param {String} type
 * @param {Array of Functions} fns
 * @return {Router}
 * @api private
 */

Router.prototype.add = function (type, fns) {
  var route = this._route;
  if (!route) throw new Error('Must define a route first.');
  for (var i = 0; i < fns.length; i++) route[type](fns[i]);
  return this;
};

/**
 * Generate a new context object for a given `path`.
 *
 * @param {String} path
 * @return {Context}
 * @api private
 */

Router.prototype.context = function (path) {
  var previous = this._context;
  var context = this._context = new Context(path);
  context.previous = previous;
  return context;
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

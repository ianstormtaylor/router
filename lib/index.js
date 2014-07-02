
var event = require('event');
var Context = require('./context');
var history = require('history');
var link = require('link-delegate');
var indexof = require('indexof');
var prevent = require('prevent');
var Route = require('./route');
var stop = require('stop');
var url = require('url');

/**
 * Initials
 */

var pop = 'state' in window.history ? true : false;
var bound = false;

/**
 * All the routers
 */

var routers = [];

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
  if (!(this instanceof Router)) return new Router;
  routers.push(this);
  this.routes = [];
  bind();
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
  this['in'].apply(this, fns);
  this.routes.push(route);
  return this;
};

/**
 * Add `in` middleware for the current route.
 *
 * @param {Functions...}
 */

Router.prototype['in'] = function () {
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
    pop = false;
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
  pop = false;
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
  pop = false;
  return this;
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
 * Unbind the router
 *
 * @return {Router}
 * @api private
 */

Router.prototype.unbind = function() {
  var i = indexof(routers, this);
  if(~i) routers.splice(i, 1);
  return this;
};

/*
 * Static: Dispatch a new `path` and push it to the history,
 * or use the current path.
 *
 * @param {String} path (optional)
 * @param {Object} state (optional)
 * @return {Router}
 */

Router.start =
Router.go = function(path, state) {
  if (!path) {
    path = location.pathname + location.search;
  } else {
    history.push(path, state);
    pop = false;
  }

  for (var i = 0, router; router = routers[i]; i++) {
    router.dispatch(path);
  }

  return this;
}

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

/**
 * Bind to the popstate once
 */

function bind() {
  if (bound) return;
  var initial = location.href;
  event.bind(window, 'popstate', onpop);
  bound = true;

  function onpop(e) {
    if (pop && initial == location.href) return;
    for (var i = 0, router; router = routers[i]; i++) router.go();
    pop = false;
  }
}

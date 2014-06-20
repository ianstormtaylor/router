
var regexp = require('path-to-regexp');
var Ware = require('ware');

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize a new `Route` with the given `path`.
 *
 * @param {String} path
 */

function Route (path) {
  this.path = path;
  this.keys = [];
  this.regexp = regexp(path, this.keys);
  this._in = new Ware();
  this._out = new Ware();
}

/**
 * Use `in` middleware `fn`.
 *
 * @param {Function} fn
 * @return {Route}
 */

Route.prototype['in'] = function (fn) {
  this._in.use(this.middleware(fn));
  return this;
};

/**
 * Use `out` middleware `fn`.
 *
 * @param {Function} fn
 * @return {Route}
 */

Route.prototype.out = function (fn) {
  this._out.use(this.middleware(fn));
  return this;
};

/**
 * Run middleware of `type` with `context`.
 *
 * @param {String} type ('in' or 'out')
 * @param {Context} context
 * @return {Route}
 */

Route.prototype.run = function (type, context) {
  var ware = this['_' + type];
  ware.run(context);
  return this;
};

/**
 * Check if the route matches a given `path`, adding matches into `params`.
 *
 * @param {String} path
 * @param {Array} params
 * @return {Boolean}
 */

Route.prototype.match = function (path, params) {
  var keys = this.keys;
  var pathname = path.split('?')[0];
  var m = this.regexp.exec(pathname);
  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i];
    if (key) params[key.name] = val;
    params.push(val);
  }

  return true;
};

/**
 * Return route middleware with the given `fn`.
 *
 * @param {Function} fn
 * @return {Function}
 * @api private
 */

Route.prototype.middleware = function (fn) {
  var self = this;
  var match = function (context) {
    return self.match(context.path, context.params);
  };

  switch (fn.length) {
    case 3: return function (err, ctx, next) { match(ctx) ? fn(err, ctx, next) : next(); };
    case 2: return function (ctx, next) { match(ctx) ? fn(ctx, next) : next(); };
    default: return function (ctx, next) { if (match(ctx)) fn(ctx); next(); };
  }
};

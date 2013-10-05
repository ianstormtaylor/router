
var regexp = require('path-to-regexp');


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
}


/**
 * Return route middleware with the given `fn`.
 *
 * @param {Function} fn
 * @return {Function}
 */

Route.prototype.middleware = function (fn) {
  var self = this;
  return function (context, next) {
    if (!self.match(context.path, context.params)) return next();
    2 > fn.length
      ? (fn(context), next()) // not async arity
      : fn(context, next);
  };
};


/**
 * Check if the route matches a given `path`, returning false or an object.
 *
 * @param {String} path
 * @return {Boolean|Object}
 */

Route.prototype.match = function (path, params) {
  var keys = this.keys
    , pathname = path.split('?')[0]
    , m = this.regexp.exec(pathname);

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' == typeof m[i]
      ? decodeURIComponent(m[i])
      : m[i];

    if (key) {
      params[key.name] = val;
    } else {
      params.push(val);
    }
  }

  return true;
};

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
  return function (next) {
    var params = self.match(next.path);
    if (params) {
      params.push(next);
      return fn.apply(window, params);
    }
    next();
  };
};


/**
 * Check if the route matches a given `path`, returning false or an object.
 *
 * @param {String} path
 * @return {Boolean|Object}
 */

Route.prototype.match = function (path) {
  var keys = this.keys;
  var qsIndex = path.indexOf('?');
  var pathname = ~qsIndex ? path.slice(0, qsIndex) : path;
  var m = this.regexp.exec(pathname);
  var params = [];
  var args = [];

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = 'string' === typeof m[i] ? decodeURIComponent(m[i]) : m[i];
    params.push(val);
    args.push(val);
  }

  params.args = args;
  return params;
};
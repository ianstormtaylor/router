
var history = require('history');


/**
 * Expose `Context`.
 */

module.exports = Context;


/**
 * Initialize a new `Context`.
 *
 * @param {String} path
 */

function Context (path) {
  this.path = path;
  this.params = [];
  this.state = history.state() || {};
}
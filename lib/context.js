

/**
 * Expose `Context`.
 */

module.exports = Context;


/**
 * Initialize a new `Context`.
 *
 * @param {String} path
 * @param {Object} previous (optional)
 */

function Context (path, previous) {
  this.path = path;
  this.params = [];
  this.previous = previous ? previous.params : [];
}
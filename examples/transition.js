var Router = require('router');
var Page = require('page-view');

/**
 * Setup our routes.
 */

var router = new Router()
  .on('/page')
    .in(renderPage)
  .on('/page/sidebar')
    .in(showSidebar)
    .out(hideSidebar)
  .start();

/**
 * Render the page.
 *
 * @param {Context} context
 * @param {Function} next
 */

function renderPage (context, next) {
  var page = new Page();
  document.body.innerHTML = '';
  document.body.appendChild(page.el);
}

/**
 * Show the sidebar.
 *
 * @param {Context} context
 * @param {Function} next
 */

function showSidebar (context, next) {
  document.body.classList.add('has-sidebar');
}

/**
 * Hide the sidebar.
 *
 * @param {Context} context
 * @param {Function} next
 */

function hideSidebar (context, next) {
  document.body.classList.remove('has-sidebar');
}

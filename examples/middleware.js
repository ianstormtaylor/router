
var Project = require('project-model');
var ProjectPage = require('project-page');
var Router = require('router');
var User = require('user-model');
var UserPage = require('user-page');

/**
 * Setup our routes.
 */

var router = new Router()
  .on('/:user', loadUser, renderUser)
  .on('/:user/:project', loadUser, loadProject, renderProject)
  .start();

/**
 * Load a user from the server.
 *
 * @param {Context} context
 * @param {Function} next
 */

function loadUser (context, next) {
  var id = context.params.user;
  User.get(id, function (err, user) {
    if (err) return next(err);
    context.user = user;
    next();
  });
}

/**
 * Load a project from the server.
 *
 * @param {Context} context
 * @param {Function} next
 */

function loadProject (context, next) {
  var id = context.params.project;
  Project.get(id, function (err, project) {
    if (err) return next(err);
    context.project = project;
    next();
  });
}

/**
 * Render the user page.
 *
 * @param {Context} context
 * @param {Function} next
 */

function renderUser (context, next) {
  var user = context.user;
  var page = new UserPage(user);
  document.body.innerHTML = '';
  document.body.appendChild(page.el);
}

/**
 * Render the project page.
 *
 * @param {Context} context
 * @param {Function} next
 */

function renderProject (context, next) {
  var user = context.user;
  var project = context.project;
  var page = new ProjectPage(user);
  document.body.innerHTML = '';
  document.body.appendChild(page.el);
}
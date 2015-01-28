'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	projects = require('../../app/controllers/projects.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/projects')
		.get(users.requiresLogin, projects.list)
		.post(users.requiresLogin, projects.create);

	app.route('/projects/:projectId')
		.get(users.requiresLogin, projects.read)
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	// Finish by binding the project middleware
	app.param('projectId', projects.projectByID);
};

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectUsers = require('../../app/controllers/project-users.server.controller');

	// Project users Routes
	app.route('/project-users')
		.get(projectUsers.list)
		.post(users.requiresLogin, projectUsers.create);

	app.route('/project-users/:projectUserId')
		.get(projectUsers.read)
		.put(users.requiresLogin, projectUsers.hasAuthorization, projectUsers.update)
		.delete(users.requiresLogin, projectUsers.hasAuthorization, projectUsers.delete);

	// Finish by binding the Project user middleware
	app.param('projectUserId', projectUsers.projectUserByID);
};

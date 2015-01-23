'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var roles = require('../../app/controllers/roles.server.controller');

	// Roles Routes
	app.route('/roles')
		.get(users.requiresLogin, roles.list)
		.post(users.requiresLogin, roles.create);

	app.route('/roles/:roleId')
		.get(users.requiresLogin, roles.read)
		.put(users.requiresLogin, roles.update)
		.delete(users.requiresLogin, roles.delete);

	// Finish by binding the Role middleware
	app.param('roleId', roles.roleByID);
};

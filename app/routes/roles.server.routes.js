'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var roles = require('../../app/controllers/roles.server.controller');

	app.route('/roles')
		.get(users.requiresLogin, roles.list)
		.post(users.requiresLogin, roles.create);

	app.route('/roles/:roleId')
		.get(users.requiresLogin, roles.read)
		.put(users.requiresLogin, roles.update);

	app.param('roleId', roles.roleByID);
};

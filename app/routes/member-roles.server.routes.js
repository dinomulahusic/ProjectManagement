'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var memberRoles = require('../../app/controllers/member-roles.server.controller');

	// Member roles Routes
	app.route('/member-roles')
		.get(users.requiresLogin, memberRoles.list)
		.post(users.requiresLogin, memberRoles.create);

	app.route('/member-roles/:memberRoleId')
		.get(users.requiresLogin, memberRoles.read)
		.put(users.requiresLogin, memberRoles.hasAuthorization, memberRoles.update)
		.delete(users.requiresLogin, memberRoles.hasAuthorization, memberRoles.delete);

	// Finish by binding the Member role middleware
	app.param('memberRoleId', memberRoles.memberRoleByID);
};

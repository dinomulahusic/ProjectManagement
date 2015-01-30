'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var members = require('../../app/controllers/members.server.controller');

	app.route('/members')
		.get(users.requiresLogin, members.list)
		.post(users.requiresLogin, members.create);

	app.route('/members/:memberId')
		.get(users.requiresLogin, members.read)
		.put(users.requiresLogin, members.hasAuthorization, members.update)
		.delete(users.requiresLogin, members.hasAuthorization, members.delete);

	app.param('memberId', members.memberByID);
};

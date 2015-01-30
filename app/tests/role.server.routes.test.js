'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Role = mongoose.model('Role'),
	agent = request.agent(app);

var credentials, user, role;

describe('Role CRUD tests', function() {
	beforeEach(function(done) {
		credentials = {
			username: 'username',
			password: 'password'
		};

		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		user.save(function() {
			role = {
				name: 'Role Name'
			};

			done();
		});
	});

	it('should be able to save Role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/roles')
					.send(role)
					.expect(200)
					.end(function(roleSaveErr, roleSaveRes) {
						if (roleSaveErr) 
							done(roleSaveErr);

						agent.get('/roles')
							.end(function(rolesGetErr, rolesGetRes) {
								if (rolesGetErr) 
									done(rolesGetErr);

								var roles = rolesGetRes.body;
								roles[0].name.should.match(role.name);
								done();
							});
					});
			});
	});

  it('should not be able to save duplicate Role instance', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

        		var role1 = {
				  	name: 'Role Name duplicate'
			  	};

        		var role2 = {
				  	name: role1.name
			  	};

				agent.post('/roles')
					.send(role1)
					.expect(200)
					.end(function(roleSaveErr, roleSaveRes) {
						if (roleSaveErr) 
							done(roleSaveErr);

						agent.post('/roles')
				            .send(role2)
				            .expect(400)
				            .end(function(roleSaveErrDup, roleSaveResDup) {
					            roleSaveResDup.body.message.should.match('Name already exists');
					            done(roleSaveErrDup);
			            });
					});
			});
	});


	it('should not be able to save Role instance if not logged in', function(done) {
		agent.post('/roles')
			.send(role)
			.expect(401)
			.end(function(roleSaveErr, roleSaveRes) {
				done(roleSaveErr);
			});
	});

	it('should not be able to save Role instance if no name is provided', function(done) {
		role.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/roles')
					.send(role)
					.expect(400)
					.end(function(roleSaveErr, roleSaveRes) {
						roleSaveRes.body.message.should.match('Please fill Role name');
						done(roleSaveErr);
					});
			});
	});

	it('should be able to update Role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/roles')
					.send(role)
					.expect(200)
					.end(function(roleSaveErr, roleSaveRes) {
						if (roleSaveErr) 
							done(roleSaveErr);

						role.name = 'WHY YOU GOTTA BE SO MEAN?';

						agent.put('/roles/' + roleSaveRes.body._id)
							.send(role)
							.expect(200)
							.end(function(roleUpdateErr, roleUpdateRes) {
								if (roleUpdateErr) 
									done(roleUpdateErr);

								roleUpdateRes.body._id.should.equal(roleSaveRes.body._id);
								roleUpdateRes.body.name.should.match(role.name);
								done();
							});
					});
			});
	});

	it('should not be able to get a list of Roles if not signed in', function(done) {
		agent.get('/roles')
			.expect(401)
			.end(function(projectSaveErr, projectSaveRes) {
				done(projectSaveErr);
			});
	});


	it('should not be able to get a single Role if not signed in', function(done) {
		var roleObj = new Role(role);

		roleObj.save(function() {
			request(app).get('/roles/' + roleObj._id)
				.expect(401)
			  	.end(function(projectSaveErr, projectSaveRes) {
			        done(projectSaveErr);
				});
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Role.remove().exec();
		done();
	});
});

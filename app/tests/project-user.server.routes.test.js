'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectUser = mongoose.model('ProjectUser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectUser;

/**
 * Project user routes tests
 */
describe('Project user CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Project user
		user.save(function() {
			projectUser = {
				name: 'Project user Name'
			};

			done();
		});
	});

	it('should be able to save Project user instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project user
				agent.post('/project-users')
					.send(projectUser)
					.expect(200)
					.end(function(projectUserSaveErr, projectUserSaveRes) {
						// Handle Project user save error
						if (projectUserSaveErr) done(projectUserSaveErr);

						// Get a list of Project users
						agent.get('/project-users')
							.end(function(projectUsersGetErr, projectUsersGetRes) {
								// Handle Project user save error
								if (projectUsersGetErr) done(projectUsersGetErr);

								// Get Project users list
								var projectUsers = projectUsersGetRes.body;

								// Set assertions
								(projectUsers[0].user._id).should.equal(userId);
								(projectUsers[0].name).should.match('Project user Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project user instance if not logged in', function(done) {
		agent.post('/project-users')
			.send(projectUser)
			.expect(401)
			.end(function(projectUserSaveErr, projectUserSaveRes) {
				// Call the assertion callback
				done(projectUserSaveErr);
			});
	});

	it('should not be able to save Project user instance if no name is provided', function(done) {
		// Invalidate name field
		projectUser.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project user
				agent.post('/project-users')
					.send(projectUser)
					.expect(400)
					.end(function(projectUserSaveErr, projectUserSaveRes) {
						// Set message assertion
						(projectUserSaveRes.body.message).should.match('Please fill Project user name');
						
						// Handle Project user save error
						done(projectUserSaveErr);
					});
			});
	});

	it('should be able to update Project user instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project user
				agent.post('/project-users')
					.send(projectUser)
					.expect(200)
					.end(function(projectUserSaveErr, projectUserSaveRes) {
						// Handle Project user save error
						if (projectUserSaveErr) done(projectUserSaveErr);

						// Update Project user name
						projectUser.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project user
						agent.put('/project-users/' + projectUserSaveRes.body._id)
							.send(projectUser)
							.expect(200)
							.end(function(projectUserUpdateErr, projectUserUpdateRes) {
								// Handle Project user update error
								if (projectUserUpdateErr) done(projectUserUpdateErr);

								// Set assertions
								(projectUserUpdateRes.body._id).should.equal(projectUserSaveRes.body._id);
								(projectUserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project users if not signed in', function(done) {
		// Create new Project user model instance
		var projectUserObj = new ProjectUser(projectUser);

		// Save the Project user
		projectUserObj.save(function() {
			// Request Project users
			request(app).get('/project-users')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project user if not signed in', function(done) {
		// Create new Project user model instance
		var projectUserObj = new ProjectUser(projectUser);

		// Save the Project user
		projectUserObj.save(function() {
			request(app).get('/project-users/' + projectUserObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectUser.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project user instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project user
				agent.post('/project-users')
					.send(projectUser)
					.expect(200)
					.end(function(projectUserSaveErr, projectUserSaveRes) {
						// Handle Project user save error
						if (projectUserSaveErr) done(projectUserSaveErr);

						// Delete existing Project user
						agent.delete('/project-users/' + projectUserSaveRes.body._id)
							.send(projectUser)
							.expect(200)
							.end(function(projectUserDeleteErr, projectUserDeleteRes) {
								// Handle Project user error error
								if (projectUserDeleteErr) done(projectUserDeleteErr);

								// Set assertions
								(projectUserDeleteRes.body._id).should.equal(projectUserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project user instance if not signed in', function(done) {
		// Set Project user user 
		projectUser.user = user;

		// Create new Project user model instance
		var projectUserObj = new ProjectUser(projectUser);

		// Save the Project user
		projectUserObj.save(function() {
			// Try deleting Project user
			request(app).delete('/project-users/' + projectUserObj._id)
			.expect(401)
			.end(function(projectUserDeleteErr, projectUserDeleteRes) {
				// Set message assertion
				(projectUserDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project user error error
				done(projectUserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectUser.remove().exec();
		done();
	});
});
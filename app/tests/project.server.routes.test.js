'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project'),
	agent = request.agent(app);

var credentials, user, project;

describe('Project CRUD tests', function() {
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
			project = new Project({
				title: 'project Title',
				description: 'project description'
			});

			done();
		});
	});

	it('should be able to save a project if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/projects')
					.send(project)
					.expect(200)
					.end(function(projectSaveErr, projectSaveRes) {
						if (projectSaveErr)
							done(projectSaveErr);

						agent.get('/projects')
							.end(function(projectsGetErr, projectsGetRes) {
								if (projectsGetErr) 
									done(projectsGetErr);

								var projects = projectsGetRes.body;

								(projects[0].user_created._id).should.equal(user.id);
								(projects[0].title).should.match(project.title);

								done();
							});
					});
			});
	});

	it('should not be able to save a project if not logged in', function(done) {
		agent.post('/projects')
			.send(project)
			.expect(401)
			.end(function(projectSaveErr, projectSaveRes) {
				done(projectSaveErr);
			});
	});

	it('should not be able to save a project if no title is provided', function(done) {
		project.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/projects')
					.send(project)
					.expect(400)
					.end(function(projectSaveErr, projectSaveRes) {
						projectSaveRes.body.message.should.match('Title cannot be blank');
						done(projectSaveErr);
					});
			});
	});

	it('should be able to update a project if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/projects')
					.send(project)
					.expect(200)
					.end(function(projectSaveErr, projectSaveRes) {
						if (projectSaveErr) 
							done(projectSaveErr);

						project.title = 'WHY YOU GOTTA BE SO MEAN?';

						agent.put('/projects/' + projectSaveRes.body._id)
							.send(project)
							.expect(200)
							.end(function(projectUpdateErr, projectUpdateRes) {
								if (projectUpdateErr) 
									done(projectUpdateErr);

								projectUpdateRes.body._id.should.equal(projectSaveRes.body._id);
								projectUpdateRes.body.title.should.match(project.title);
								done();
							});
					});
			});
	});

	it('should not be able to get a list of projects if not signed in', function(done) {
		agent.get('/projects')
			.expect(401)
			.end(function(projectSaveErr, projectSaveRes) {
				done(projectSaveErr);
			});
	});


	it('should not be able to get a single project if not signed in', function(done) {
		project.user_created = user;

		project.save(function() {
			request(app).get('/projects/' + project._id)
				.expect(401)
			  	.end(function(projectSaveErr, projectSaveRes) {
          			done(projectSaveErr);
				});
		});
	});

	it('should be able to delete a project if signed in', function(done) {
		project.user_created = user;

		project.save(function() {
			agent.post('/auth/signin')
				.send(credentials)
				.expect(200)
				.end(function(signinErr, signinRes) {
					if (signinErr) 
						done(signinErr);						

					agent.delete('/projects/' + project.id)
						.send(project)
						.expect(200)
						.end(function(projectDeleteErr, projectDeleteRes) {
							if (projectDeleteErr) 
								done(projectDeleteErr);

							projectDeleteRes.body._id.should.equal(project.id);

							done();
						});
				});
		});		
	});

	it('should not be able to delete an project if not signed in', function(done) {
		project.user_created = user;

		project.save(function() {
			request(app).delete('/projects/' + project._id)
			.expect(401)
			.end(function(projectDeleteErr, projectDeleteRes) {
				projectDeleteRes.body.message.should.match('User is not logged in');
				done(projectDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Project.remove().exec();
		done();
	});
});

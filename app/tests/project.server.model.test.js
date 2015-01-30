'use strict';

var should = require('should'),
	errorHandler = require('../controllers/errors.server.controller'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project');

var user, project;

describe('Project Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			project = new Project({
				title: 'Project Title',
				description: 'Project Content',
				user_created: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return project.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should not be possible to save project with duplicate title', function(done) {
			return project.save(function(err) {
				should.not.exist(err);

				var duplicateProject = new Project({
					title: project.title,
					user_created: project.user_created
				});

				duplicateProject.save(function(err) {
					errorHandler.getErrorMessage(err).should.match('Title already exists');
					done();
				});	
			});
		});

		it('should show an error when try to save without title', function(done) {
			project.title = '';

			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Project.remove().exec();
		User.remove().exec();
		done();
	});
});

'use strict';

var should = require('should'),
	mongoose = require('mongoose'),
	errorHandler = require('../controllers/errors.server.controller'),
	User = mongoose.model('User'),
  	Project = mongoose.model('Project'),
	Member = mongoose.model('Member');

var user, member, project;

describe('Member Model Unit Tests:', function() {
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

      		project.save(function() {
	        	member = new Member({
		          	project: project,
		          	user: user
	        	});

        		done();
		  	});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return member.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should show an error when try to save without project', function(done) {
			member.project = null;

			return member.save(function(err) {
				errorHandler.getErrorMessage(err).should.match('Project is required');
				done();
			});
		});

		it('should show an error when try to save without user', function(done) {
			member.user = null;
			member.project = project;

			return member.save(function(err) {
				errorHandler.getErrorMessage(err).should.match('User is required');
				done();
			});
		});
	});

	afterEach(function(done) {
		Member.remove().exec();
		User.remove().exec();
		Project.remove().exec();
		done();
	});
});

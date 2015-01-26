'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  Project = mongoose.model('Project'),
	ProjectUser = mongoose.model('ProjectUser');

/**
 * Globals
 */
var user, projectUser, project;

/**
 * Unit tests
 */
describe('Project user Model Unit Tests:', function() {
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
        projectUser = new ProjectUser({
          project: project,
          user: user
        });

        done();
		  });
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return projectUser.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without project', function(done) {
			projectUser.project = null;

			return projectUser.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		ProjectUser.remove().exec();
		User.remove().exec();

		done();
	});
});

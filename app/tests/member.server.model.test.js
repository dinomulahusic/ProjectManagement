'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  Project = mongoose.model('Project'),
	Member = mongoose.model('Member');

/**
 * Globals
 */
var user, member, project;

/**
 * Unit tests
 */
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

		/*it('should be able to show an error when try to save without project', function(done) {
			member.project = null;

			return member.save(function(err) {
				should.exist(err);
				done();
			});
		});*/
	});

	afterEach(function(done) {
		Member.remove().exec();
		User.remove().exec();

		done();
	});
});

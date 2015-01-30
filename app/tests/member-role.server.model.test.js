'use strict';

var should = require('should'),
	errorHandler = require('../controllers/errors.server.controller'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MemberRole = mongoose.model('MemberRole'),
  	Member = mongoose.model('Member'),
  	Role = mongoose.model('Role'),
  	Project = mongoose.model('Project');

var user, member, role, memberRole, project;

describe('Member role Model Unit Tests:', function() {
	beforeEach(function(done) {
    	user = new User ({
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

        		member.save(function() {
          			role = new Role({
            			name: 'Role'
          			});

          			role.save(function() {
            			memberRole = new MemberRole({
              				member: member,
              				role: role
            			});

            			done();
          			});
        		});
      		});
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return memberRole.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should show an error when try to save without member', function(done) {
			memberRole.member = null;

			return memberRole.save(function(err) {
				errorHandler.getErrorMessage(err).should.match('Member is required');
				done();
			});
		});

    	it('should show an error when try to save without role', function(done) {
			memberRole.role = null;

			return memberRole.save(function(err) {
				errorHandler.getErrorMessage(err).should.match('Role is required');
				done();
			});
		});
	});

	afterEach(function(done) {
		MemberRole.remove().exec();
    	Role.remove().exec();
    	Member.remove().exec();
    	Project.remove().exec();
		User.remove().exec();

		done();
	});
});

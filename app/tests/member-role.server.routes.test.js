'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MemberRole = mongoose.model('MemberRole'),
  	Member = mongoose.model('Member'),
  	Role = mongoose.model('Role'),
  	Project = mongoose.model('Project'),
	agent = request.agent(app);

var credentials, user, member, role, memberRole, project;

describe('Member role CRUD tests', function() {
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

	it('should be able to save Member role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/member-roles')
					.send(memberRole)
					.expect(200)
					.end(function(memberRoleSaveErr, memberRoleSaveRes) {
						if (memberRoleSaveErr) 
							done(memberRoleSaveErr);

						agent.get('/member-roles')
							.end(function(memberRolesGetErr, memberRolesGetRes) {
								if (memberRolesGetErr) 
									done(memberRolesGetErr);

								var memberRoles = memberRolesGetRes.body;

								memberRoles[0].member._id.should.equal(member.id);
								memberRoles[0].role._id.should.equal(role.id);

								done();
							});
					});
			});
	});

	it('should not be able to save Member role instance if not logged in', function(done) {
		agent.post('/member-roles')
			.send(memberRole)
			.expect(401)
			.end(function(memberRoleSaveErr, memberRoleSaveRes) {
				done(memberRoleSaveErr);
			});
	});

	it('should not be able to get a list of member roles if not signed in', function(done) {
		agent.get('/member-roles')
			.expect(401)
			.end(function(memberRoleSaveErr, memberRoleSaveRes) {
				done(memberRoleSaveErr);
			});
	});


	it('should not be able to get a single member if not signed in', function(done) {
		memberRole.save(function() {
			request(app).get('/member-roles/' + memberRole._id)
				.expect(401)
			  	.end(function(memberRoleSaveErr, memberRoleSaveRes) {
          			done(memberRoleSaveErr);
				});
		});
	});

	it('should be able to delete Member role instance if signed in', function(done) {
		memberRole.save(function() {
			agent.post('/auth/signin')
				.send(credentials)
				.expect(200)
				.end(function(signinErr, signinRes) {
					if (signinErr) 
						done(signinErr);

					agent.delete('/member-roles/' + memberRole.id)
						.send(memberRole)
						.expect(200)
						.end(function(memberRoleDeleteErr, memberRoleDeleteRes) {
							if (memberRoleDeleteErr) 
								done(memberRoleDeleteErr);

							memberRoleDeleteRes.body._id.should.equal(memberRole.id);
							done();
						});
				});
		});
	});

	it('should not be able to delete Member role instance if not signed in', function(done) {
    	memberRole.save(function() {
			request(app).delete('/member-roles/' + memberRole._id)
				.expect(401)
			  	.end(function(projectDeleteErr, projectDeleteRes) {
          			projectDeleteRes.body.message.should.match('User is not logged in');
          			done(projectDeleteErr);
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

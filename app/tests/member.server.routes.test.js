'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  	Project = mongoose.model('Project'),
	Member = mongoose.model('Member'),
	agent = request.agent(app);

var credentials, user, project,  member;

describe('Member CRUD tests', function() {
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
          			project: project
        		});

        		done();
		  	});
		});
	});

	it('should be able to save Member instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/members')
					.send(member)
					.expect(200)
					.end(function(memberSaveErr, memberSaveRes) {
						if (memberSaveErr) 
							done(memberSaveErr);

						agent.get('/members')
							.end(function(membersGetErr, membersGetRes) {
								if (membersGetErr) 
									done(membersGetErr);

								var members = membersGetRes.body;
								members[0].user._id.should.equal(user.id);
								members[0].project._id.should.equal(project.id);

								done();
							});
					});
			});
	});

	it('should not be able to save Member instance if not logged in', function(done) {
		agent.post('/members')
			.send(member)
			.expect(401)
			.end(function(memberSaveErr, memberSaveRes) {
				done(memberSaveErr);
			});
	});

	it('should not be able to get a list of members if not signed in', function(done) {
		agent.get('/members')
			.expect(401)
			.end(function(memberSaveErr, memberSaveRes) {
				done(memberSaveErr);
			});
	});


	it('should not be able to get a single member if not signed in', function(done) {
		member.user = user;

		member.save(function() {
			request(app).get('/members/' + member._id)
				.expect(401)
				.end(function(memberSaveErr, memberSaveRes) {
          			done(memberSaveErr);
				});
		});
	});

	it('should be able to delete Member instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				if (signinErr) 
					done(signinErr);

				agent.post('/members')
					.send(member)
					.expect(200)
					.end(function(memberSaveErr, memberSaveRes) {
						if (memberSaveErr) 
							done(memberSaveErr);

						agent.delete('/members/' + memberSaveRes.body._id)
							.send(member)
							.expect(200)
							.end(function(memberDeleteErr, memberDeleteRes) {
								if (memberDeleteErr) 
									done(memberDeleteErr);

								memberDeleteRes.body._id.should.equal(memberSaveRes.body._id);

								done();
							});
					});
			});
	});

	it('should not be able to delete Member instance if not signed in', function(done) {
		member.user = user;

		member.save(function() {
			request(app).delete('/members/' + member._id)
			.expect(401)
			.end(function(memberDeleteErr, memberDeleteRes) {
				memberDeleteRes.body.message.should.match('User is not logged in');
				done(memberDeleteErr);
			});
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Project.remove().exec();
		Member.remove().exec();
		done();
	});
});

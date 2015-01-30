'use strict';

var should = require('should'),
	mongoose = require('mongoose'),
	Role = mongoose.model('Role');

var user, role;

describe('Role Model Unit Tests:', function() {
	beforeEach(function(done) {
		role = new Role({
			name: 'Role Name'
		});

		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return role.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should show an error when try to save without name', function(done) {
			role.name = '';

			return role.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Role.remove().exec();

		done();
	});
});

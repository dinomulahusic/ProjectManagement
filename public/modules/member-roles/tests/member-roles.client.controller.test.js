'use strict';

(function() {
	// Member roles Controller Spec
	describe('Member roles Controller Tests', function() {
		// Initialize global variables
		var MemberRolesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Member roles controller.
			MemberRolesController = $controller('MemberRolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Member role object fetched from XHR', inject(function(MemberRoles) {
			// Create sample Member role using the Member roles service
			var sampleMemberRole = new MemberRoles({
				name: 'New Member role'
			});

			// Create a sample Member roles array that includes the new Member role
			var sampleMemberRoles = [sampleMemberRole];

			// Set GET response
			$httpBackend.expectGET('member-roles').respond(sampleMemberRoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.memberRoles).toEqualData(sampleMemberRoles);
		}));

		it('$scope.findOne() should create an array with one Member role object fetched from XHR using a memberRoleId URL parameter', inject(function(MemberRoles) {
			// Define a sample Member role object
			var sampleMemberRole = new MemberRoles({
				name: 'New Member role'
			});

			// Set the URL parameter
			$stateParams.memberRoleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/member-roles\/([0-9a-fA-F]{24})$/).respond(sampleMemberRole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.memberRole).toEqualData(sampleMemberRole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(MemberRoles) {
			// Create a sample Member role object
			var sampleMemberRolePostData = new MemberRoles({
				name: 'New Member role'
			});

			// Create a sample Member role response
			var sampleMemberRoleResponse = new MemberRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New Member role'
			});

			// Fixture mock form input values
			scope.name = 'New Member role';

			// Set POST response
			$httpBackend.expectPOST('member-roles', sampleMemberRolePostData).respond(sampleMemberRoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Member role was created
			expect($location.path()).toBe('/member-roles/' + sampleMemberRoleResponse._id);
		}));

		it('$scope.update() should update a valid Member role', inject(function(MemberRoles) {
			// Define a sample Member role put data
			var sampleMemberRolePutData = new MemberRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New Member role'
			});

			// Mock Member role in scope
			scope.memberRole = sampleMemberRolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/member-roles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/member-roles/' + sampleMemberRolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid memberRoleId and remove the Member role from the scope', inject(function(MemberRoles) {
			// Create new Member role object
			var sampleMemberRole = new MemberRoles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Member roles array and include the Member role
			scope.memberRoles = [sampleMemberRole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/member-roles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMemberRole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.memberRoles.length).toBe(0);
		}));
	});
}());
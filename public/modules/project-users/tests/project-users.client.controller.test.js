'use strict';

(function() {
	// Project users Controller Spec
	describe('Project users Controller Tests', function() {
		// Initialize global variables
		var ProjectUsersController,
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

			// Initialize the Project users controller.
			ProjectUsersController = $controller('ProjectUsersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project user object fetched from XHR', inject(function(ProjectUsers) {
			// Create sample Project user using the Project users service
			var sampleProjectUser = new ProjectUsers({
				name: 'New Project user'
			});

			// Create a sample Project users array that includes the new Project user
			var sampleProjectUsers = [sampleProjectUser];

			// Set GET response
			$httpBackend.expectGET('project-users').respond(sampleProjectUsers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectUsers).toEqualData(sampleProjectUsers);
		}));

		it('$scope.findOne() should create an array with one Project user object fetched from XHR using a projectUserId URL parameter', inject(function(ProjectUsers) {
			// Define a sample Project user object
			var sampleProjectUser = new ProjectUsers({
				name: 'New Project user'
			});

			// Set the URL parameter
			$stateParams.projectUserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-users\/([0-9a-fA-F]{24})$/).respond(sampleProjectUser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectUser).toEqualData(sampleProjectUser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectUsers) {
			// Create a sample Project user object
			var sampleProjectUserPostData = new ProjectUsers({
				name: 'New Project user'
			});

			// Create a sample Project user response
			var sampleProjectUserResponse = new ProjectUsers({
				_id: '525cf20451979dea2c000001',
				name: 'New Project user'
			});

			// Fixture mock form input values
			scope.name = 'New Project user';

			// Set POST response
			$httpBackend.expectPOST('project-users', sampleProjectUserPostData).respond(sampleProjectUserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project user was created
			expect($location.path()).toBe('/project-users/' + sampleProjectUserResponse._id);
		}));

		it('$scope.update() should update a valid Project user', inject(function(ProjectUsers) {
			// Define a sample Project user put data
			var sampleProjectUserPutData = new ProjectUsers({
				_id: '525cf20451979dea2c000001',
				name: 'New Project user'
			});

			// Mock Project user in scope
			scope.projectUser = sampleProjectUserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-users\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-users/' + sampleProjectUserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectUserId and remove the Project user from the scope', inject(function(ProjectUsers) {
			// Create new Project user object
			var sampleProjectUser = new ProjectUsers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project users array and include the Project user
			scope.projectUsers = [sampleProjectUser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-users\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectUser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectUsers.length).toBe(0);
		}));
	});
}());
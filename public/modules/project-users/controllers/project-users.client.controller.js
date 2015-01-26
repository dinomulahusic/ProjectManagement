'use strict';

// Project users controller
angular.module('project-users').controller('ProjectUsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ProjectUsers',
	function($scope, $stateParams, $location, Authentication, ProjectUsers) {
		$scope.authentication = Authentication;

		// Create new Project user
		$scope.create = function() {
			// Create new Project user object
			var projectUser = new ProjectUsers ({
				name: this.name
			});

			// Redirect after save
			projectUser.$save(function(response) {
				$location.path('project-users/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project user
		$scope.remove = function(projectUser) {
			if ( projectUser ) { 
				projectUser.$remove();

				for (var i in $scope.projectUsers) {
					if ($scope.projectUsers [i] === projectUser) {
						$scope.projectUsers.splice(i, 1);
					}
				}
			} else {
				$scope.projectUser.$remove(function() {
					$location.path('project-users');
				});
			}
		};

		// Update existing Project user
		$scope.update = function() {
			var projectUser = $scope.projectUser;

			projectUser.$update(function() {
				$location.path('project-users/' + projectUser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Project users
		$scope.find = function() {
			$scope.projectUsers = ProjectUsers.query();
		};

		// Find existing Project user
		$scope.findOne = function() {
			$scope.projectUser = ProjectUsers.get({ 
				projectUserId: $stateParams.projectUserId
			});
		};
	}
]);
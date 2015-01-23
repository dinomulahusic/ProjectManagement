'use strict';

// Member roles controller
angular.module('member-roles').controller('MemberRolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MemberRoles',
	function($scope, $stateParams, $location, Authentication, MemberRoles) {
		$scope.authentication = Authentication;

		// Create new Member role
		$scope.create = function() {
			// Create new Member role object
			var memberRole = new MemberRoles ({
				name: this.name
			});

			// Redirect after save
			memberRole.$save(function(response) {
				$location.path('member-roles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Member role
		$scope.remove = function(memberRole) {
			if ( memberRole ) { 
				memberRole.$remove();

				for (var i in $scope.memberRoles) {
					if ($scope.memberRoles [i] === memberRole) {
						$scope.memberRoles.splice(i, 1);
					}
				}
			} else {
				$scope.memberRole.$remove(function() {
					$location.path('member-roles');
				});
			}
		};

		// Update existing Member role
		$scope.update = function() {
			var memberRole = $scope.memberRole;

			memberRole.$update(function() {
				$location.path('member-roles/' + memberRole._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Member roles
		$scope.find = function() {
			$scope.memberRoles = MemberRoles.query();
		};

		// Find existing Member role
		$scope.findOne = function() {
			$scope.memberRole = MemberRoles.get({ 
				memberRoleId: $stateParams.memberRoleId
			});
		};
	}
]);
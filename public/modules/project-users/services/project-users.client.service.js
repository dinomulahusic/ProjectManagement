'use strict';

//Project users service used to communicate Project users REST endpoints
angular.module('project-users').factory('ProjectUsers', ['$resource',
	function($resource) {
		return $resource('project-users/:projectUserId', { projectUserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
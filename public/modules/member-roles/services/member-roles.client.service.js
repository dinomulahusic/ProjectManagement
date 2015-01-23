'use strict';

//Member roles service used to communicate Member roles REST endpoints
angular.module('member-roles').factory('MemberRoles', ['$resource',
	function($resource) {
		return $resource('member-roles/:memberRoleId', { memberRoleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
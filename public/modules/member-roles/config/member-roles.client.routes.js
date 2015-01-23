'use strict';

//Setting up route
angular.module('member-roles').config(['$stateProvider',
	function($stateProvider) {
		// Member roles state routing
		$stateProvider.
		state('listMemberRoles', {
			url: '/member-roles',
			templateUrl: 'modules/member-roles/views/list-member-roles.client.view.html'
		}).
		state('createMemberRole', {
			url: '/member-roles/create',
			templateUrl: 'modules/member-roles/views/create-member-role.client.view.html'
		}).
		state('viewMemberRole', {
			url: '/member-roles/:memberRoleId',
			templateUrl: 'modules/member-roles/views/view-member-role.client.view.html'
		}).
		state('editMemberRole', {
			url: '/member-roles/:memberRoleId/edit',
			templateUrl: 'modules/member-roles/views/edit-member-role.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('project-users').config(['$stateProvider',
	function($stateProvider) {
		// Project users state routing
		$stateProvider.
		state('listProjectUsers', {
			url: '/project-users',
			templateUrl: 'modules/project-users/views/list-project-users.client.view.html'
		}).
		state('createProjectUser', {
			url: '/project-users/create',
			templateUrl: 'modules/project-users/views/create-project-user.client.view.html'
		}).
		state('viewProjectUser', {
			url: '/project-users/:projectUserId',
			templateUrl: 'modules/project-users/views/view-project-user.client.view.html'
		}).
		state('editProjectUser', {
			url: '/project-users/:projectUserId/edit',
			templateUrl: 'modules/project-users/views/edit-project-user.client.view.html'
		});
	}
]);
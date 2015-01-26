'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// projects state routing
		$stateProvider.
    /*state('listProjects', {
			url: '/',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).*/
		state('listProjects', {
			url: '/projects',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('createProject', {
			url: '/projects/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('viewProject', {
			url: '/projects/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
    state('projectSettings', {
			url: '/projects/settings/:projectId',
			templateUrl: 'modules/projects/views/project-settings.client.view.html'
		}).
		state('editProject', {
			url: '/projects/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		});
	}
]);

'use strict';

angular
	.module('admin.webclient.main', [
		'ui.router'
	])

	.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
		function ($stateProvider, $urlRouterProvider, $httpProvider) {

      /* jshint eqeqeq:false, eqnull:true */

		// For any unmatched url
		$urlRouterProvider.otherwise('/');

    $stateProvider
			.state('main', {
				url: '/',
				views: {
					body: {
						template: '<div ui-view></div>'
					}
				},
				abstract: true
			})
			.state('main.landing', {
				url: '',
				templateUrl: 'scripts/modules/main/views/landing.html'
			});
	}]);

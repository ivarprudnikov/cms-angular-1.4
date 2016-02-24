'use strict';

/* jshint eqeqeq:false, eqnull:true */

angular
	.module('admin.webclient', [
		'ngSanitize',
    'ngAnimate',
		'schemaForm',
		'ui.router',
		'ui.bootstrap',
    'admin.webclient.main',
    'admin.webclient.header',
    'admin.webclient.modals',
    'admin.webclient.schema',
    'admin.webclient.content_type',
    'admin.webclient.content_model',
    'admin.webclient.util'
	])

	.run(['$rootScope', '$state', '$timeout', function ($rootScope, $state, $timeout) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

      $timeout(function () {
        $('html,body').animate({scrollTop: 0}, 100);
      }, 100);

    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.$broadcast('LoaderElement.stop');
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      throw error;
    });

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
      console.error(unfoundState.to);
      console.error(unfoundState.toParams);
      console.error(unfoundState.options);
    });

  }])
  .factory('$exceptionHandler', ['$injector', '$log', function($injector, $log){
    return function(exception, cause) {
      exception.message += ' (caused by "' + cause + '")';
      $log.error(exception);
    };
  }]);

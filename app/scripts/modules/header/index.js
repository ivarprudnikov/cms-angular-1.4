'use strict';

/* jshint eqeqeq:false, eqnull:true, bitwise:false */

angular
	.module('admin.webclient.header', [
    'ui.bootstrap',
    'ui.router'
	])
  .controller('HeaderMainController', ['$scope', function($scope){

    $scope.logout = function(){
      // TODO
    };

  }]);

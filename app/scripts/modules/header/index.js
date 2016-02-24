'use strict';

/* jshint eqeqeq:false, eqnull:true, bitwise:false */

angular
	.module('admin.webclient.header', [
    'ui.bootstrap',
    'ui.router'
	])
  .controller('HeaderMainController', ['$scope', 'ContentTypeService', function($scope, ContentTypeService){

    ContentTypeService.list()
      .then(function(items){
        $scope.contentTypes = items;
      });

    $scope.logout = function(){
      // TODO
    };

  }]);

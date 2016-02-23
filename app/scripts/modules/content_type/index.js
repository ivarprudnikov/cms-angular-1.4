'use strict';

/* jshint eqeqeq:false, eqnull:true */

angular
	.module('admin.webclient.content_type', [
		'ui.router',
    'admin.webclient.modals',
    'admin.webclient.schema'
	])

	.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
		function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
			.state('content_type', {
				url: '/content_type',
				views: {
          'body@': {
						template: '<div ui-view></div>'
					}
				},
				abstract: true
			})
			.state('content_type.list', {
				url: '',
        data: {
          pageTitle: 'Content types'
        },
				templateUrl: 'scripts/modules/content_type/views/list.html',
				controller: ['$scope', 'ContentTypeService', function($scope, ContentTypeService){

					// TODO: load items

				}]
			})
			.state('content_type.show', {
				url: '/show/:id',
        data: {
          pageTitle: 'Show content type'
        },
				templateUrl: 'scripts/modules/content_type/views/show.html',
				controller: ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){
					var id = $stateParams.id;
          // TODO load item by id
				}]
			})
			.state('content_type.create', {
				url: '/create',
        data: {
          pageTitle: 'Create content type'
        },
				templateUrl: 'scripts/modules/content_type/views/create.html',
				controller: ['$scope', '$state', 'SchemaService', 'ModalFactoryForMessage', 'ContentTypeService',
          function($scope, $state, SchemaService, ModalFactoryForMessage, ContentTypeService){

					var itemTemplate = {
						key: '',
						name: '',
						schema: {
							type: 'object',
							properties: {},
							required: []
						}
					};
          $scope.newItem = angular.copy(itemTemplate);

					$scope.save = function () {
						var newItem = angular.copy($scope.newItem);
						if (!newItem.key.length || !newItem.name.length) {
							ModalFactoryForMessage.open({title:'Error',message:'Name and Key are required'});
							return;
						}

						ContentTypeService.findByKey(newItem.key).then(function(existingContentType){
							if(existingContentType != null){
								var errMessage = 'Key must be unique, ' + existingContentType.name + ' content type already defined it.';
								ModalFactoryForMessage.open({title:'Error',message:errMessage});
							} else {
                // TODO store item
								//$scope.items.$add(newItem).then(function(ref) {
								//	$scope.newItem = angular.copy(itemTemplate);
								//	$state.go('^.list');
								//}).catch(function(){
								//	ModalFactoryForMessage.open({title:'Error',message:'Could not save content type.'});
								//});
							}
						});
					};

          $scope.addSchemaField = function(){
            SchemaService.addField($scope.newItem.schema);
          };

					$scope.editSchemaField = function(key){
            SchemaService.editField($scope.newItem.schema, key);
					};

          $scope.deleteSchemaField = function (key) {
            SchemaService.deleteField($scope.newItem.schema, key);
          };

				}]
			})
			.state('content_type.edit', {
				url: '/edit/:id',
        data: {
          pageTitle: 'Edit content type'
        },
				templateUrl: 'scripts/modules/content_type/views/edit.html',
				controller: ['$scope', '$state', '$stateParams', 'SchemaService', 'ModalFactoryForDelete', 'ContentModelService', 'ModalFactoryForMessage',
          function($scope, $state, $stateParams, SchemaService, ModalFactoryForDelete, ContentModelService, ModalFactoryForMessage){

					var id = $stateParams.id;

          // TODO: load item

          $scope.addSchemaField = function(){
            SchemaService.addField($scope.item.schema);
          };

					$scope.editSchemaField = function(key){
            SchemaService.editField($scope.item.schema, key);
					};

          $scope.deleteSchemaField = function (key) {
            SchemaService.deleteField($scope.item.schema, key);
          };

          $scope.save = function(form){
            if(form.$valid){
              $scope.item.$save().then(function(ref) {
                $state.go('^.show',{id:$scope.item.$id});
              }, function(error) {
                console.log("save error:", error);
              });
            }
          };

					$scope.delete = function(){

            if($scope.deleteInProgress){
              return;
            }

            $scope.deleteInProgress = true;

						ContentModelService.keyHasChildren($scope.item.key).then(function(result){
							if(result){
								ModalFactoryForMessage.open({title:'Entries exist!', message:'You should delete all instances of this type first.'});
                $scope.deleteInProgress = false;
							} else {
								ModalFactoryForDelete.open().then(function(){
		              $scope.item.$remove().then(function(ref) {
		                $state.go('^.list');
		              }, function(error) {
                    console.log("Error:", error);
                    ModalFactoryForMessage.open({title:'Error', message:'Server error. Could not remove item.'});
                    $scope.deleteInProgress = false;
		              });
		            }, function(){
                  $scope.deleteInProgress = false;
                });
							}
						}, function(rejection){
              console.log("Error:", rejection);
              ModalFactoryForMessage.open({title:'Error', message:'Server error. Could not remove item.'});
              $scope.deleteInProgress = false;
            });

					};

				}]
			});
	}]);

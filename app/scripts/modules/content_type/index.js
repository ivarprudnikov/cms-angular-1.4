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
				templateUrl: 'scripts/modules/content_type/views/list.html',
				controller: ['$scope', 'ContentTypeService', function($scope, ContentTypeService){
          ContentTypeService.list()
            .then(function(items){
              $scope.items = items;
            });
				}]
			})
			.state('content_type.show', {
				url: '/show/:id',
				templateUrl: 'scripts/modules/content_type/views/show.html',
				controller: ['$scope', 'ContentTypeService', '$stateParams', function($scope, ContentTypeService, $stateParams){
					var id = $stateParams.id;
          if(id != null){
            ContentTypeService.findByKey(id)
              .then(function(item){
                item = item || {};
                item.schema = item.schema || {};
                item.schema.properties = item.schema.properties || {};
                $scope.fieldKeys = Object.keys(item.schema.properties);
                $scope.item = item;
              });
          }
				}]
			})
			.state('content_type.create', {
				url: '/create',
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
                ContentTypeService.save(newItem)
                  .then(function(){
                    $state.go('^.list');
                  }).catch(function(){
                  	ModalFactoryForMessage.open({title:'Error',message:'Could not save content type.'});
                  });
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
				templateUrl: 'scripts/modules/content_type/views/edit.html',
				controller: ['$scope', '$state', '$stateParams', 'SchemaService', 'ModalFactoryForDelete', 'ContentModelService', 'ContentTypeService', 'ModalFactoryForMessage',
          function($scope, $state, $stateParams, SchemaService, ModalFactoryForDelete, ContentModelService, ContentTypeService, ModalFactoryForMessage){

					var id = $stateParams.id;

          if(id != null){
            ContentTypeService.findByKey(id)
              .then(function(item){
                $scope.item = item;
              });
          }

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
              ContentTypeService.update($scope.item)
                .then(function(item){
                  $state.go('^.show',{id:item.key});
                });
            }
          };

					$scope.delete = function(){
            if($scope.deleteInProgress){
              return;
            }
            $scope.deleteInProgress = true;
						ContentModelService.keyHasChildren($scope.item.key)
              .then(function(result){
                if(result){
                  $scope.deleteInProgress = false;
                  return ModalFactoryForMessage.open({title:'Entries exist!', message:'You should delete all instances of this type first.'});
                } else {
                  return ModalFactoryForDelete.open()
                    .then(ContentTypeService.delete($scope.item.key))
                    .then(function() {
                      $state.go('^.list');
                    })
                    .finally(function(){
                      $scope.deleteInProgress = false;
                    });
                }
              });
					};

				}]
			});
	}]);

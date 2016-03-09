"use strict";angular.module("admin.webclient",["ngSanitize","ngAnimate","schemaForm","ui.router","ui.bootstrap","admin.webclient.main","admin.webclient.header","admin.webclient.modals","admin.webclient.schema","admin.webclient.content_type","admin.webclient.content_model","admin.webclient.util","admin.webclient.html-templates"]).run(["$rootScope","$state","$timeout",function($rootScope,$state,$timeout){$rootScope.$on("$stateChangeStart",function(event,toState,toParams,fromState,fromParams){$timeout(function(){$("html,body").animate({scrollTop:0},100)},100)});$rootScope.$on("$stateChangeSuccess",function(){$rootScope.$broadcast("LoaderElement.stop")});$rootScope.$on("$stateChangeError",function(event,toState,toParams,fromState,fromParams,error){throw error});$rootScope.$on("$stateNotFound",function(event,unfoundState,fromState,fromParams){console.error(unfoundState.to);console.error(unfoundState.toParams);console.error(unfoundState.options)})}]).factory("$exceptionHandler",["$injector","$log",function($injector,$log){return function(exception,cause){exception.message+=' (caused by "'+cause+'")';$log.error(exception)}}]);"use strict";angular.module("admin.webclient.header",["ui.bootstrap","ui.router"]).controller("HeaderMainController",["$scope","ContentTypeService",function($scope,ContentTypeService){ContentTypeService.list().then(function(items){$scope.contentTypes=items});$scope.logout=function(){}}]);"use strict";angular.module("admin.webclient.main",["ui.router"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function($stateProvider,$urlRouterProvider,$httpProvider){$urlRouterProvider.otherwise("/");$stateProvider.state("main",{url:"/",views:{body:{template:"<div ui-view></div>"}},"abstract":true}).state("main.landing",{url:"",templateUrl:"scripts/modules/main/views/landing.html"})}]);"use strict";angular.module("admin.webclient.modals",["ui.bootstrap"]).factory("ModalFactoryForDelete",["$modal",function($modal){var template=""+'<div class="modal-header">'+'  <button type="button" class="close" aria-label="Close" ng-click="cancel()">'+'    <span aria-hidden="true">&times;</span>'+"  </button>"+'  <h4 class="modal-title">Delete</h4>'+"</div>"+'<div class="modal-body">'+"  <p>Are you sure you want to delete it?</p>"+"</div>"+'<div class="modal-footer">'+'  <button class="btn btn-danger" ng-click="ok()">Yes, delete!</button>'+'  <button class="btn btn-default" ng-click="cancel()">Cancel</button>'+"</div>"+"";function open(){var modalInstance=$modal.open({animation:true,template:template,controller:["$scope","$modalInstance",function($scope,$modalInstance){$scope.ok=function(){$modalInstance.close()};$scope.cancel=function(){$modalInstance.dismiss()}}],size:"sm"});return modalInstance.result}return{open:open}}]).factory("ModalFactoryForMessage",["$modal",function($modal){var template=""+'<div class="modal-header" ng-if="title">'+'  <button type="button" class="close" aria-label="Close" ng-click="close()">'+'    <span aria-hidden="true">&times;</span>'+"  </button>"+'  <h4 class="modal-title">{{title}}</h4>'+"</div>"+'<div class="modal-body" ng-if="message">'+"  <p>{{message}}</p>"+"</div>"+'<div class="modal-footer">'+'  <button class="btn btn-default" ng-click="close()">Close</button>'+"</div>"+"";function open(options){options=options||{};var modalInstance=$modal.open({animation:true,template:template,controller:["$scope","$modalInstance",function($scope,$modalInstance){$scope.title=options.title;$scope.message=options.message;$scope.close=function(){$modalInstance.close()}}],size:"sm"});return modalInstance.result}return{open:open}}]).factory("ModalFactoryForConfirmation",["$modal",function($modal){var template=""+'<div class="modal-header">'+'  <button type="button" class="close" aria-label="Close" ng-click="cancel()">'+'    <span aria-hidden="true">&times;</span>'+"  </button>"+"  <h4 class=\"modal-title\">{{ title || 'Confirm action' }}</h4>"+"</div>"+'<div class="modal-body">'+"  <p>{{ message || 'Are you sure you want to do it?' }}</p>"+"</div>"+'<div class="modal-footer">'+'  <button class="btn btn-default btn-sm" ng-click="cancel()">Cancel</button>'+'  <button class="btn btn-primary btn-sm" ng-click="ok()">Yes, proceed!</button>'+"</div>"+"";function open(options){options=options||{};var modalInstance=$modal.open({animation:true,template:template,controller:["$scope","$modalInstance",function($scope,$modalInstance){$scope.title=options.title;$scope.message=options.message;$scope.ok=function(){$modalInstance.close()};$scope.cancel=function(){$modalInstance.dismiss()}}],size:"sm"});return modalInstance.result}return{open:open}}]);"use strict";angular.module("admin.webclient.schema",["ui.bootstrap","admin.webclient.modals"]).constant("FIELD_TYPES",{string:"string","boolean":"boolean",number:"number"}).constant("FIELD_EDITORS",{"boolean":["checkbox"],number:["number"],string:["text","textarea"]});"use strict";angular.module("admin.webclient.schema").factory("SchemaFieldModalFactory",["$modal",function($modal){function open(existingData){var modalInstance=$modal.open({animation:true,templateUrl:"scripts/modules/schema/views/schemaFieldFormModal.html",controller:"SchemaFieldModalController",size:"lg",resolve:{existingData:function(){return existingData}}});return modalInstance.result}return{open:open}}]);"use strict";angular.module("admin.webclient.schema").controller("SchemaFieldModalController",["FIELD_TYPES","FIELD_EDITORS","$scope","$modalInstance","existingData","SchemaService",function(FIELD_TYPES,FIELD_EDITORS,$scope,$modalInstance,existingData,SchemaService){$scope.newFieldItem={};$scope.newFieldItemType="";$scope.fieldTypes=FIELD_TYPES;$scope.availableEditorsForField=[];var PREVIEW_FIELD_KEY="____key";$scope.previewFormSchema={};$scope.previewFormUI=["*"];$scope.previewFormModel={};function resetPreviewModel(){$scope.previewFormModel={}}resetPreviewModel();function parseFieldItemType(fieldItem){if(fieldItem.type==="object"&&fieldItem.properties&&(fieldItem.properties.lat&&fieldItem.properties.lon)){return FIELD_TYPES.location}if(fieldItem.type==="object"&&fieldItem.properties&&Object.keys(fieldItem.properties).length===2&&(fieldItem.properties.id&&fieldItem.properties.key)){return FIELD_TYPES.entry}if(fieldItem.type==="array"&&fieldItem.items&&fieldItem.items.type==="object"&&fieldItem.items.properties&&Object.keys(fieldItem.items.properties).length===2&&(fieldItem.items.properties.id&&fieldItem.items.properties.key)){return FIELD_TYPES.collection}return fieldItem.type}if(existingData!=null&&angular.isObject(existingData)){if(!angular.isObject(existingData.initialValue)){throw new TypeError("initialValue {object} is required")}if(!angular.isString(existingData.key)){throw new TypeError("key {string} is required")}if(existingData.isInitiallyRequired!==true&&existingData.isInitiallyRequired!==false){throw new TypeError("isInitiallyRequired {boolean} is required")}$scope.newFieldItem=existingData.initialValue;$scope.newFieldItem.key=existingData.key;$scope.newFieldItem.isRequired=existingData.isInitiallyRequired;$scope.newFieldItemType=parseFieldItemType(existingData.initialValue)}$scope.$watch("newFieldItemType",function(newVal,oldVal){resetPreviewModel();if(newVal==null||newVal===""){return}var itemBasedOnType=angular.copy($scope.newFieldItem);delete itemBasedOnType.properties;delete itemBasedOnType.required;delete itemBasedOnType.items;itemBasedOnType.type=newVal;var editors=FIELD_EDITORS[newVal];var selectedEditor;if(angular.isDefined(editors)&&angular.isArray(editors)){$scope.availableEditorsForField=editors;if(itemBasedOnType["x-schema-form"]&&itemBasedOnType["x-schema-form"].type){selectedEditor=itemBasedOnType["x-schema-form"].type}if(!selectedEditor||editors.indexOf(selectedEditor)<0){selectedEditor=editors[0]}}else{$scope.availableEditorsForField=[]}if(!selectedEditor){delete itemBasedOnType["x-schema-form"]}else{itemBasedOnType["x-schema-form"]={type:selectedEditor}}$scope.newFieldItem=itemBasedOnType},true);$scope.$watch("newFieldItem.type",function(newVal,oldVal){var fieldItemForPreview=angular.copy($scope.newFieldItem);fieldItemForPreview.key=PREVIEW_FIELD_KEY;$scope.previewFormSchema=SchemaService.modifySchemaField({},fieldItemForPreview)},true);$scope.save=function(){if($scope.newSchemaFieldForm&&$scope.newSchemaFieldForm.$valid){$modalInstance.close($scope.newFieldItem)}};$scope.cancel=function(){$modalInstance.dismiss()}}]);"use strict";angular.module("admin.webclient.schema").factory("SchemaService",["SchemaFieldModalFactory","ModalFactoryForDelete",function(SchemaFieldModalFactory,ModalFactoryForDelete){function modifySchemaField(schema,field){schema=schema||{};schema.type="object";schema.properties=schema.properties||{};schema.required=schema.required||[];var requiredIndex=schema.required.indexOf(field.key);var isAlreadyRequired=requiredIndex>-1;if(field.isRequired&&!isAlreadyRequired){schema.required.push(field.key)}else if(!field.isRequired&&isAlreadyRequired){schema.required.splice(requiredIndex,1)}schema.properties[field.key]={type:field.type,title:field.title};if(field.description){schema.properties[field.key].description=field.description}else{schema.properties[field.key].description=""}if(field.type==="array"){schema.properties[field.key].items=field.items}if(field.type==="object"){schema.properties[field.key].properties=field.properties}if(field["x-schema-form"]){schema.properties[field.key]["x-schema-form"]=field["x-schema-form"]}if(field.required&&field.required.length){schema.properties[field.key].required=field.required}return schema}function addField(schema){SchemaFieldModalFactory.open().then(function(field){modifySchemaField(schema,field)})}function editField(schema,key){schema=schema||{};schema.properties=schema.properties||{};schema.required=schema.required||[];var initialValue=angular.copy(schema.properties[key]);var isInitiallyRequired=schema.required.indexOf(key)>-1;SchemaFieldModalFactory.open({key:key,initialValue:initialValue,isInitiallyRequired:isInitiallyRequired}).then(function(field){modifySchemaField(schema,field)})}function deleteField(schema,key){schema=schema||{};schema.properties=schema.properties||{};schema.required=schema.required||[];ModalFactoryForDelete.open().then(function(){delete schema.properties[key];schema.required=schema.required||[];var requiredIndex=schema.required.indexOf(key);var isAlreadyRequired=requiredIndex>-1;if(isAlreadyRequired){schema.required.splice(requiredIndex,1)}})}return{modifySchemaField:modifySchemaField,addField:addField,editField:editField,deleteField:deleteField}}]);"use strict";angular.module("admin.webclient.content_type",["ui.router","admin.webclient.modals","admin.webclient.schema"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function($stateProvider,$urlRouterProvider,$httpProvider){$stateProvider.state("content_type",{url:"/content_type",views:{"body@":{template:"<div ui-view></div>"}},"abstract":true}).state("content_type.list",{url:"",templateUrl:"scripts/modules/content_type/views/list.html",controller:["$scope","ContentTypeService",function($scope,ContentTypeService){ContentTypeService.list().then(function(items){$scope.items=items})}]}).state("content_type.show",{url:"/show/:id",templateUrl:"scripts/modules/content_type/views/show.html",controller:["$scope","ContentTypeService","$stateParams",function($scope,ContentTypeService,$stateParams){var id=$stateParams.id;if(id!=null){ContentTypeService.findByKey(id).then(function(item){item=item||{};item.schema=item.schema||{};item.schema.properties=item.schema.properties||{};$scope.fieldKeys=Object.keys(item.schema.properties);$scope.item=item})}}]}).state("content_type.create",{url:"/create",templateUrl:"scripts/modules/content_type/views/create.html",controller:["$scope","$state","SchemaService","ModalFactoryForMessage","ContentTypeService",function($scope,$state,SchemaService,ModalFactoryForMessage,ContentTypeService){var itemTemplate={key:"",name:"",schema:{type:"object",properties:{},required:[]}};$scope.newItem=angular.copy(itemTemplate);$scope.save=function(){var newItem=angular.copy($scope.newItem);if(!newItem.key.length||!newItem.name.length){ModalFactoryForMessage.open({title:"Error",message:"Name and Key are required"});return}ContentTypeService.findByKey(newItem.key).then(function(existingContentType){if(existingContentType!=null){var errMessage="Key must be unique, "+existingContentType.name+" content type already defined it.";ModalFactoryForMessage.open({title:"Error",message:errMessage})}else{ContentTypeService.save(newItem).then(function(){$state.go("^.list")}).catch(function(){ModalFactoryForMessage.open({title:"Error",message:"Could not save content type."})})}})};$scope.addSchemaField=function(){SchemaService.addField($scope.newItem.schema)};$scope.editSchemaField=function(key){SchemaService.editField($scope.newItem.schema,key)};$scope.deleteSchemaField=function(key){SchemaService.deleteField($scope.newItem.schema,key)}}]}).state("content_type.edit",{url:"/edit/:id",templateUrl:"scripts/modules/content_type/views/edit.html",controller:["$scope","$state","$stateParams","SchemaService","ModalFactoryForDelete","ContentModelService","ContentTypeService","ModalFactoryForMessage",function($scope,$state,$stateParams,SchemaService,ModalFactoryForDelete,ContentModelService,ContentTypeService,ModalFactoryForMessage){var id=$stateParams.id;if(id!=null){ContentTypeService.findByKey(id).then(function(item){$scope.item=item})}$scope.addSchemaField=function(){SchemaService.addField($scope.item.schema)};$scope.editSchemaField=function(key){SchemaService.editField($scope.item.schema,key)};$scope.deleteSchemaField=function(key){SchemaService.deleteField($scope.item.schema,key)};$scope.save=function(form){if(form.$valid){ContentTypeService.update($scope.item).then(function(item){$state.go("^.show",{id:item.key})})}};$scope.delete=function(){if($scope.deleteInProgress){return}$scope.deleteInProgress=true;ContentModelService.keyHasChildren($scope.item.key).then(function(result){if(result){$scope.deleteInProgress=false;return ModalFactoryForMessage.open({title:"Entries exist!",message:"You should delete all instances of this type first."})}else{return ModalFactoryForDelete.open().then(ContentTypeService.delete($scope.item.key)).then(function(){$state.go("^.list")}).finally(function(){$scope.deleteInProgress=false})}})}}]})}]);"use strict";angular.module("admin.webclient.content_type").service("ContentTypeService",["$q","$window",function($q,$window){var STORAGE_KEY="content_types";function getStorage(){return JSON.parse($window.localStorage.getItem(STORAGE_KEY))||{}}function setStorage(key,data){var existing=getStorage();if(data==null){delete existing[key]}else{existing[key]=data}$window.localStorage.setItem(STORAGE_KEY,JSON.stringify(existing))}this.findByKey=function(key){return $q(function(resolve,reject){resolve(getStorage()[key])})};this.list=function(){return $q(function(resolve,reject){var items=getStorage();var resp=Object.keys(items).map(function(k){return items[k]});resolve(resp)})};this.save=function(item){return $q(function(resolve,reject){setStorage(item.key,item);resolve(item)})};this.update=function(item){return $q(function(resolve,reject){var existing=getStorage()[item.key];delete item.key;Object.keys(item).forEach(function(k){existing[k]=item[k]});setStorage(existing.key,existing);resolve(existing)})};this.delete=function(key){return $q(function(resolve,reject){setStorage(key,null);resolve()})}}]);"use strict";angular.module("admin.webclient.content_model",["ui.router","admin.webclient.content_type","admin.webclient.modals"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function($stateProvider,$urlRouterProvider,$httpProvider){$stateProvider.state("content_model",{"abstract":true,url:"/content_model/:key",views:{"body@":{template:"<div ui-view></div>"}},resolve:{CONTENT_TYPE:["$stateParams","ContentTypeService",function($stateParams,ContentTypeService){return ContentTypeService.findByKey($stateParams.key)}]}}).state("content_model.list",{url:"?max&offset",templateUrl:"scripts/modules/content_model/views/list.html",controller:"ContentModelListController"}).state("content_model.show",{url:"/show/:id",templateUrl:"scripts/modules/content_model/views/show.html",controller:"ContentModelShowController"}).state("content_model.create",{url:"/create",templateUrl:"scripts/modules/content_model/views/create.html",controller:"ContentModelCreateController"}).state("content_model.edit",{url:"/edit/:id",templateUrl:"scripts/modules/content_model/views/edit.html",controller:"ContentModelEditController"})}]);"use strict";angular.module("admin.webclient.content_model").service("ContentModelService",["$q","$window",function($q,$window){var PREFIX="content_model_";function getStorage(key){return JSON.parse($window.localStorage.getItem(PREFIX+key))||{}}function setStorage(key,id,data){var existing=getStorage(key);if(data==null){delete existing[id]}else{existing[id]=data}$window.localStorage.setItem(PREFIX+key,JSON.stringify(existing))}this.keyHasChildren=function(key){return $q(function(resolve){var items=getStorage(key);if(items&&"object"===typeof items&&Object.keys(items).length){resolve(true)}else{resolve(false)}})};this.search=function(key,params){return $q(function(resolve){params=params||{};params.max=params.max||10;params.offset=params.offset||0;var response={total:0,data:[]};var items=getStorage(key);var keys=Object.keys(items);response.total=keys.length;response.data=keys.map(function(k){return items[k]}).slice(params.offset,params.offset+params.max);resolve(response)})};this.get=function(key,id){return $q(function(resolve){var item=getStorage(key)[id];resolve(item)})};this.save=function(key,item){return $q(function(resolve){var id=(new Date).getTime();item._id=id;setStorage(key,id,item);resolve(item)})};this.update=function(key,id,item){return $q(function(resolve){var existing=getStorage(key)[id];Object.keys(item).forEach(function(k){existing[k]=item[k]});setStorage(key,id,existing);resolve(existing)})};this.delete=function(key,id){return $q(function(resolve){setStorage(key,id,null);resolve()})}}]);"use strict";angular.module("admin.webclient.content_model").controller("ContentModelListController",["$scope","$state","$stateParams","CONTENT_TYPE","Loader","ContentModelService",function($scope,$state,$stateParams,CONTENT_TYPE,Loader,ContentModelService){var loader=new Loader($scope,"loadingMessage");$scope.contentType=CONTENT_TYPE;$scope.contentTypeKey=$stateParams.key;$scope.searchOptions=$scope.searchOptions||{};$scope.searchOptions.max=Math.min(parseInt($stateParams.max)||10,10);$scope.searchOptions.offset=parseInt($stateParams.offset)||0;$scope.pagination={};$scope.pagination.page=1;$scope.results=null;$scope.$watch($stateParams,function(){calculateCurrentPage();searchForResults()});$scope.$watch("searchOptions",function(newVal,oldVal){if(!angular.equals(newVal,oldVal)&&angular.isDefined(oldVal)){refreshState()}},true);function selectedSearchOptions(){var o={};angular.forEach($scope.searchOptions,function(value,key){if(value!=null){o[key]=value}});return o}function errorHandler(httpResponse){loader.error(httpResponse)}function refreshState(){$state.go($state.$current.name,$scope.searchOptions,{reload:false,notify:false,inherit:true,location:true})}function searchForResults(){loader.start();ContentModelService.search($scope.contentTypeKey,selectedSearchOptions()).then(function(resp){$scope.results=resp;calculateCurrentPage()}).catch(errorHandler).finally(function(){loader.stop()})}$scope.$watch("pagination.page",function(oldValue,newValue){if(oldValue!==newValue){calculateCurrentPagination();searchForResults();$("html,body").animate({scrollTop:0},100)}});function calculateCurrentPage(){if(!$scope.results||!$scope.results.total||$scope.searchOptions.offset===0){$scope.pagination.page=1}else{$scope.pagination.page=Math.floor($scope.searchOptions.offset/$scope.searchOptions.max)+1}}function calculateCurrentPagination(){$scope.searchOptions.offset=$scope.searchOptions.max*($scope.pagination.page-1)}}]);"use strict";angular.module("admin.webclient.content_model").controller("ContentModelCreateController",["$scope","$state","CONTENT_TYPE","Loader","ContentModelService",function($scope,$state,CONTENT_TYPE,Loader,ContentModelService){var loader=new Loader($scope,"loadingMessage");$scope.contentType=CONTENT_TYPE;if(angular.isObject(CONTENT_TYPE.schema)){$scope.schema=angular.copy(CONTENT_TYPE.schema);$scope.schema.properties=$scope.schema.properties||{};$scope.schema.required=$scope.schema.required||[]}else{$scope.schema={type:"object",properties:{},required:[]}}$scope.formDefinition=["*",{type:"submit",title:"Save"}];$scope.newItemModel={};$scope.onSubmit=function(form){$scope.$broadcast("schemaFormValidate");if(form.$valid&&!loader.inProgress()){loader.start();ContentModelService.save($scope.contentType.key,$scope.newItemModel).then(function(){$scope.newItemModel={};$state.go("^.list")}).finally(function(){loader.stop()})}}}]);"use strict";angular.module("admin.webclient.content_model").controller("ContentModelShowController",["$scope","$stateParams","ContentModelService","Loader","CONTENT_TYPE",function($scope,$stateParams,ContentModelService,Loader,CONTENT_TYPE){if(!$stateParams.id){return}$scope.contentType=CONTENT_TYPE;$scope.contentTypeKey=$stateParams.key;var loader=new Loader($scope,"loadingMessage");loader.start();ContentModelService.get($stateParams.key,$stateParams.id).then(function(item){$scope.item=item}).finally(function(){loader.stop()})}]);"use strict";angular.module("admin.webclient.content_model").controller("ContentModelEditController",["$scope","$state","$stateParams","CONTENT_TYPE","ModalFactoryForDelete","Loader","ContentModelService",function($scope,$state,$stateParams,CONTENT_TYPE,ModalFactoryForDelete,Loader,ContentModelService){if(!$stateParams.id){return}$scope.contentType=CONTENT_TYPE;$scope.contentTypeKey=$stateParams.key;if(angular.isObject(CONTENT_TYPE.schema)){$scope.schema=angular.copy(CONTENT_TYPE.schema);$scope.schema.properties=$scope.schema.properties||{};$scope.schema.required=$scope.schema.required||[]}else{$scope.schema={type:"object",properties:{},required:[]}}$scope.formDefinition=["*",{type:"submit",title:"Save"}];var loader=new Loader($scope,"loadingMessage");loader.start();ContentModelService.get($stateParams.key,$stateParams.id).then(function(item){$scope.existingItemModel=item}).finally(function(){loader.stop()});$scope.delete=function(){if($scope.existingItemModel){ModalFactoryForDelete.open().then(function(){return ContentModelService.delete($stateParams.key,$stateParams.id)}).then(function(){$state.go("^.list")})}};$scope.onSubmit=function(form){$scope.$broadcast("schemaFormValidate");if(form.$valid&&!loader.inProgress()){loader.start();ContentModelService.update($stateParams.key,$stateParams.id,$scope.existingItemModel).then(function(){$state.go("^.show",{id:$stateParams.id,key:$stateParams.key})}).finally(function(){loader.stop()})}}}]);"use strict";(function(angular){angular.module("admin.webclient.util",[])})(angular);"use strict";(function(angular){var mod=angular.module("admin.webclient.util");mod.factory("Loader",["$interval","$rootScope",function($interval,$rootScope){function Loader(scopeObj,msgVar){var self=this;if(this===function(){return this}()){throw new Error("forgot to initialize me")}else if(!scopeObj){throw new Error("scopeObj required")}else if(!msgVar){throw new Error("msgVar required")}this.scopeObj=scopeObj;this.msgVar=msgVar;this.messageInterval=null;this.msg0="Loading ...";this.msg1="Still loading ...";this.msg2="Takes longer than usual ...";this.msg3="No connection?";this.interval=7e3;this.isError=false;$rootScope.$on("Exception",function(){self.stop()});return this}Loader.prototype={constructor:Loader,inProgress:function(){return!!this.scopeObj[this.msgVar]&&!this.isError},start:function(){var self=this;this.isError=false;if(self.inProgress()){return self}self.scopeObj[self.msgVar]=self.msg0;self.messageInterval=$interval(function(){if(self.scopeObj[self.msgVar]===self.msg0){self.scopeObj[self.msgVar]=self.msg1}else if(self.scopeObj[self.msgVar]===self.msg1){self.scopeObj[self.msgVar]=self.msg2}else if(self.scopeObj[self.msgVar].length===self.msg2.length+2){self.stop();self.scopeObj[self.msgVar]=self.msg3}else{self.scopeObj[self.msgVar]+="."}},self.interval);return self},stop:function(){var self=this;if(angular.isDefined(self.messageInterval)){self.scopeObj[self.msgVar]="";$interval.cancel(self.messageInterval)}this.isError=false;return self},error:function(err){var self=this;var message;this.isError=true;if(err&&err.data&&err.data.errors&&err.data.errors.length){var messages=[];angular.forEach(err.data.errors,function(errObj){messages.push(errObj.error)});message=messages.join(" ")}else if(typeof err==="string"){message=err}else{message="Error occured"}console.error("Loader error",err);self.stop();self.scopeObj[self.msgVar]=message;return self}};return Loader}])})(angular);
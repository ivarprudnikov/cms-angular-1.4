'use strict';

angular
	.module('admin.webclient.content_type')
	.service('ContentTypeService',['$q', function($q){

      /* jshint eqeqeq:false, eqnull:true */

    /**
     * @return {promise.<$firebaseArray>} that resolves to array of firebase instances
     */
    this.list = function(){

      // TODO return list of types
    };

    /**
     * @return {promise} that resolves to array of existing data keys
     */
    this.listDataKeys = function(){
      // TODO
    };

		/**
     * @return {promise.<object>} that resolves to content type
     */
		this.findByKey = function(argsKey){
      // TODO
		};

  }]);

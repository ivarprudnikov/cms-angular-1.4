'use strict';

/* globals angular */

(function (angular) {

  var mod = angular.module('admin.webclient.util');

  mod.factory('Loader', ['$interval', '$rootScope', function ($interval, $rootScope) {

    function Loader(scopeObj, msgVar) {

      var self = this;

      if (this === (function () {
          return this;
        })()) {
        throw new Error('forgot to initialize me');
      } else if (!scopeObj) {
        throw new Error('scopeObj required');
      } else if (!msgVar) {
        throw new Error('msgVar required');
      }

      this.scopeObj = scopeObj;
      this.msgVar = msgVar;
      this.messageInterval = null;
      this.msg0 = 'Loading ...';
      this.msg1 = 'Still loading ...';
      this.msg2 = 'Takes longer than usual ...';
      this.msg3 = 'No connection?';
      this.interval = 7000;
      this.isError = false;

      $rootScope.$on('Exception', function(){
        self.stop();
      });

      return this;
    }

    Loader.prototype = {

      constructor : Loader,

      inProgress : function () {
        return !!this.scopeObj[this.msgVar] && !this.isError;
      },

      start : function () {

        var self = this;

        this.isError = false;

        if (self.inProgress()) {
          return self;
        }

        self.scopeObj[self.msgVar] = self.msg0;
        self.messageInterval = $interval(
          function () {
            if (self.scopeObj[self.msgVar] === self.msg0) {
              self.scopeObj[self.msgVar] = self.msg1;
            } else if (self.scopeObj[self.msgVar] === self.msg1) {
              self.scopeObj[self.msgVar] = self.msg2;
            } else if (self.scopeObj[self.msgVar].length === (self.msg2.length + 2)) {
              self.stop();
              self.scopeObj[self.msgVar] = self.msg3;
            } else {
              self.scopeObj[self.msgVar] += '.';
            }
          }, self.interval
        );

        return self;
      },

      stop : function () {

        var self = this;

        if (angular.isDefined(self.messageInterval)) {
          self.scopeObj[self.msgVar] = '';
          $interval.cancel(self.messageInterval);
        }

        this.isError = false;

        return self;
      },

      error : function (err) {

        var self = this;
        var message;
        this.isError = true;

        if(err && err.data && err.data.errors && err.data.errors.length){
          var messages = [];
          angular.forEach(err.data.errors,function(errObj){
            messages.push(errObj.error);
          });
          message = messages.join(' ');
        } else if(typeof err === 'string') {
          message = err;
        } else {
          message = 'Error occured';
        }

        console.error('Loader error',err);

        self.stop();
        self.scopeObj[self.msgVar] = message;
        return self;
      }

    };

    return Loader;

  }]);

}(angular));

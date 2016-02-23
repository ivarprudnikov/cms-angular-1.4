'use strict';

angular
  .module('admin.webclient.schema', [
    'ui.bootstrap',
    'admin.webclient.modals'
  ])
  .constant('FIELD_TYPES', {
    string: 'string',
    boolean: 'boolean',
    integer: 'integer',
    number: 'number'
  })
  .constant('FIELD_EDITORS', {
    boolean: ['checkbox'], // alternatives: select,radios
    integer: ['number'],
    number: ['number'],
    string: ['text', 'textarea'],
    object: ['fieldset'],
    collection: ['array']
  });

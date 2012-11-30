'use strict';

/* Services */
angular.module('getDiary', ['ngResource']).factory('Diary', function($resource) {
    return $resource('diary');
});



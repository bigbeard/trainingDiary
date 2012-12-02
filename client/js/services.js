'use strict';

/* Services */
angular.module('getDiary', ['ngResource']).factory('Diary', function($resource) {
    return $resource('diary');
});

angular.module('getUsers', ['ngResource']).factory('Users', function($resource) {
    return $resource('user');
});


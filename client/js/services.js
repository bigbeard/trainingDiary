'use strict';

/* Services */
angular.module('getDiary', ['ngResource']).factory('Diary', function($resource) {
    return $resource('diary');
});

angular.module('addDiaryEntry', ['ngResource']).factory('AddDiaryEntry', function($resource) {
    return $resource('addDiaryEntry');
});


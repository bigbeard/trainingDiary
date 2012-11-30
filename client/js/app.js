'use strict';

// Declare app level module which depends on filters, and services
angular.module('TrainingCentre', ['getDiary']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/diary', { templateUrl: 'partials/diary.html', controller: diaryController, view: 'main' });
        $routeProvider.when('/plan', { templateUrl: 'partials/plan.html', controller: MyCtrl2, view: 'main' });
        $routeProvider.when('/administration', { templateUrl: 'partials/administration.html', controller: MyCtrl3, view: 'main' });
        $routeProvider.when('/about', { templateUrl: 'partials/about.html', controller: AboutController, view: 'main' });
        $routeProvider.otherwise({redirectTo: '/plan'});
}]);

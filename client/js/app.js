'use strict';

// Declare app level module which depends on filters, and services
angular.module('TrainingCentre', ['getDiary']).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/diary', { templateUrl: 'partials/diary.html', controller: diaryController, view: 'main' });
    $routeProvider.when('/administration', { templateUrl: 'partials/administration.html', controller: adminController, view: 'main' });
    $routeProvider.when('/about', { templateUrl: 'partials/about.html', controller: AboutController, view: 'main' });
    $routeProvider.otherwise({redirectTo: '/plan'});

    var interceptor = ['$rootScope','$q', function(scope, $q) {
        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            if (status == 401) {
                var deferred = $q.defer();
                var req = {
                    config: response.config,
                    deferred: deferred
                }
                scope.requests401.push(req);
                scope.$broadcast('event:loginRequired');
                console.log('login required');
                return deferred.promise;
            }
            // otherwise
            return $q.reject(response);
        }
        return function(promise) {
            return promise.then(success, error);
        }

    }];
    $httpProvider.responseInterceptors.push(interceptor);
}]);

angular.module('TrainingCentre').run(['$rootScope', '$http', '$location', function(scope, $http, $location) {
    scope.requests401 = [];
    scope.login = { required: false, failed: false };
    scope.user = {};

    scope.$on('event:loginConfirmed', function() {
        console.log("login confirmed");
        $('#loginForm').modal('hide');
        scope.login.failed = false;
        var i, requests = scope.requests401;
        for (i = 0; i < requests.length; i++) {
            retry(requests[i]);
        }
        scope.requests401 = [];

        function retry(req) {
            $http(req.config).then(function(response) {
                req.deferred.resolve(response);
            });
        }
    });

    scope.$on('event:loginFailed', function() {
        console.log("login failed");
        $('#loginForm').modal({show: true, backdrop: 'static'});
        scope.login.failed = true;
    });

    scope.$on('event:loginRequest', function(username, password) {
        console.log("login request");
        var postData = scope.user;
        $http.post('/authentication/login', postData).
        success(function (data, status, headers, config) {
            if (data.success) {
                scope.$broadcast('event:loginConfirmed');
                scope.user = {};
            } else {
                scope.$broadcast('event:loginFailed');
            }
        }).error(function (data, status, headers, config) {
            console.log("error: ", status);
        });
    });

    scope.$on('event:logoutRequest', function() {
        $http.post('/authentication/logout').
        success(function (data, status, headers, config) {
            console.log("Success", data);
            ping();
        }).error(function (data, status, headers, config) {
            console.log("error: ", status);
        });
    });

    scope.$on('event:loginRequired', function() {
        console.log("login required");
        $location.path('/about');
        $('#loginForm').modal({show: true, backdrop: 'static'});
        scope.login.failed = false;
    });

    function ping() {
        $http.get('api/ping').success(function() {
            scope.$broadcast('event:loginConfirmed');
        });
    };
    ping();

}]);

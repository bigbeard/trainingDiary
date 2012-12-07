'use strict';

var trainingCentreModule = angular.module('TrainingCentre', ['getDiary', 'ngCookies']);

trainingCentreModule.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/diary', { templateUrl: 'partials/diary.html', controller: diaryController, view: 'main' });
    $routeProvider.when('/administration', { templateUrl: 'partials/administration.html', controller: adminController, view: 'main' });
    $routeProvider.when('/about', { templateUrl: 'partials/about.html', controller: AboutController, view: 'main' });
    $routeProvider.otherwise({redirectTo: '/about'});

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

trainingCentreModule.run(['$rootScope', '$http', '$location', function(scope, $http, $location) {
    scope.requests401 = [];
    scope.authentication = { required: false, failed: false, loggedIn: false, name: "", test: "test123" };
    scope.user = {};

    scope.$on('event:loginConfirmed', function() {
        console.log("login confirmed");
        $('#loginForm').modal('hide');
        scope.authentication.failed = false;
        scope.authentication.loggedIn = true;

        console.log("scope.user:", scope.user);
        console.log("scope.authentication:", scope.authentication);

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
        scope.authentication.loggedIn = false;
    });

    scope.$on('event:loginRequest', function() {
        console.log("login request");
        var postData = scope.user;
        $http.post('/authentication/login', postData).
        success(function (data, status, headers, config) {
            if (data.success) {
                scope.$broadcast('event:loginConfirmed');
                scope.authentication.name = scope.user.username;
                scope.user = {};
            } else {
                scope.$broadcast('event:loginFailed');
                scope.authentication.name = "";
            }
        }).error(function (data, status, headers, config) {
            console.log("error: ", status);
        });
    });

    scope.$on('event:logoutRequest', function() {
        $http.post('/authentication/logout').
        success(function (data, status, headers, config) {
            console.log("Success", data);
            scope.authentication.loggedIn = false;
            scope.authentication.failed = false;
            scope.authentication.name = "";
            $location.path('/about');
            //ping();
        }).error(function (data, status, headers, config) {
            console.log("error: ", status);
        });
    });

    scope.$on('event:loginRequired', function() {
        scope.authentication.loggedIn = false;
        scope.authentication.failed = false;
        scope.authentication.name = "";
        scope.$eval();

        console.log("login required");
        //$location.path('/about');
        $('#loginForm').modal({show: true, backdrop: 'static'});
    });

    function ping() {
        $http.get('api/ping').success(function() {
            scope.$broadcast('event:loginConfirmed');
        });
    };
    ping();

}]);

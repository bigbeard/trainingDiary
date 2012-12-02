'use strict';

// Declare app level module which depends on filters, and services
angular.module('TrainingCentre', ['getDiary']).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/diary', { templateUrl: 'partials/diary.html', controller: diaryController, view: 'main' });
    $routeProvider.when('/plan', { templateUrl: 'partials/plan.html', controller: MyCtrl2, view: 'main' });
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

angular.module('TrainingCentre').run(['$rootScope', '$http', function(scope, $http) {
    // Holds all the requests which failed due to 401 response.
    scope.requests401 = [];
    scope.loginRequired = { showLogin: false };

    // On 'event:loginConfirmed', resend all the 401 requests.
    scope.$on('event:loginConfirmed', function() {
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

    // On 'event:loginRequest' send credentials to the server.
    scope.$on('event:loginRequest', function(event, username, password) {
        var payload = $.param({j_username: username, j_password: password});
        var config = {
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }
        $http.post('j_spring_security_check', payload, config).success(function(data) {
            if (data === 'AUTHENTICATION_SUCCESS') {
                scope.$broadcast('event:loginConfirmed');
            }
        });
    });

    // On 'logoutRequest' invoke logout on the server and broadcast 'event:loginRequired'.
    scope.$on('event:logoutRequest', function() {
        $http.put('j_spring_security_logout', {}).success(function() {
            ping();
        });
    });

    scope.$on('event:loginRequired', function() {
        scope.loginRequired = { showLogin: true };
    });

    // Ping server to figure out if user is already logged in.
    function ping() {
        $http.get('ping').success(function() {
            scope.$broadcast('event:loginConfirmed');
        });
    };
    ping();

}]);

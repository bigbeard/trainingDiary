function loginController($scope, $cookies, $cookieStore) {
    console.log("cookies: ", $cookieStore);

    if ($cookieStore.user) {
        $scope.authentication.loggedOn = $cookieStore.user.token;
        $scope.authentication.name = $cookieStore.user.username;
        console.log("user: ", $cookieStore.get("user"));
    }

    $scope.doLogin = function () {
        console.log("login: ", $scope.user.username, $scope.user.password);
        $scope.$emit('event:loginRequest', $scope.user.username, $scope.user.password);
    };

    $scope.cancelLogin = function () {
        $scope.$emit('event:loginCancelled');
    };

    $scope.logout = function () {
        $scope.$emit('event:logoutRequest');
    };

    $scope.login = function () {
        $scope.$emit('event:loginRequired');
    };

    $scope.getName = function () {
        return $scope.user.test;
    };
};
loginController.$inject = ['$scope', '$cookies', '$cookieStore'];


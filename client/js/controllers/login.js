function loginController($scope ) {
    $scope.doLogin = function () {
        console.log("login: ", $scope.user.username, $scope.user.password);
        $scope.$emit('event:loginRequest', $scope.user.username, $scope.user.password);
   };

    $scope.logout = function () {
        console.log("logout");
        $scope.$emit('event:logoutRequest');
    };
};
loginController.$inject = ['$scope'];


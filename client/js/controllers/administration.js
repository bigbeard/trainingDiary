function adminController($scope, $http) {
    $scope.users = {};

    $http.get('/api/user').
    success(function (data, status, headers, config) {
        console.log("Success", data);
        if (data) {
            $scope.users = data;
        }
    }).error(function (data, status, headers, config) {
        console.log("error")
    });

    $scope.userToEdit = { };

    $scope.saveUser = function() {
        var postData = $scope.userToEdit;
        console.log("Data to post: ", postData);
        $http.post('/api/user/save', postData).
        success(function (data, status, headers, config) {
            console.log("Success", data);
            if (data) {
                $scope.users.push(data);
            }
            $scope.userToEdit = {};
        }).error(function (data, status, headers, config) {
            console.log("error")
        });
    };

    $scope.editUser = function(user) {
        console.log("Edit user", user);
        $scope.userToEdit = user;
    };

    $scope.deleteUser = function(id) {
        console.log("delete id: ", id);

        $http.post('/api/user/delete/' + id).
        success(function (data, status, headers, config) {
            console.log("Success");
            angular.forEach($scope.users, function (value, key) {
                if (value._id === id) {
                    $scope.users.splice(key, 1);
                    return;
                }
            });
        }).error(function (data, status, headers, config) {
            console.log("error")
        });
    }
};
adminController.$inject = ['$scope', '$http'];


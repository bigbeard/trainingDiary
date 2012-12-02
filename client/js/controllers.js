'use strict';

function diaryController($scope, $http, Diary) {
    $scope.diary = Diary.query();
    $scope.entryToEdit = { };

    $scope.saveDiaryEntry = function() {
        var postData = $scope.entryToEdit;
        console.log("Data to post: ", postData);
        $http.post('/diary/save', postData).
        success(function (data, status, headers, config) {
            console.log("Success", data);
            if (data) {
                $scope.diary.push(data);
            }
            $scope.entryToEdit = {};
        }).error(function (data, status, headers, config) {
            console.log("error")
        });
    };

    $scope.editDiaryEntry = function(entry) {
        console.log("Edit diary entry", entry);
        $scope.entryToEdit = entry;
    };

    $scope.deleteDiaryEntry = function(id) {
        console.log("delete id: ", id);

        $http.post('diary/delete/' + id).
        success(function (data, status, headers, config) {
            console.log("Success");
            angular.forEach($scope.diary, function (value, key) {
                if (value._id === id) {
                    $scope.diary.splice(key, 1);
                    return;
                }
            });
        }).error(function (data, status, headers, config) {
            console.log("error")
        });
    }
};
diaryController.$inject = ['$scope', '$http', 'Diary'];


function loginController($scope, $http ) {
    $scope.user = {};

    $scope.doLogin = function () {
        console.log("Login: ", $scope.user.username, $scope.user.password);
    };
};
loginController.$inject = ['$scope', '$http'];


function MyCtrl2() {
};
MyCtrl2.$inject = [];

function adminController($scope, $http) {
    $scope.users = {};

    $http.get('/user').
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
        $http.post('/user/save', postData).
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

        $http.post('/user/delete/' + id).
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

function AboutController() {
};
AboutController.$inject = [];


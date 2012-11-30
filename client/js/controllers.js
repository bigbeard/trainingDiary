'use strict';

function diaryController($scope, $http, Diary) {
    $scope.diary = Diary.query();
    $scope.newEntry = { };

    $scope.addDiaryEntry = function() {
        var postData = $scope.newEntry;
        console.log("Data to post: ", postData);
        $http.post('/addDiaryEntry', postData).
            success(function (data, status, headers, config) {
                console.log("Success", data);
                $scope.diary.push(data);
                $scope.newEntry = {};
            }).error(function (data, status, headers, config) {
                console.log("error")
            });
    };

    $scope.editDiaryEntry = function() {
        $scope.currentEntry = $scope.Diary[0];
    };

    $scope.deleteDiaryEntry = function(id) {
        console.log("delete id: ", id);

        $http.post('/deleteDiaryEntry/' + id).
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


function MyCtrl2() {
};
MyCtrl2.$inject = [];

function MyCtrl3() {
};
MyCtrl3.$inject = [];

function AboutController() {
};
AboutController.$inject = [];


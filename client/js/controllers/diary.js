'use strict';

function diaryController($scope, $http, Diary) {
    $scope.diary = Diary.query();
    $scope.entryToEdit = { };

    $scope.saveDiaryEntry = function() {
        var postData = $scope.entryToEdit;
        console.log("Data to post: ", postData);
        $http.post('/api/diary/save', postData).
        success(function (data, status, headers, config) {
            console.log("Success", data);
            if (data) {
                $scope.diary.push(data);
            }
            $scope.entryToEdit = {};
        }).error(function (data, status, headers, config) {
            console.log("error");
        });
    };

    $scope.editDiaryEntry = function(entry) {
        console.log("Edit diary entry", entry);
        $scope.entryToEdit = entry;
    };

    $scope.deleteDiaryEntry = function(id) {
        console.log("delete id: ", id);

        $http.post('/api/diary/delete/' + id).
        success(function (data, status, headers, config) {
            console.log("Success");
            angular.forEach($scope.diary, function (value, key) {
                if (value._id === id) {
                    $scope.diary.splice(key, 1);
                    return;
                }
            });
        }).error(function (data, status, headers, config) {
            console.log("error");
        });
    };
};
diaryController.$inject = ['$scope', '$http', 'Diary'];


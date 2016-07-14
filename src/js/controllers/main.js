'use strict';
/* globals app */
/*globals _ */
app.controller('MainCtrl',['$scope', function ($scope) {

	$scope.template = {
		type: '',
		list: []
	};

	$scope.list = [];

	$scope.addToList = function() {
		$scope.template.list.push($scope.template.list.length);
	};

	$scope.removeFromList = function(index) {
		$scope.template.list.splice(index,1);
	}
}]);

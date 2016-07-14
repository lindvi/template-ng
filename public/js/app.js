'use strict';

/**
 * @ngdoc overview
 * @name retirementApp
 * @description
 * # retirementApp
 *
 * Main module of the application.
 */
 var app = angular.module('app', ['ngAnimate', 'ngCookies', 'ngResource', 'ui.router', 'ngSanitize', 'ngTouch']);



"use strict";

/* globals app */
app.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('Home', {
      url: '/',
      templateUrl: 'html/main.html'
    });
});
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

	$scope.$watch('containerView', function(value){
		$scope.template.type = value;
	})

}]);

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
  
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");

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



	$scope.infoTemplate = {
		title: '',
		subtitle: '',
		images: '',
		groups: []
	};

	$scope.groupTemplate = {
		title: '',
		items: []
	};

	$scope.personItemTemplate = {
		type: '',
		name: '',
		title: '',
		email: '',
		number: ''
	};

	$scope.textItemTemplate = {
		type: '',
		content: ''
	};

	$scope.imageItemTemplate = {
		type: '',
		url: ''
	};


	$scope.newsTemplate = {
		title: '',
		time: '',
		content: '',
		author: '',
		image: '',
		externalUrl: ''
	};

	$scope.eventTimeline = {
		type: '',
		title: '',
		time: '',
		description: '',
		endTime: '',
		allDay: 'false',
		location: {},
		tag: ''
	};

	$scope.locationTemplate = {
		name: '',
		description: '',
		lat: '',
		lng: ''
	};

	$scope.taskTimeline = {
		type: '',
		title: '',
		time: '',
		allDay: 'false',
		description: '',
		remind: 'false',
		tag: ''
	};
}]);
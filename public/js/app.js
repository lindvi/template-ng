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
    }).state('test', {
      url: '/test',
      templateUrl: 'public/html/main.html',
    });
});
'use strict';
/* globals app */
/*globals _ */
app.controller('MainCtrl',['$scope', function ($scope) {

	$scope.test = 'test';

}]);

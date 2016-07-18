'use strict';

/**
 * @ngdoc overview
 * @name retirementApp
 * @description
 * # retirementApp
 *
 * Main module of the application.
 */
 var app = angular.module('app', ['ngAnimate', 'ngCookies', 'ngResource', 'ui.router', 'ngSanitize', 'ngTouch']).filter('prettyJSON', function () {
 	return function(json) { return angular.toJson(json, true); };
 });



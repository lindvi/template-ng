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
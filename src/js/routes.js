"use strict";

/* globals app */
app.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('Home', {
      url: '/',
      templateUrl: 'html/main.html'
    });
});
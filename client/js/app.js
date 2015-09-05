(function() {
  'use strict';
  // client side route configuration
  window.app = angular.module('ProFiler', ['ngRoute', 'jsTree.directive']).
  config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      when('/', {
        templateUrl: '../partials/home.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
  ]);

}());

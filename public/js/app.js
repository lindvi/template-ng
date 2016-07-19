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

	$scope.modules = [];
	$scope.moduleName = '';
	$scope.moduleType = '';

	$scope.timelineType = '';
	$scope.infoItemType = '';

	$scope.moduleTypes = ['news', 'info', 'timeline'];
	$scope.timelineTypes = ['task', 'event'];
	$scope.infoItemTypes = ['person', 'text', 'image'];


	$scope.template = {
		news: [],
		info: [],
		timeline: []
	};

	$scope.module = {};
	$scope.list = [];

	$scope.itemTime = '';
	$scope.itemContent = '';
	$scope.itemAuthor = '';
	$scope.itemImage = '';
	$scope.itemExternalUrl = '';

	$scope.itemTitle = '';
	$scope.itemTime = '';
	$scope.itemAllDay = '';
	$scope.itemDescription = '';
	$scope.itemRemind = '';
	$scope.itemTag = '';

	$scope.infoGroups = [];
	var infoGroup = {};
	infoGroup.title = '';
	infoGroup.list = [];

	$scope.itemName = '';
	$scope.itemTitle = '';
	$scope.itemEmail = '';
	$scope.itemNumber = '';
	$scope.itemContent = '';
	$scope.itemUrl = '';

	$scope.removeItem = function(moduleIndex, itemIndex) {
		if(typeof itemIndex === 'undefined') {
			if(confirm('Do you want to remove ' + $scope.modules[moduleIndex].name + '?')) {
				$scope.modules.splice(moduleIndex, 1);
			}
			return;
		}
		if(confirm('Do you want to remove ' + $scope.modules[moduleIndex].list[itemIndex].title + '?')) {
			$scope.modules[moduleIndex].list.splice(itemIndex, 1);
		}
	}

	$scope.addNewsItem = function(index, itemTitle, itemTime, itemContent, itemAuthor, itemImage, itemExternalUrl) {
		var clone = _.cloneDeep($scope.newsTemplate);

		clone.title = itemTitle;
		clone.time = itemTime;
		clone.content = itemContent;
		clone.author = itemAuthor;
		clone.image = itemImage;
		clone.externalUrl = itemExternalUrl;

		$scope.modules[index].list.push(clone);

		$scope.itemTitle = '';
		$scope.itemTime = '';
		$scope.itemContent = '';
		$scope.itemAuthor = '';
		$scope.itemImage = '';
		$scope.itemExternalUrl = '';
	};

	$scope.addTaskItem = function(index, itemTitle, itemTime, itemAllDay, itemDescription, itemRemind, itemTag) {
		var clone = _.cloneDeep($scope.taskTimeline);

		clone.type = 'task';
		clone.title = itemTitle;
		clone.time = itemTime;
		clone.allDay = itemAllDay;
		clone.description = itemDescription;
		clone.remind = itemRemind;
		clone.tag = itemTag;

		$scope.modules[index].list.push(clone);

		$scope.itemTitle = '';
		$scope.itemTime = '';
		$scope.itemAllDay = '';
		$scope.itemDescription = '';
		$scope.itemRemind = '';
		$scope.itemTag = '';
	};

	$scope.addEventItem = function(index, itemTitle, itemTime, itemAllDay, itemDescription, itemEndTime, itemLocation, itemTag) {
		var clone = _.cloneDeep($scope.eventTimeline);

		clone.type = 'event';
		clone.title = itemTitle;
		clone.time = itemTime;
		clone.allDay = itemAllDay;
		clone.description = itemDescription;
		clone.endTime = itemEndTime;
		clone.location = itemLocation;
		clone.tag = itemTag;

		$scope.modules[index].list.push(clone);

		$scope.itemTitle = '';
		$scope.itemTime = '';
		$scope.itemAllDay = '';
		$scope.itemDescription = '';
		$scope.itemEndTime = '';
		$scope.itemLocation = '';
		$scope.itemTag = '';
	};

	$scope.addItemToModule = function(index, moduleType) {
		switch(moduleType) {
			case 'news':
			$scope.modules[index].list.push(_.cloneDeep($scope.newsTemplate));
			break;
			case 'info':
			$scope.modules[index].list.push(_.cloneDeep($scope.infoTemplate));
			break;
			case 'timeline':
			$scope.modules[index].list.push(_.cloneDeep($scope.timelineTemplate));
			break;
			default:
			break;
		}
	}

	$scope.addToList = function(name, type) {
		var module = {};
		module.name = name;
		module.type = type;
		module.list = [];
		$scope.modules.push(module);
	};

	$scope.removeFromList = function(index) {
		$scope.template.list.splice(index,1);
	}

	$scope.removeGroupItem = function(moduleIndex, groupIndex, itemIndex) {
		$scope.modules[moduleIndex].list[groupIndex].groups.splice(itemIndex, 1);
	}

	$scope.addInfoItem = function(index, itemTitle, itemSubtitle, itemImage) {
		var clone = _.cloneDeep($scope.infoTemplate);

		clone.title = itemTitle;
		clone.subtitle = itemSubtitle;
		clone.image = itemImage;

		$scope.modules[index].list.push(clone);

		$scope.itemTitle = '';
		$scope.itemSubtitle = '';
		$scope.itemImage = '';
	}

	$scope.addGroup = function(moduleIndex, itemIndex, groupTitle) {
		var infoGroup = {};
		infoGroup.title = groupTitle;
		infoGroup.list = [];
		$scope.modules[moduleIndex].list[itemIndex].groups.push(infoGroup);
		/*$scope.infoGroups.push(infoGroup);*/
	}

	$scope.addPersonItem = function(moduleIndex, infoIndex, groupIndex, itemName, itemTitle, itemEmail, itemNumber) {
		console.log($scope.modules[moduleIndex]);
		console.log($scope.modules[moduleIndex].list[infoIndex]);
		console.log($scope.modules[moduleIndex].list[infoIndex].groups[groupIndex]);
		var clone = _.cloneDeep($scope.personItemTemplate);

		clone.type = 'person';
		clone.name = itemName;
		clone.title = itemTitle;
		clone.email = itemEmail;
		clone.number = itemNumber;

		$scope.modules[moduleIndex].list[infoIndex].groups[groupIndex].list.push(clone);

		$scope.itemName = '';
		$scope.itemTitle = '';
		$scope.itemEmail = '';
		$scope.itemNumber = '';
	}

	$scope.addTextItem = function(moduleIndex, infoIndex, groupIndex, itemContent) {
		var clone = _.cloneDeep($scope.textItemTemplate);

		clone.type = 'text';
		clone.content = itemContent;

		$scope.modules[moduleIndex].list[infoIndex].groups[groupIndex].list.push(clone);

		$scope.itemContent = '';
	}

	$scope.addImageItem = function(moduleIndex, infoIndex, groupIndex, itemUrl) {
		var clone = _.cloneDeep($scope.imageItemTemplate);

		clone.type = 'image';
		clone.url = itemUrl;

		$scope.modules[moduleIndex].list[infoIndex].groups[groupIndex].list.push(clone);

		$scope.itemUrl = '';
	}

	$scope.infoTemplate = {
		title: '',
		subtitle: '',
		image: '',
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

	$scope.timelineTemplate = {
		list: []
	};

	$scope.eventTimeline = {
		type: '',
		title: '',
		time: '',
		allDay: false,
		description: '',
		endTime: '',
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
		allDay: false,
		description: '',
		remind: false,
		tag: ''
	};

	$scope.$watch('modules', function(newValue) {
		var internal = _.cloneDeep(newValue);
		_.each(internal, function(module) {
			var name = _.clone(module.name);
			delete module.type;
			module[name] = _.cloneDeep(module.list);
			delete module.list;
			delete module.name;
		});
		$scope.nAppenModules = internal;
	}, true);

}]);

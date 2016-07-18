'use strict';
/* globals app */
/*globals _ */
app.controller('MainCtrl',['$scope', function ($scope) {

	$scope.modules = [{name: 'nyheter', type:'news', list: []}];
	$scope.moduleName = '';
	$scope.moduleType = '';

	$scope.moduleTypes = ['news', 'info', 'timeline'];


	$scope.template = {
		news: [],
		info: [],
		timeline: []
	};

	$scope.module = {};
	$scope.list = [];

	$scope.itemTitle = '';
	$scope.itemTime = '';
	$scope.itemContent = '';
	$scope.itemAuthor = '';
	$scope.itemImage = '';
	$scope.itemExternalUrl = '';

	$scope.addTaskToModule = function(index) {
		$scope.modules[index].list.push(_.cloneDeep($scope.taskTimeline))
	};
	
	$scope.addEventToModule = function(index) {
		$scope.modules[index].list.push(_.cloneDeep($scope.eventTimeline))
	};

	$scope.removeItem = function(moduleIndex, itemIndex) {
		if(!itemIndex) {
			if(confirm('Do you want to remove ' + $scope.modules[moduleIndex].name)) {
				$scope.modules.splice(moduleIndex, 1);
			}
			
			return;
		}

		$scope.modules[moduleIndex].list.splice(itemIndex, 1);
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

	$scope.addItemToModule = function(index, moduleType) {
		console.log(index)
		console.log(moduleType)
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

	$scope.timelineTemplate = {
		list: []
	};

	$scope.eventTimeline = {
		type: '',
		title: '',
		time: '',
		allDay: 'false',
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
		allDay: 'false',
		description: '',
		remind: 'false',
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
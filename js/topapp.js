'use strict';

var app = angular.module('topapp', ['ui.bootstrap']);

app.service('appleApiService', ['$http', function($http) {
	var feedUrl = 'https://itunes.apple.com/us/rss',
		lookupUrl = 'https://itunes.apple.com/lookup';
	
	this.getFeed = function(config) {
		var feedRequestUrl = feedUrl + '/' + config.feedType + '/limit=' + config.limit + '/json';
		return $http.get(feedRequestUrl);
	};

	this.lookupByIds = function(ids) {
		var csi = '';
		ids.forEach(function(id){
			csi += id + ',';
		});
		csi = csi.slice(0, -1);

		return this.lookup({
			id: csi
		});
	};

	this.lookup = function(params) {
		// use jsonp because Apple API doesn't have CORS enabled :(
		var request_params = params || {};
		request_params.callback = 'JSON_CALLBACK';
		return $http.jsonp(lookupUrl, {
			params: request_params
		});
	};
}]);

app.controller('topAppCtrl', ['$scope', '$modal', 'appleApiService', function($scope, $modal, appleApiService) {
	$scope.topApps = [];
	
	appleApiService.getFeed({
		feedType: 'toppaidapplications',
		limit: 12
	}).
	success(function(feedData) {
		var app_ids = [];
		feedData.feed.entry.forEach(function(ios_app) {
			app_ids.push( ios_app.id.attributes['im:id'] );
		});

		appleApiService.lookupByIds(app_ids).
			success(function(lookupResponse) {
				$scope.topApps = lookupResponse.results;
			});
	}).
	error(function(response) {
		$scope.errorMessage = response;
	});

	$scope.viewApp = function(iosApp) {
		$modal.open({
	     	templateUrl: 'templates/ios_app_modal.html',
	     	controller: 'iosAppModalCtrl',
	     	size: 'lg',
	     	modalClass: 'ios-app-modal',
	     	resolve: {
	     		iosApp: function() {
	     			return  iosApp;
	     		}
	     	}
	    });
	};

	$scope.sort = function(key) {
		if ($scope._sorted_by === key) {
			$scope.topApps.sort(function(a, b) {
				if ( a[key] && (a[key] > b[key]) ) {
					return -1;
				}
				if ( !a[key] || (a[key] < b[key]) ) {
					return 1;
				}
				return 0;
			});

			$scope._sorted_by = key + '_inverse';
		}
		else {
			$scope.topApps.sort(function(a, b) {
				if ( a[key] && (a[key] < b[key]) ) {
					return -1;
				}
				if ( (!a[key] || (a[key]) > b[key]) && b[key] ) {
					return 1;
				}
				if ( !(b[key]) ) {
					return -1;
				}
				return 0;
			});

			$scope._sorted_by = key;
		}
	}
}]);

app.controller('iosAppModalCtrl', ['$scope', 'iosApp', function($scope, iosApp) {
	$scope.iosApp = iosApp;
}]);
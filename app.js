(function () {
	var app = angular.module('app', ['ui.router']);
	app.controller("appCtrl", ["appData", "$transitions", "$rootScope", function (appData, $transitions, $rootScope) {
		var app = this;
		appData.get().then(function(data){
			app.data = {
				...data.appData,
				menu:  Object.keys(data.routes)
			}
		});
		$transitions.onStart({}, function($transition){
			$rootScope.state = {
				from: $transition.$from().name,
				to: $transition.$to().name,
				params: $transition.params().name
			};
		});
	}]);
	app.controller("pageCtrl", ["$scope", "data", "$rootScope", function ($scope, data, $rootScope) {
		$scope.data = data;
		console.log($rootScope.state);
	}]);
	app.config(["$stateProvider", "$locationProvider", function ($stateProvider, $locationProvider) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$stateProvider
			.state('home', {
				url: "/",
				template: "<div>" + "{{data.content}}" + "</div>",
				controller: "pageCtrl",
				resolve: {
					data: function (appData, $rootScope) {
						return appData.get().then(function(data){
							let route = $rootScope.state.to ? $rootScope.state.to : "home"
							return data.routes[route]
						});
					}
				}
			})
			.state('about', {
				url: "/about",
				template: "<div>" + "{{data.content}}" + "</div>",
				controller: "pageCtrl",
				resolve: {
					data: function (appData, $rootScope) {
						return appData.get().then(function(data){
							let route = $rootScope.state.to ? $rootScope.state.to : "home"
							return data.routes[route]
						});
					}
				}
			})
			.state("otherwise", {url: "/"})
	}]);
	app.directive("navigation", function(appData){
		function link(scope, elem, attrs, html){
			Object.assign(scope, {
				isOpen: false,
				size: 1.5,
				toggleNav(){
					html.btm.style.height = this.isOpen === false ? "100vh" : "0vh"
					this.isOpen = !this.isOpen
				}
			})
		}
		function compile(elem, attrs) {
			let html = {
				top: elem[0].querySelector(".top"),
				btm: elem[0].querySelector("ul"),
				hamb: elem[0].querySelector(".hamburger")
			}
			return function (scope, elem, attrs) {
			// scope and event listeners
				link(scope, elem, attrs, html);
			// functional styles
				Object.assign(elem[0].style, {
					position: "fixed",
					top: "0",
					width: "100%",
				})
				Object.assign(html.top.style, {
					backgroundColor: "red",
					display: "flex",
					alignItems: "center",
					height: scope.size + "rem",
					width: "100%",
				})
				Object.assign(html.btm.style, {
					backgroundColor: "lightgray",
					overflow: "hidden",
					height: "0vh",
					width: "100%",
					margin: "0",
					transition: ".5s height",
				})
				Object.assign(html.hamb.style, {
					height: "100%",
					lineHeight: scope.size + "rem",
					width: scope.size + "rem",
					textAlign: "center",
					verticalAlign: "center",
					marginLeft: "auto"
				})
			}
		}
		return {
			restrict: 'AE',
			scope: {
				title: "<",
				for: "<"
			},
			template: (
				'<div class="top">' +
					'<div>{{title}}</div>' +
					'<div class="hamburger" ng-click="toggleNav()">☰</div>' +
				'</div>' +
				'<ul>' +
					'<li ng-repeat="name in for" ui-sref="{{name}}" ng-click="toggleNav()">{{name}}</li>' +
				'</ul>'
			),
			compile: compile,
			link: link
		}
	})
	app.factory("appData", function ($http) {
		return {
			get: function(){
				return $http.get("data.json").then(function (resp) {
					return resp.data
				});
			}
		}
	});
})();
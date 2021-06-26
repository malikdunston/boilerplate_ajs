function resolve(appData, route){
	// if(route == ""){route = "home"}
	console.log(route)
	return {
		route: appData.routes[route],
		app: {
			appName: appData.appName,
			logo: appData.logo,
			title: appData.title,
			menu: appData.menu
		}
	}
}
var app = angular.module('app', ['ui.router']);
app.controller("appCtrl", function (appData) {
	var app = this;
	console.log(app);
});
app.controller("pageCtrl", function ($scope, data){
	$scope.data = data.route;
	$scope.$parent.app.data = data.app;
	console.log($scope);
});
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
				data: function(appData, $state){ return resolve(appData, $state.current.name)}
			}
		})
		.state('about', {
			url: "/about",
			template: "<div>" + "{{data.content}}" + "</div>",
			controller: "pageCtrl",
			resolve: {
				data: function(appData, $state){ return resolve(appData, $state.current.name)}
			}
		})
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
			console.log(scope)
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
app.factory("appData", function($http, $state){
	return $http.get("data.json").then(function(resp){
		resp.data.menu = Object.keys(resp.data.routes);
		return resp.data
		appData.all = resp.data;
		// return resp.data
	});
})
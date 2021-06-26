app.run(function($window, appData){
	let root = $window.boilerplateAJS;
	root.makeStateObj = () => {
		this.state = {
			url: "/",
			template: [
				"<header>", 
					"<h1>", 
						"{{data.title}}",
					"</h1>",
				"</header>",
				"<div>", 
					"{{data.content}}", 
				"</div>"
			].join(""),
			controller: "pageCtrl",
			resolve: {
				data: function (appData, $rootScope) {
					return appData.get().then(function(data){
						let route = $rootScope.state.to ? $rootScope.state.to : "home"
						return data.routes[route]
					});
				}
			}
		}
	}
	appData.get().then(function(resp){
		Object.keys(resp.routes).forEach(k => {
			resp.routes[k].newState = root.makeStateObj.bind(resp.route[k]);
		})
	})
});

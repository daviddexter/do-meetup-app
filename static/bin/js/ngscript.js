var rootApp = angular.module('meetup',['ui.router','ngMaterial']);

rootApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,$urlRouterProvider){
  $stateProvider
		.state('index',{
		    url:'/@index',
			controller:'index',
			templateUrl:'views/main.html'
    })

    	.state('index.home',{
		    url:'/home',
			controller:'index',
			templateUrl:'views/main.home.html'
    })

    	.state('index.reg',{
		    url:'/reg',
			controller:'index',
			templateUrl:'views/main.reg.html'
    })

    	.state('index.add',{
		    url:'/qna',
			controller:'index',
			templateUrl:'views/main.add.html'
    })


  $urlRouterProvider.otherwise('/@index/home');
}]);


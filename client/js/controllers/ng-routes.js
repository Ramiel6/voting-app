app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "js/templates/main.html",
        //controller: 'homeController',
        access: {restricted: false}

    })
    .when("/new", {
        templateUrl : "js/templates/new.html",
        controller: 'newPollController',
        access: {restricted: true}

    })
    .when("/mypolls", {
        templateUrl : "js/templates/userPolls.html",
        controller: 'homeController',
        access: {restricted: true}
    })
    .when("/selected", {
        templateUrl : "js/templates/selectedPoll.html",
        controller: 'homeController',
         access: {restricted: true}
    })
    .when("/selectedall", {
        templateUrl : "js/templates/selectedPollAll.html",
         controller: 'MainController',
         access: {restricted: false}
    })
    .when("/home", {
        templateUrl : "js/templates/main.html",
        //controller: 'homeController',
         access: {restricted: false}
    })
    .when("/all", {
        templateUrl : "js/templates/allPolls.html",
        // controller: 'MainController',
         access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'js/templates/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'js/templates/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .otherwise({
        redirectTo: '/',
        access: {restricted: false}
      });
});
// app.run(['$rootScope', '$location', function($rootScope,$location) {
//     $rootScope.$on('$routeChangeStart', function (event, next, current) {
//             if (!current) {
//                 $location.url('/');
//             }
//         })
// }]);
//working
app.run(function($rootScope,$location, AuthService,$route) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // if (!current) {
            //     $location.url('/');
            // }
             AuthService.getUserStatus().then(function(){
     if (!AuthService.isLoggedIn() && next.access.restricted) {
      console.log(next.access.restricted);
        event.preventDefault();
       
        $location.url('/login');
     }  
    })
        })
});
// app.run(function ($rootScope, ,$location, AuthService, AUTH_EVENTS) {
//   $rootScope.$on('$routeChangeStart', function (event, next, current) {
//     if (!AuthService.isAuthenticated()) {
//       console.log(next.name);
//       if (next.name !== 'outside.login' && next.name !== 'outside.register') {
//         event.preventDefault();
//         // $state.go('outside.login');
//         $location.url('/');
//       }
//     }
//   });
// });

// app.run(['$rootScope', '$location','$route','AuthService', function ($rootScope, $location, $route, AuthService) {
//   $rootScope.$on('$routeChangeStart',
//     function (event, next, current) {
//       AuthService.getUserStatus()
//       .then(function(){
//         if (next.access.restricted && !AuthService.isLoggedIn()){
//           $location.url('/login');
//           $route.reload();
//         }
//         else if (!current) {
//                 $location.url('/');
//             }
//       });
//   });
// }]);
app.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/main.html",
        //controller: 'homeController',
        access: {restricted: false}

    })
    .when("/about", {
        templateUrl : "templates/about.html",
        access: { restricted: false }
    })
    .when("/new", {
        templateUrl : "templates/new.html",
        controller: 'newPollController',
        access: {restricted: true}

    })
    .when("/mypolls", {
        templateUrl : "templates/userPolls.html",
        controller: 'homeController',
        access: {restricted: true}
    })
    // .when("/selected/:id", {
    //     templateUrl : "js/templates/selectedPoll.html",
    //     controller: 'homeController',
    //      access: {restricted: true}
    // })
    .when("/poll/:id", {
        templateUrl : "templates/selectedPoll.html",
         controller: 'selectedController',
         access: {restricted: false}
    })
    .when("/home", {
        templateUrl : "templates/main.html",
        //controller: 'homeController',
         access: {restricted: false}
    })
    .when("/all", {
        templateUrl : "templates/allPolls.html",
        controller: 'MainController',
         access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'templates/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/profile', {
      templateUrl: 'templates/profile.html',
      controller: 'profileController',
      access: {restricted: true}
    })
    .otherwise({
        redirectTo: '/',
        access: {restricted: false}
      });
    //   $locationProvider.html5Mode(true);
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
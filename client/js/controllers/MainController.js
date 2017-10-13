var app = angular.module("VotingApp", ["ngRoute"]);

app.controller("MainController", function($scope,$http,$window) {
    // $location.path("/")
    var result =[]
   $scope.userPolltest= [{
        user: 'user1',
        qu: 'what?',
        pollItems: [{value: 'avatar-1'},{value: 'avatar-2'},{value: 'avatar-3'}],
        id:''
    },
    {
        user: 'user1',
        qu: 'who?',
        pollItems: [{value: 'who-1'},{value: 'who-2'},{value: 'who-3'}],
        id:''
    },
    {
        user: 'user1',
        qu: 'how?',
        pollItems: [{value: 'how-1'},{value: 'how-2'},{value: 'how-3'}],
        id:''
    }]
    $scope.setSelected = function(selected) {
       //https://stackoverflow.com/users/527968/liviu-t
        $scope.selected = selected; 
      }
      $scope.getSelected = function(selected) {
        $scope.selectedPoll = $scope.userPoll[selected]
        $window.location.href= "#!selected"
      }
    $scope.userLatest = $scope.userPolltest[0];
    // $scope.label
    // $scope.value
    $scope.pollInput ='hi';
   $scope.voteSubmit = function(){
    result.push({
        vote: $scope.pollInput
    });
    // console.log(result)
   }
   //https://www.w3schools.com/angular/angular_application.asp
   $scope.myItems = [];
   $scope.question
   $scope.addItem = function () {
       $scope.errortext = "";
       if (!$scope.addMe) {return;}
       if ($scope.myItems.indexOf($scope.addMe) == -1) {
           $scope.myItems.push({value:$scope.addMe});
       } else {
           $scope.errortext = "The item is already in your shopping list.";
       }
   }
   $scope.removeItem = function (x) {
       $scope.errortext = "";
       $scope.myItems.splice(x, 1);
   };
   $scope.newPollSubmit = function(){
    var date = new Date().toUTCString();
    $scope.user = "user1";
    var data={
     user: $scope.user,
     question: $scope.question,
     pollItems: $scope.myItems,
     date: date
 };
    var req = {
        method: 'POST',
        url: '/newpoll',
        headers: {
          'Content-Type': "application/json"
        },
        data: data
       };
       
       $http(req).then(function(response){ 
        console.log(response)
        console.log("working")
       },function(response){
        console.log(response)
        console.log("error")
       });
   }
  $scope.getUserPolls = function(){
      $http({
        method : "GET",
        url : "/getmypolls"
    }).then(function mySuccess(response) {
        $scope.userPoll = response.data;
       console.log("working")
    //   console.log(response.data)
        $window.location.href= "#!mypolls"
    }, function myError(response) {
        console.log("error");
    });
  };
  $scope.getAllPolls = function(){
      $http({
        method : "GET",
        url : "/getallpolls"
    }).then(function mySuccess(response) {
        $scope.userPoll = response.data;
       console.log("working")
    //   console.log(response.data)
        $window.location.href= "#!all"
    }, function myError(response) {
        console.log("error");
    });
  };
   
});

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "js/templates/main.html",
        // access: {restricted: false}

    })
    .when("/new", {
        templateUrl : "js/templates/new.html",
        // access: {restricted: true}

    })
    .when("/mypolls", {
        templateUrl : "js/templates/userPolls.html",
        // access: {restricted: true}
    })
    .when("/selected", {
        templateUrl : "js/templates/selectedPoll.html",
        //  access: {restricted: false}
    })
    .when("/home", {
        templateUrl : "js/templates/main.html",
        //  access: {restricted: false}
    })
    .when("/all", {
        templateUrl : "js/templates/allPolls.html",
        //  access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'js/templates/login.html',
      controller: 'loginController',
    //   access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
    //   access: {restricted: false}
    })
    .when('/register', {
      templateUrl: 'js/templates/register.html',
      controller: 'registerController',
    //   access: {restricted: false}
    })
    .otherwise({
        redirectTo: '/'
      });
});
app.run(['$rootScope', '$location', function($rootScope,$location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (!current) {
                $location.path('/');
            }
        })
}]);
// app.run(function ($rootScope, $location, $route, AuthService) {
//   $rootScope.$on('$routeChangeStart',
//     function (event, next, current) {
//       AuthService.getUserStatus()
//       .then(function(){
//         if (next.access.restricted && !AuthService.isLoggedIn()){
//           $location.path('/login');
//           $route.reload();
//         }
//         // else if (!current) {
//         //         $location.path('/');
//         //     }
//       });
//   });
// });

        

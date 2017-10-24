//Load google charts

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
 var drawChart = function(data, title, myElement) {
      var chartData = google.visualization.arrayToDataTable(data);
    
      // Optional; add a title and set the width and height of the chart
      var options = {'title': title, 'width':550, 'height':400,backgroundColor: { fill:'transparent' }};
    
      // Display the chart inside the <div> element with id="piechart"
     
      var chart = new google.visualization.PieChart(myElement);
      chart.draw(chartData, options);
    }

var app = angular.module("VotingApp", ["ngRoute",'cgNotify']);
app.config(['$locationProvider','$httpProvider', function($locationProvider,$httpProvider){
    $locationProvider.html5Mode(true);
    $httpProvider.defaults.withCredentials = true;
     
    
}]);
app.controller("MainController",
    function($scope,$http,$location,sharedProperties,AuthService,notify,$interval,$document) {
    // $location.path("/")
   
    // $scope.isDisabled = sharedProperties.getIsDisabled()
     $scope.$watch(function(scope) {
         return scope.isDisabled =AuthService.isLoggedIn();
     });
    
$scope.getAllPolls = function(){
      $http({
        method : "GET",
        url : "/getallpolls"
    }).then(function mySuccess(response) {
        $scope.allPolls = response.data;
       console.log($scope.allPolls);
       console.log("working");
    //   console.log(response.data)
        // $window.location.href= "#!all"
        $location.url('/all');
    }, function myError(response) {
        console.log("error");
    });
  };
    // $scope.setSelected = function(selected) {
    //   //https://stackoverflow.com/users/527968/liviu-t
    //     $scope.selected = selected; 
    //   };
      $scope.getSelectedAll = function(selected) {
        $scope.selectedPollAll = $scope.allPolls[selected];
        var chartData = function(){
            var arr = [['Task', 'Hours per Day']];
            for(var i=0; i < $scope.selectedPollAll.pollItems.length; i++){
                arr.push(
                    [$scope.selectedPollAll.pollItems[i]['value'],$scope.selectedPollAll.pollItems[i]['votes']]
                    );
            }
            return arr;
        };
    
        var title =  $scope.selectedPollAll.question;
       
        console.log(chartData());
        $location.url('/selectedall');
        var stop;
        stop = $interval(function() {
            if (angular.element('#piechart').length) {
               $scope.stopInterval();
                var myElement = angular.element('#piechart')['0'];
                drawChart(chartData(), title, myElement);
                console.log(myElement);
                console.log('found');
            } 
          }, 100);
        
        $scope.stopInterval = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };
      };
    $scope.getStatus =function() {
         AuthService.getUserStatus();
    };
    
    $scope.voteSubmitAll = function(){
    var result;
    if(AuthService.isLoggedIn()){
        result = {
            voteId: $scope.selectedPollAll._id,
            voteValue: $scope.pollInputAll,
            voter: AuthService.userInfo()._id,
        };
    } else {
        result = {
            voteId: $scope.selectedPollAll._id,
            voteValue: $scope.pollInputAll,
            voter: 'ip'
        };
    }
    console.log(result);
    $http({
        method : "PUT",
        url : "/updatepoll",
        data: result
    }).then(function mySuccess(response) {
       console.log(response.data);
       if(response.data.err){
            notify({message:response.data.err,duration:3000,classes:'alert-danger'});
       }else{
            notify({message:'Vote submited Successfully!',duration:3000,classes:'alert-success'});
       }
       console.log("working");
      
    }, function myError(response) {
        console.log("error");
    });
   
   };
});

app.controller('homeController', ['$scope','$location','$rootScope','$http','AuthService','notify','$interval',
  function ($scope, $location,$rootScope,$http,AuthService,notify,$interval) {
    //   $scope.userPoll = []
    //  var getUserPolls = function(){
    //     //   $scope.userPoll = PollService.userPoll
    //     //  console.log($scope.userPoll)
    
    // // Call the async method and then do stuff with what is returned inside our own then function
    // PollService.async().then(function(data) {
    //     // $location.url('/mypolls');
    //     $scope.userPoll = data;
    //     console.log($scope.userPoll)
        
    //     });
    // };
    var getUserPolls = function(){
        var user = AuthService.userInfo() || "";
        $http({
        method : "GET",
        url : "/getmypolls/?user=" + user._id
    }).then(function mySuccess(response) {
       console.log(response.data);
       console.log("working");
       $scope.userPoll = response.data;
    //   console.log(response.data)
        // $window.location.href= "#!all"
    }, function myError(response) {
        console.log("error");
    });
    };
    getUserPolls();
  $scope.SelectedUserPoll = function(selected) {
        $rootScope.selectedPoll = $scope.userPoll[selected];
        // $window.location.href= "#!selected"
        var chartData = function(){
            var arr = [['Task', 'Hours per Day']];
            for(var i=0; i < $rootScope.selectedPoll.pollItems.length; i++){
                arr.push(
                    [$rootScope.selectedPoll.pollItems[i]['value'],$rootScope.selectedPoll.pollItems[i]['votes']]
                    );
            }
            return arr;
        };
        var title =  $rootScope.selectedPoll.question;
        $location.url('/selected');
        var stop;
        stop = $interval(function() {
            if (angular.element('#piechart').length) {
               $scope.stopInterval();
                var myElement = angular.element('#piechart')['0'];
                drawChart(chartData(), title, myElement);
                console.log(myElement);
                console.log('found');
            } 
          }, 100);
        
        $scope.stopInterval= function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };
      }; 
     
    $scope.voteSubmit = function(){
    var result;
    if(AuthService.isLoggedIn()){
        result = {
            voteId: $scope.selectedPoll._id,
            voteValue: $scope.pollInput,
            voter: AuthService.userInfo()._id,
        };
     
    console.log(result);
    $http({
        method : "PUT",
        url : "/updatepoll",
        data: result
    }).then(function mySuccess(response) {
       console.log(response.data);
       if(response.data.err){
            notify({message:response.data.err,duration:3000,classes:'alert-danger'});
       }else{
            notify({message:'Vote submited Successfully!',duration:3000,classes:'alert-success'});
       }
       console.log("working");
      
    }, function myError(response) {
        console.log("error");
    });
    }
   };
      
  }]);
//   app.controller('allPollsController',['AuthService','$scope','$http',
//   function (AuthService,$http,$scope) {
      
//   }]);

app.controller('newPollController',
  function (AuthService,$http,$scope,notify,$location) {
      //https://www.w3schools.com/angular/angular_application.asp
   $scope.myItems = [];
   $scope.question;
   $scope.userId = AuthService.userInfo()._id;
   console.log(AuthService.userInfo);
   console.log($scope.userId);
   $scope.addItem = function () {
       $scope.errortext = "";
       if (!$scope.addMe) {return;}
       if ($scope.myItems.indexOf($scope.addMe) == -1) {
           $scope.myItems.push({value:$scope.addMe,votes:0});
       } else {
           $scope.errortext = "The item is already in your vote.";
       }
   };
   $scope.removeItem = function (x) {
       $scope.errortext = "";
       $scope.myItems.splice(x, 1);
   };
   $scope.newPollSubmit = function(){
    var date = new Date().toUTCString();
    if($scope.userId){
        var data={
             user: $scope.userId,
             question: $scope.question,
             pollItems: $scope.myItems,
             date: date,
             voters: []
         };
   console.log(data);
    var req = {
        method: 'POST',
        url: '/newpoll',
        headers: {
          'Content-Type': "application/json"
        },
        data: data
       };
       
       $http(req).then(function(response){ 
        console.log(response);
        $location.url('/mypolls');
        notify({message:'Poll Created Successfully!',duration:3000,classes:'alert-success'});
        console.log("working");
       },function(response){
        console.log(response);
        console.log("error");
       });
    }
   };
      
  });

app.controller('profileController',
  function ($scope,AuthService) {
     $scope.user = AuthService.userInfo()
      
  });
        

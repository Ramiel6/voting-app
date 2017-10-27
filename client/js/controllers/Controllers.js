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
    };

var app = angular.module("VotingApp", ["ngRoute",'cgNotify']);
app.config(['$locationProvider','$httpProvider', function($locationProvider,$httpProvider){
    // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.withCredentials = true;
    // $locationProvider.html5Mode(true);
     
    
}]);
app.controller("MainController",
    function($scope,$http,$location,sharedProperties,AuthService,notify,$interval, $timeout) {
    // $location.path("/")
   $scope.loadingShow=false;
    // $scope.isDisabled = sharedProperties.getIsDisabled()
     $scope.$watch(function(scope) {
         return scope.isDisabled =AuthService.isLoggedIn();
     });
    
$scope.getAllPolls = function(){
      $scope.loadingShow=true;
      $http({
        method : "GET",
        url : "/getallpolls"
    }).then(function mySuccess(response) {
        $scope.allPolls = response.data;
       console.log($scope.allPolls);
       console.log("working");
    //   console.log(response.data)
        // $window.location.href= "#!all"
        $timeout(function(){
        //  $location.url('/all');
        $scope.loadingShow=false;
        },100);
        
    }, function myError(response) {
        console.log("error");
        $scope.loadingShow=false;
    });
  };
  $scope.getAllPolls();
    // $scope.setSelected = function(selected) {
    //   //https://stackoverflow.com/users/527968/liviu-t
    //     $scope.selected = selected; 
    //   };
      
});
app.controller('selectedController',
  function (AuthService,$http,$scope,notify,$location,$interval, $timeout,$rootScope,$routeParams,$route) {
    //  $scope.deleteShow = AuthService.isLoggedIn()
      $rootScope.selectedPoll;
      $scope.getSelected = function(selected) {
        if($scope.allPolls){
            $rootScope.selectedPoll = $scope.allPolls[selected];
        } 
        else if ($scope.userPoll){
             $rootScope.selectedPoll =  $scope.userPoll[selected];
             
        }
         $scope.drawPoll();
      };
      if((!$scope.allPolls || !$scope.userPoll) && !$rootScope.selectedPoll){
          console.log($rootScope.selectedPoll);
        //   $scope.drawPoll()
    //   }
    //   else{
         var id = $routeParams.id;
        var data = {id: id};
        console.log(data);
        $http({
            method : "Post",
            url : "/getonepoll",
            data: data
        }).then(function mySuccess(response) {
          console.log(response.data);
            if(response.data.err){
                 notify({message:'error',duration:3000,classes:'alert-danger'});
            }else{
                $rootScope.selectedPoll = response.data;
                 $scope.drawPoll();
                 console.log("working");
            }

        }, function myError(response) {
             console.log("error");
            //  notify({message:'Somthing went wrong',duration:3000,classes:'alert-danger'});
        });
      }
       $scope.drawPoll = function(){ 
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
       
        console.log(chartData());
        $location.url('/poll/' + $rootScope.selectedPoll._id);
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
        
    // $scope.getStatus =function() {
    //      AuthService.getUserStatus();
    // };
       };
    $scope.voteSubmit = function(){
    var result;
    console.log($scope.pollInput)
    if(AuthService.isLoggedIn()){
        result = {
            voteId: $rootScope.selectedPoll._id,
            voteValue: $scope.pollInput,
            voter: AuthService.userInfo()._id,
        };
    } else {
        result = {
            voteId: $rootScope.selectedPoll._id,
            voteValue:$scope.pollInput,
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
      $location.url('/mypolls');
        // $route.reload();
    }, function myError(response) {
        console.log("error");
        notify({message:'Somthing went wrong',duration:3000,classes:'alert-danger'});
    });
   
   };
  });

app.controller('homeController', ['$scope','$location','$rootScope','$http','AuthService','notify','$interval','$routeParams','$route',
  function ($scope, $location,$rootScope,$http,AuthService,notify,$interval,$routeParams,$route) {
    
    var getUserPolls = function(){
        $scope.loadingShow=true;
        var user = AuthService.userInfo() || "";
        $http({
        method : "GET",
        url : "/getmypolls/?user=" + user._id
    }).then(function mySuccess(response) {
       console.log(response.data);
       console.log("working");
       $scope.userPoll = response.data;
    //   console.log(response.data)
       $scope.loadingShow=false;
    }, function myError(response) {
        console.log("error");
        $scope.loadingShow=false;
    });
    };
    getUserPolls();
    
    $scope.deletePoll = function(selected){
        $scope.selectedPollDel = $scope.userPoll[selected];
        var data = {id: $scope.selectedPollDel._id};
        console.log(data);
        $http({
            method : "POST",
            url : "/deletepoll",
            data: data
        }).then(function mySuccess(response) {
        //   console.log(response.data);
            console.log("deleted");
            if(response.data.err){
                 notify({message:response.data.err,duration:3000,classes:'alert-danger'});
            }else{
                 notify({message:'Vote deleted Successfully!',duration:3000,classes:'alert-success'});
            }
            // $location.url('/mypolls');
            $route.reload();
        }, function myError(response) {
             console.log("error");
             notify({message:'Somthing went wrong',duration:3000,classes:'alert-danger'});
        });
    };

      
  }]);


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
        notify({message:'Somthing went wrong',duration:3000,classes:'alert-danger'});
       });
    }
   };
      
  });

app.controller('profileController',
  function ($scope,AuthService) {
     $scope.user = AuthService.userInfo();
      
  });
        

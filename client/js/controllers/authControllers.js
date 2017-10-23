// var app = angular.module("VotingApp");
app.controller('loginController',
  ['$scope', '$location', 'AuthService','sharedProperties',
  function ($scope, $location, AuthService,sharedProperties) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          sharedProperties.setIsDisabled(false);
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
          
        })
        // handle error
        .catch(function (errMsg) {
          $scope.error = true;
          // $scope.errorMessage = "Invalid username and/or password";
          console.log(errMsg);
          $scope.errorMessage = errMsg.err;
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);
app.controller('logoutController',
  ['$scope', '$location', 'AuthService','sharedProperties',
  function ($scope, $location, AuthService,sharedProperties) {
    
    $scope.logout = function () {

      // call logout from service
      AuthService.logout();
      sharedProperties.setIsDisabled(true);
      $location.url('/');
       
    };

}]);
app.controller('registerController',
  ['$scope', '$location', 'AuthService','notify',
  function ($scope, $location, AuthService, notify) {
    $scope.regText = "Register";
    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      $scope.regText = "Working";

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.url('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
          $scope.regText = "Register";
          notify({message:'Registration Successful!',duration:3000,classes:'alert-success'});
        })
        // handle error
        .catch(function (errMsg) {
          $scope.error = true;
          $scope.errorMessage = errMsg;
          $scope.disabled = false;
          $scope.regText = "Register";
          $scope.registerForm = {};
        });

    };

}]);

angular.module("VotingApp").factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;
    var userProfile;
    //funtions
    
    function isLoggedIn() {
        if(user) {
            return true;
        } else {
            return false;
        }
    }
    function getUserStatus() {
      return $http.get('/status',{withCredentials: true})
      // handle success
      .then(function success (response) {
        if(response.data.status){
          // console.log(response)
          user = true;
          userProfile = response.data.user;
          // console.log(userProfile._id)
        } else {
          user = false;
        }
      },
      // handle error
      function error (response) {
        // console.log(response)
        user = false;
      });
    }

    function login(username, password) {
    
    // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a post request to the server
        $http.post('/login',
        {username: username, password: password})
        // handle success
        .then(function success (result, status) {
          if(result.status === 200 && result.status){
            user = true;
            userProfile = result.data.user;
          // console.log(result)
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        }
        // handle error
        ,function error (errMsg) {
          user = false;
          deferred.reject(errMsg.data.err);
        });
        
        // return promise object
        return deferred.promise;
    }
    
    function logout() {
    
        // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a get request to the server
        $http.get('/logout')
        // handle success
        .then(function success (data) {
          user = false;
          userProfile = undefined;
          deferred.resolve();
          console.log(data);
        },
        // handle error
        function error (data) {
          user = false;
          deferred.reject();
        });
        
        // return promise object
        return deferred.promise;
    
    }
    function register(email, password) {
    
        // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a post request to the server
        $http.post('/register',
        {email: email, password: password})
        // handle success
        .then(function success (result, status) {
          if( result.status === 200 && result.status){
            console.log(result);
            deferred.resolve();
          } else {
            deferred.reject();
          }
        },
        // handle error
        function error (errMsg) {
          console.log(errMsg);
          deferred.reject(errMsg.data.err);
        });
        console.log(JSON.stringify(deferred.promise));
        // return promise object
        return deferred.promise;
    }
    function getUserInfo (){
      return userProfile;
    } 
    
    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      userInfo : getUserInfo 
    });

}]);


// app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
//   return {
//     responseError: function (response) {
//       $rootScope.$broadcast({
//         401: AUTH_EVENTS.notAuthenticated,
//       }[response.status], response);
//       return $q.reject(response);
//     }
//   };
// })
 
// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// });
app.factory('sharedProperties', function (AuthService) {
  //https://stackoverflow.com/questions/12008908/angularjs-how-can-i-pass-variables-between-controllers
        var isDisabled = true;
        // var username = AuthService.username;

        return {
            getIsDisabled: function () {
                return isDisabled;
            },
            setIsDisabled: function(value) {
                isDisabled = value;
            },
            getUserInfo: function () {
                return AuthService.userInfo();
            }
        };
    });
// app.factory('PollService', function ($http,$location, AuthService) {
//           // console.log(AuthService.username())
//   var id  = AuthService.userInfo()._id 
//   var promise;
//   console.log(AuthService.userInfo())
//   var PollService = {
//     // https://stackoverflow.com/questions/12505760/processing-http-response-in-service
//     async: function() {
//       // if ( !promise ) {
//         // $http returns a promise, which has a then function, which also returns a promise
//         promise =  $http({
//             method : "GET",
//             url : "/getmypolls/?user=" + id
//             }).then(function mySuccess(response) {
//                 // The then function here is an opportunity to modify the response
//                 console.log(response);
//                 console.log("working");
//                 // $window.location.href= "#!all"
//                 // The return value gets picked up by the then in the controller.
//                 return response.data;
//             }, function myError(response) {
//             console.log("error");
//         });
//       // }
//       // Return the promise to the controller
//       return promise;
//     }
//   };
//   return PollService;

// });
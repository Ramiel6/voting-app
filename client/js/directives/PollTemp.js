app.directive('poll', function() { 
    return { 
      restrict: 'E', 
      scope: { 
        items: '=',
      }, 
      templateUrl: 'js/directives/pollTemp.html',
    //   link: function (scope, elem, attrs) { },
    }; 
  });
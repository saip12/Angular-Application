// Code goes here



var app = angular.module('myapp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
      templateUrl: 'login.html',
      controller: 'loginController'
    })
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'registerController'
    })
    .when('/home/:id', {
      templateUrl: 'home.html',
      controller: 'HomeController',
      resolve: {
        logIn: onLogIn
      }
    })
    .when('/profile/:id', {
      templateUrl: 'profile.html',
      controller: 'ProfileController',
      resolve: {
        logIn: onLogIn
      }
    })
    .when('/message/:id', {
      templateUrl: 'message.html',
      controller: 'messageController',
      resolve: {
        logIn: onLogIn
      }
    })
    .when('/logout', {
      templateUrl: 'login.html',
      controller: 'loginController'
    })
    .otherwise({
      redirectTo: '/'
    });
});


var onLogIn = function( $q, Check,$location) {
  var deferred = $q.defer();
  if (Check.isLogin()) {
    deferred.resolve();
  } else {
    deferred.reject();

    $location.path('/');
  }
  return deferred.promise;
};



app.factory('Check', function() {
  var user;

  return {
    setUser: function(aUser) {
      localStorage.setItem('MyUser', aUser);

    },
    isLogin: function() {
      user = localStorage.getItem('MyUser');
      return (user) ? user : false;
    }
  }
})


app.controller('loginController', function($scope, Check, $filter, $location) {

  if (localStorage.getItem('MyUser') !== null) {
    localStorage.removeItem('MyUser');
    $location.path('/');
  }


  $scope.login = function() {


    $scope.loginCheckArr = angular.fromJson(localStorage.getItem('MyArr'));

    $scope.myRedObjects = $filter('filter')($scope.loginCheckArr, {
      "Username": $scope.loginUserName,
      "Password": $scope.loginPassword
    });

    Check.setUser($scope.myRedObjects[0].id);

    $location.path('/home/' + $scope.myRedObjects[0].id);

  }


});


app.controller('registerController', function($scope, $location) {

  if (localStorage.getItem('MyArr') !== null) {
    $scope.usersArr = angular.fromJson(localStorage.getItem('MyArr'));

  } else {

    $scope.usersArr = [];
  }

  $scope.myId = localStorage.getItem('myNextId');

  if ($scope.myId === null) {
    $scope.myId = parseInt(0);
  }





  $scope.registerUser = function() {



    $scope.Myobj = {
      "id": $scope.myId,
      "Firstname": $scope.firstName,
      "Lastname": $scope.lastName,
      "Location": $scope.mylocation,
      "Gender": $scope.gender,
      "Email": $scope.email,
      "Phone": $scope.phone,
      "Username": $scope.username,
      "Password": $scope.password,
    };

    $scope.usersArr.push($scope.Myobj);

    localStorage.setItem('MyArr', angular.toJson($scope.usersArr));

    $scope.myId = parseInt($scope.myId) + parseInt(1);

    localStorage.setItem('myNextId', $scope.myId);


    $location.path('/');

  }
});


app.controller('HomeController', function($scope, $routeParams, $filter, $location) {


  $scope.homeCheckArr = angular.fromJson(localStorage.getItem('MyArr'));

  $scope.myhomeObjects = $filter('filter')($scope.homeCheckArr, {
    "id": $routeParams.id,
  });

  $scope.menuID = $routeParams.id;


  $scope.myfname = $scope.myhomeObjects[0].Firstname;
  $scope.mylname = $scope.myhomeObjects[0].Lastname;
  //console.log($scope.myhomeObjects);

});


app.controller('ProfileController', function($scope, $routeParams, $filter, $location) {


  $scope.profileCheckArr = angular.fromJson(localStorage.getItem('MyArr'));

  $scope.myprofileObjects = $filter('filter')($scope.profileCheckArr, {
    "id": $routeParams.id,
  });

  $scope.ArrEleInd = $scope.profileCheckArr.indexOf($scope.myprofileObjects[0]);

  $scope.menuID = $routeParams.id;



  $scope.firstName = $scope.myprofileObjects[0].Firstname;
  $scope.lastName = $scope.myprofileObjects[0].Lastname;
  $scope.mylocation = $scope.myprofileObjects[0].Location;
  $scope.gender = $scope.myprofileObjects[0].Gender;
  $scope.phone = $scope.myprofileObjects[0].Phone;
  $scope.email = $scope.myprofileObjects[0].Email;
  $scope.username = $scope.myprofileObjects[0].Username;
  $scope.password = $scope.myprofileObjects[0].Password;


  $scope.updateUser = function() {

    $scope.Myobj = {
      "id": $scope.menuID,
      "Firstname": $scope.firstName,
      "Lastname": $scope.lastName,
      "Location": $scope.mylocation,
      "Gender": $scope.gender,
      "Email": $scope.email,
      "Phone": $scope.phone,
      "Username": $scope.username,
      "Password": $scope.password,
    };

    $scope.profileCheckArr[$scope.ArrEleInd] = $scope.Myobj;

    localStorage.setItem('MyArr', angular.toJson($scope.profileCheckArr));

  }


});




app.controller('messageController', function($scope, $routeParams, $filter, $location) {

  $scope.menuID = $routeParams.id;
  $scope.messagesCheckArr = angular.fromJson(localStorage.getItem('MyArr'));



  $scope.emailMessage = function() {


    $scope.mymessageObjects = $filter('filter')($scope.messagesCheckArr, {
      "Email": $scope.composeEmail,
    });


    $scope.frommymessageObjects = $filter('filter')($scope.messagesCheckArr, {
      "id": $routeParams.id,
    });



    if ($scope.mymessageObjects[0].message === undefined) {

      $scope.mymessagelist = [];
    } else {
      $scope.mymessagelist = $scope.mymessageObjects[0].message;

    }



    $scope.Mymessageobj = {
      "from": $scope.frommymessageObjects[0].Email,
      "subject": $scope.subject,
      "note": $scope.mycomment
    };


    $scope.mymessagelist.push($scope.Mymessageobj);


    $scope.MsArrEleInd = $scope.messagesCheckArr.indexOf($scope.mymessageObjects[0]);
    console.log($scope.MsArrEleInd);
    $scope.messagesCheckArr[$scope.MsArrEleInd].message = $scope.mymessagelist;

    localStorage.setItem('MyArr', angular.toJson($scope.messagesCheckArr));

  }

  $scope.data = $scope.messagesCheckArr[$scope.menuID].message;
  console.log($scope.data);
  

});
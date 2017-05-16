require('angular');
require('angular-router-browserify')(angular);

var app = angular.module('app',["firebase", "ui.router", "ui-notification", "notificationTest"]);

var authConfig = require('./config/firebase/authConfig');
app.config(authConfig);

  // for ui-router
app.run(["$rootScope", "$state", "Auth", function($rootScope, $state, Auth) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("home");
    }
  });
}]);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state("home", {
      // the rest is the same for ui-router and ngRoute...
      controller: "HomeCtrl",
      url: '/',
      templateUrl: "partials/homeView.html",
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        // Auth refers to our $firebaseAuth wrapper in the factory below
        "currentAuth": ["Auth", function(Auth) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.$waitForSignIn();
        }],
      }
    })
    .state("account", {
      // the rest is the same for ui-router and ngRoute...
      controller: "AccountCtrl",
      templateUrl: "views/account.html",
      resolve: {
        // controller will not be loaded until $requireSignIn resolves
        // Auth refers to our $firebaseAuth wrapper in the factory below
        "currentAuth": ["Auth", function(Auth) {
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireSignIn();
        }]
      }
    });
}]);

app.controller("HomeCtrl", ["currentAuth", "$firebaseObject", "firebaseRootRef", "$scope", function(currentAuth, $firebaseObject, firebaseRootRef, $scope) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or null if not signed in
  console.log(currentAuth);

}]);

app.controller("AccountCtrl", ["currentAuth", function(currentAuth) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or null if not signed in
}]);


var firebaseAuth = require('./config/firebase/firebaseAuth');
app.factory("Auth", ['$firebaseAuth', firebaseAuth]);

var firebaseRootRef = require('./config/firebase/firebaseRootRef');
app.factory("firebaseRootRef", ["firebase", firebaseRootRef]);

/*var userFactory = require(./shared/user/userFactory.js);
app.factory("userFactory", ["user", userFactory]);*/



var navbarDirective = require('./shared/navbar/navbarDirective');
app.directive('navbarTop', [navbarDirective]);

var popupDirective = require('./shared/popup/popupDirective');
app.directive('popup', [popupDirective]);

var registrationDirective = require('./shared/popup/registrationDirective');
app.directive('registration', [registrationDirective]);

var fbImageUploadDirective = require('./components/home/fbImageUploadDirective.js');
app.directive('fbImageUpload', [fbImageUploadDirective]);

var fbSrcDirective = require('./components/home/fbSrcDirective.js');
app.directive('fbSrc', ['$log', fbSrcDirective]);

var ImageUploadCtrl = require('./components/home/ImageUploadCtrl.js');
app.controller('ImageUpload', ['$scope', '$log', 'Auth', 'firebaseRootRef', '$firebaseObject', ImageUploadCtrl]);

var photoDirective = require('./shared/photoWall/photoDirective.js');
app.directive('photoDir', [photoDirective]);

angular.module("ui-notification", []), angular.module("ui-notification").value("uiNotificationTemplates", "angular-ui-notification.html"), angular.module("ui-notification").factory("Notification", ["$timeout", "uiNotificationTemplates", "$http", "$compile", "$templateCache", "$rootScope", "$injector", "$sce", function(t, e, i, n, a, o, s, c) {
  var r = 10,
    l = 10,
    u = 10,
    p = 10,
    d = 5e3,
    f = [],
    m = function(s, m) {
      "object" != typeof s && (s = {
        message: s
      }), s.template = s.template ? s.template : e, s.delay = angular.isUndefined(s.delay) ? d : s.delay, s.type = m ? m : "", i.get(s.template, {
        cache: a
      }).success(function(e) {
        var i = o.$new();
        if (i.message = c.trustAsHtml(s.message), i.title = c.trustAsHtml(s.title), i.t = s.type.substr(0, 1), i.delay = s.delay, "object" == typeof s.scope)
          for (var a in s.scope) i[a] = s.scope[a];
        var d = function() {
            for (var t = 0, e = 0, i = r, n = f.length - 1; n >= 0; n--) {
              var a = f[n],
                o = parseInt(a[0].offsetHeight),
                s = parseInt(a[0].offsetWidth);
              c + o > window.innerHeight && (i = r, e++, t = 0);
              var c = i + (0 === t ? 0 : u),
                d = l + e * (p + s);
              a.css("bottom", c + "px"), a.css("right", d + "px"), i = c + o, t++
            }
          },
          m = n(e)(i);
        m.addClass(s.type), m.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd click", function(t) {
          ("click" === t.type || "opacity" === t.propertyName && t.elapsedTime >= 1) && (m.remove(), f.splice(f.indexOf(m), 1), d())
        }), t(function() {
          m.addClass("killed")
        }, s.delay), angular.element(document.getElementsByTagName("body")).append(m), f.push(m), t(d)
      }).error(function(t) {
        throw new Error("Template (" + s.template + ") could not be loaded. " + t)
      })
    };
  return m.config = function(t) {
    r = t.top ? t.top : r, u = t.verticalSpacing ? t.verticalSpacing : u
  }, m.primary = function() {
    this(args, "")
  }, m.error = function(t) {
    this(t, "error")
  }, m.success = function(t) {
    this(t, "success")
  }, m.info = function(t) {
    this(t, "info")
  }, m.warning = function(t) {
    this(t, "warning")
  }, m
}]), angular.module("ui-notification").run(["$templateCache", function(t) {
  t.put("angular-ui-notification.html", '<div class="ui-notification"><h3 ng-show="title" ng-bind-html="title"></h3><div class="message" ng-bind-html="message"></div></div>')
}]);






//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////


 angular.module('notificationTest', ['ui-notification']);

            angular.module('notificationTest')

            .controller('notificationController', function($scope, Notification) {

                $scope.primary = function() {
                    Notification('Primary notification');
                };

                $scope.error = function() {
                    Notification.error('Error notification');
                };

                $scope.success = function() {
                    Notification.success('Success notification');
                };

                $scope.info = function() {
                    Notification.info('Information notification');
                };

                $scope.warning = function() {
                    Notification.warning('Warning notification');
                };

                // ==

                $scope.primaryTitle = function() {
                    Notification({message: 'Primary notification', title: 'Primary notification'});
                };

                // ==

                $scope.errorTime = function() {
                    Notification.error({message: 'Error notification 1s', delay: 1000});
                };

                $scope.successTime = function() {
                    Notification.success({message: 'Success notification 1s', delay: 1000});
                };

                // ==

                $scope.errorHtml = function() {
                    Notification.error({message: '<b>Error</b> <s>notification</s>', title: '<i>Html</i> <u>message</u>'});
                };

                $scope.successHtml = function() {
                    Notification.success({message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">', title: 'Html content'});
                };
            });

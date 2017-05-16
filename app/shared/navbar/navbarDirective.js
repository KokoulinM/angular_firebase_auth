module.exports = function(){
	return {
		restrict: 'E',
		templateUrl: './app/shared/navbar/navbar.tpl.html',
		controller: ['$scope', 'Auth','$firebaseObject', 'firebaseRootRef', function($scope, Auth, $firebaseObject, firebaseRootRef){
			this.login = function($event){
				$event.preventDefault();
				$scope.$emit('loginClick',{
					eventType: 'open'
				})
			}
			this.signup = function($event){
				$event.preventDefault();
				$scope.$emit('signupClick',{
					eventType: 'open'
				})
			}
			this.signout = function(){
				Auth.$signOut().then(function(){
					$scope.firebaseUser = Auth.$getAuth();
				/*$scope.displayName = '';*/
					$scope.successTime();
					console.log('sign out');
				}, function(error){
					console.log('error');
				});
			}
			var getName = function(){
		      var currentAuth = Auth.$getAuth();
		      if(currentAuth){
		        if(currentAuth.providerData && currentAuth.providerData[0].displayName){
		          $scope.displayName = currentAuth.providerData[0].displayName;
		        }else{
		          var userInfo = $firebaseObject(firebaseRootRef.child("users").child(currentAuth.uid));
		          /*$scope.displayName = userInfo.displayName;*/
		          userInfo.$loaded().then(function() {
		            $scope.displayName = userInfo.displayName;
		          });
		        }
		      }else{
		        $scope.displayName = '';
		      }
		    }
			Auth.$onAuthStateChanged(function(firebaseUser) {
      		$scope.firebaseUser = firebaseUser;
					getName();
    	});
		}],
		controllerAs: 'navCtrl'
	}
}

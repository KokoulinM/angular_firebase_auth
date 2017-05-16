module.exports = function(){
	return{
		restrict: 'E',
		templateUrl: './app/shared/popup/registration.tpl.html',
		link: function($scope, $elem){
			$scope.$on('signupClick', function($event,data){
				var el = $elem[0].firstElementChild;
				if(data.eventType == 'open'){
					el.hidden = false;
				}else if(data.eventType == 'close'){
					el.hidden = true;
				}else el.hidden = !el.hidden;
			})
		},
		controller: ['Auth', '$scope', 'firebaseRootRef', '$firebaseObject', function(Auth, $scope, firebaseRootRef, $firebaseObject){
			var popup = this;
			this.data = {};
			this.submit = function(){
				Auth.$createUserWithEmailAndPassword(popup.data.email, popup.data.password).then(function(firebaseUser) {
					$scope.$emit('signupClick',{eventType: 'close'});
					$scope.successTime();
					firebaseRootRef.child("users").child(firebaseUser.uid).set({
		      			provider: 'password',
		     			displayName: popup.data.lastName + ' ' + popup.data.firstName
		   			});
					$scope.firebaseUser = Auth.$getAuth();
					var userInfo = $firebaseObject(firebaseRootRef.child("users").child(firebaseUser.uid));
					userInfo.$loaded().then(function() {
					   $scope.displayName = userInfo.displayName;
					});
					console.log(userInfo['displayName']);
					console.log($scope.displayName);
		   			console.log("Signup as:", firebaseUser.uid);
					}).catch(function(error) {
					$scope.errorTime();
					console.error("Registration failed:", error);
				});
			}
			this.isPasswordsEqual = function(){
				$scope.signUpform.checkPassword.$setValidity('pwmatch', popup.data.password2 === popup.data.password);
			}
		}],
		controllerAs: 'signupCtrl'
	}
}

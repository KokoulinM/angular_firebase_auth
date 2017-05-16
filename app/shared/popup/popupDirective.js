module.exports = function(){
	return{
		restrict: 'E',
		templateUrl: './app/shared/popup/popup.tpl.html',
		link: function($scope, $elem){
			/*var form = $elem[0].getElementsByTagName('form');*/
			$scope.$on('loginClick', function($event,data){
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
			this.signInWith = function(str){
				Auth.$signInWithPopup(str).then(function(firebaseUser) {
					$scope.$emit('loginClick',{eventType: 'close'});
					$scope.firebaseUser = Auth.$getAuth();
					$scope.successTime();
				  console.log("Signed in as:", firebaseUser.user.uid);
				}).catch(function(error) {
					$scope.errorTime();
				  console.error("Authentication failed:", error);
				});
			}
			this.submit = function(){
				Auth.$signInWithEmailAndPassword(popup.data.email, popup.data.password).then(function(firebaseUser) {
				  $scope.firebaseUser = Auth.$getAuth();
				  $scope.$emit('loginClick',{eventType: 'close'});
				  $scope.successTime();
				  console.log("Signed in as:", firebaseUser.uid);
				}).catch(function(error) {
				  console.error("Authentication failed:", error);
					$scope.errorTime();
				});
			}
		}],
		controllerAs: 'popupCtrl'
	}
}

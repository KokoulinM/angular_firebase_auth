module.exports = function(){
  return {
    restrict: "E",
    templateUrl: "./app/shared/photoWall/photoWall.tpl.html",
    controller: ['Auth', 'firebaseRootRef', '$firebaseObject','$scope',  function(Auth, firebaseRootRef, $firebaseObject, $scope){
      this.images = $firebaseObject(firebaseRootRef.child("images"));
      this.users = $firebaseObject(firebaseRootRef.child("users"));
      var self = this;
      this.removeImage = function(id){
        var firebaseUser = Auth.$getAuth();
        if (firebaseUser) {
          var obj = $firebaseObject(self.images.$ref().child(id));
          obj.$remove().then(function(ref) {
            console.log('data has been deleted locally and in the database');
          }, function(error) {
            console.log("Error:", error);
          });
          console.log("Signed in as:", firebaseUser.uid);
        } else {
          console.log("Signed out");
        }
      }
    }],
    controllerAs: 'imageCtrl'
  }
}

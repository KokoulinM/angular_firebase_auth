module.exports = function(){
  var getName = function(){
      var currentAuth = Auth.$getAuth();
      if(currentAuth){
        if(currentAuth.displayName){
          return currentAuth.displayName;
        }else{
          var userInfo = $firebaseObject(firebaseRootRef.child("users").child(currentAuth.uid));
          /*$scope.displayName = userInfo.displayName;*/
          userInfo.$loaded().then(function() {
            return userInfo.displayName;
          });
        }
      }else{
        return '';
      }
    }
    return getName();
}

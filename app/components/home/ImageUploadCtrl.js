module.exports = function($scope, $log, Auth, firebaseRootRef, $firebaseObject) {
		$scope.upload_image = function (image) {
			if (!image.valid) return;

			var imagesRef, safename, imageUpload;

			image.isUploading = true;
			console.log(Auth.$getAuth());

			function stringGen(len){
    		var text = " ";
				var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    		for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    		return text;
			}

			imageUpload = {
				isUploading: true,
				data: image.data,
				/*thumbnail: image.thumbnail,*/
				name: image.filename,
				author: {
				/*provider: $scope.firebaseUser.provider,*/
				/*id: $scope.firebaseUser.id*/
				id: Auth.$getAuth().uid
				}
			};

			safename = 'base64Image_' + imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "") + stringGen(10);
			imageUpload.id = safename;
			imagesRef = firebaseRootRef.child('images');

			imagesRef.child(safename).set(imageUpload, function (err) {
				if (!err) {
					imagesRef.child(safename).child('isUploading').remove();
					$scope.$apply(function () {
						$scope.status = 'Your image "' + image.filename + '" has been successfully uploaded!';
						if ($scope.uploaded_callback !== undefined) {
							$scope.uploaded_callback(angular.copy(imageUpload));
						}
						image.isUploading = false;
						image.data = undefined;
						image.filename = undefined;
					});
				}else{
					$scope.error = 'There was an error while uploading your image: ' + err;
				}
			});
		};
};

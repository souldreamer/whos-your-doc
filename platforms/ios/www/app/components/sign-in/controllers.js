angular.module('whos_your_doc.controllers')

.controller('signinCtrl', function($scope, $http, $timeout, $state, StorageService, $ionicLoading, $ionicPopup, $log, $ionicSlideBoxDelegate) {


	$scope.forms = {};

$scope.cancel = function() {
	$scope.$watch('forms.userForm', function(form) {
		form.$setPristine();
		form.$setUntouched();
		$scope.user.email = "";
		$scope.user.password = "";

		$state.go('landingpage');
	});
};
	if (StorageService.getSession('auth_token').length != 0) {
		$state.go('tab.home');
	} else {


    $scope.user = {};
    $scope.server_error = {
      email: "",
      password: ""
    };
    $scope.showAlert = function(title, message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function(res) {
        if(res) {
          if(callback) {
            callback();
          }
        }
      });
    };
    $scope.show = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> <h4 class="uppercase">Signing in...</h4>'
      }).then(function(){
        console.log("The loading indicator is now displayed");
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide().then(function () {
        console.log("The loading indicator is now hidden");
      });
    };


    $scope.authentificate = function (user) {

      $scope.show();
      $http.post(citylimoConfig.authAPI + 'login', {
        "email": user.email,
        "password": user.password

      }).then(function (response) {
        $scope.hide();
        $scope.server_error = {};
        //alert("congrats!");
        console.log(response);

        StorageService.addSession('auth_token', response.data.token);
        console.log(StorageService.getSession('auth_token'));

        $state.go('tab.home');

      }, function (error) {
          $scope.hide();
        if (error.status == -1) {
          $scope.showAlert("Error", "There is no internet connection - please connect to a network");
        }
        else if (error.data.message == "Email doesn't exist") {

          $scope.server_error.email = error.data.message;
          //$scope.server_error.password = "";

        } else if (error.data.message == "Incorrect password") {
          $scope.server_error.password = error.data.message;
          //$scope.server_error.email = "";
        } else if (error.data.message == "This user has been disabled") {
          $scope.server_error.password = error.data.message;
          //$scope.server_error.email = "";
        } else {
          $scope.server_error.password = "Something went wrong";
        }

        console.log(error);
      })
    }
  }
})

.controller('forgotpassCtrl', function($scope, $http, $state, $timeout, StorageService, $ionicSlideBoxDelegate, $ionicLoading, $ionicPopup) {


	$scope.forms = {};

	$scope.cancel = function() {
		$scope.$watch('forms.userForm', function(form) {
			form.$setPristine();
			form.$setUntouched();
			form.$invalid = false;
			$scope.user.email = "";
			$scope.server_error = {};
		});
		$state.go('signin');
	};
  $scope.showAlert = function(title, message) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: message
    });

    alertPopup.then(function(res) {
      if(res) {
        if(callback) {
          callback();
        }
      }
    });
  };
	if (StorageService.getSession('auth_token').length != 0) {
		$state.go('tab.home');
	}

	$scope.user = {};
	$scope.server_error = {
		email: ""
	};

	$scope.show = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner><h4 class="uppercase">sending...</h4>'
		})
	};

	$scope.showSuccess = function() {
		$ionicLoading.show({
			template: '<i class="icon ion-checkmark"></i><h4 class="uppercase">email sent</h4>'
		})
	};

	$scope.hide = function() {
		$ionicLoading.hide();
	};

	$scope.submit = function(user) {
		$scope.show();
		$http.post(citylimoConfig.authAPI + 'forgotPass', {
			"email": user.email,
		}).then(function(response) {

			$scope.server_error = {};
			//alert("congrats!");
			console.log(response);

				if (response.data.success == true) {
					$scope.showSuccess();
					$timeout(function() {
						$scope.hide();
						$state.go('signin');
					},1000)
				}
		}, function(error) {
      $timeout(function() {
        $scope.hide();
      }, 500);
			if (error.status == -1) {

			  $scope.showAlert("Error", "There is no internet connection - please connect to a network", function() {
          $state.go('signin');
        });
			}
			if (error.data.message == "No Account associated with this email") {
				$scope.server_error.email = error.data.message;
			}
			else {
				$scope.server_error.password = "Something went wrong";
			}

			console.log(error.data);
		})


	}

});

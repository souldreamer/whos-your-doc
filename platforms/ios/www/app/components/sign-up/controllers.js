angular.module('whos_your_doc.controllers')

.controller('signupCtrl', function($scope, $http, $state, StorageService, $timeout, $ionicLoading, $ionicPopup) {


	if (StorageService.getSession('auth_token').length != 0) {
		$state.go('tab.home');
	} else {

		$scope.user = {};
		$scope.server_error = {
			email: "",
			password: ""
		};

		$scope.forms = {};

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

		$scope.cancel = function() {
			$scope.$watch('forms.userForm', function(form) {
				form.$setPristine();
				form.$setUntouched();
				$scope.user.firstName = "";
        $scope.user.lastName = "";
				$scope.user.email = "";
				$scope.user.mobile = "";
				$scope.user.password = "";
				$scope.user.companyName = "";
				$scope.user.cif = "";
				$scope.server_error = {};

			});
			$state.go('landingpage');
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


		$scope.authentificate = function(user) {
			// function getFirstName(name) {
			// 	var arr = name.split(' ');
			// 	if(arr.length == 1) {
			// 		return arr[0];
			// 	}
			// 	return arr.slice(0, -1).join(' ');
			// }
			// function getLastName(name) {
			// 	var arr = name.split(' ');
			// 	if(arr.length == 1) {
			// 		return " ";
			// 	}
			// 	return arr.slice(-1).join(' ');
			// }
			// var splitFullName = user.fullName.split(' ');
			//console.log(splitFullName);

      $scope.show();

      $http.post(citylimoConfig.authAPI + 'register', {
				// "company": {
				// 	"departmentName": user.companyName,
				// 	"departmentId": user.cif
				// },
				"firstName": user.firstName,
				"lastName": user.lastName,
				"email": user.email,
				"password": user.password,
				"personalInformation": {
					"phone": user.mobile
				}
			}).then(function(response) {

			  $timeout(function() {
			    $scope.hide();

          $scope.server_error = {};
          console.log(response);
          StorageService.addSession('auth_token', response.data.token);

          console.log(response);
          $state.go('tab.home');

        },10);

			}, function(error) {
				$scope.hide();
				console.log(error);

				if (error.status == -1) {
          $scope.showAlert("Error", "There is no internet connection - please connect to a network");

				} else if (error.data.message == "E-mail already registered") {

					$scope.server_error.email = error.data.message;
					//$scope.server_error.password = "";
					console.log(error);
				}
			})
		}
  }
});

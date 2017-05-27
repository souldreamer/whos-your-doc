angular.module('whos_your_doc.controllers')

.controller('onboardingCtrl', function($scope, $state, StorageService, $ionicSlideBoxDelegate) {
  // StorageService.addSession('firstUse', false);
  if (StorageService.getSession('firstUse') == false) {
    StorageService.addSession('firstUse', true);
  } else {
    $state.go('main.search');
  }
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.skip = function() {
    $state.go('landingpage');
  };

  $scope.goBack = function() {
    $state.go('landingpage');
  }

})
.controller('landingCtrl', function($scope, $state, StorageService, $ionicSlideBoxDelegate) {
	if (StorageService.getSession('auth_token').length != 0) {
			$state.go('tab.home');
	}
})
.controller('termsCtrl', function($scope, $state, StorageService, $ionicSlideBoxDelegate) {
  $scope.goBack = function() {
    $state.go('landingpage');
  }
});

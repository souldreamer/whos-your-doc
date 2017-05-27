app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.transition('none');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.views.swipeBackEnabled(false);

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        .state('onboarding', {
            url: '/onboarding',
            templateUrl: 'app/components/onboarding/templates/onboarding.html',
            controller: 'onboardingCtrl'
        })

        .state('landingpage', {
            url: '/landingpage',
            templateUrl: 'app/components/onboarding/templates/landing_page.html',
            controller: 'landingCtrl'
        })
        // .state('main', {
        //     url: '/main',
        //     templateUrl: 'app/components/main/templates/contact.html',
        //     controller: 'mainCtrl'
        // });

        .state('main', {
            url: '/main',
            abstract: true,
            templateUrl: 'app/components/main/templates/menu.html',
            controller: 'mainCtrl'
        })

        .state('main.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'app/components/main/templates/search.html'
                }
            }
        });

    $urlRouterProvider.otherwise('/onboarding');

});

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
    .state('terms', {
      url: '/terms',
      templateUrl: 'app/components/onboarding/templates/terms.html',
      controller: 'termsCtrl'
    })
    .state('terms2', {
      url: '/terms2',
      templateUrl: 'app/components/main/templates/terms.html',
      controller: 'termsCtrl2'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'app/components/main/templates/about.html',
      controller: 'aboutCtrl'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'app/components/main/templates/contact.html',
      controller: 'contactCtrl'
    })
    .state('account', {
      url: '/account',
      templateUrl: 'app/components/main/templates/account.html',
      controller: 'accountCtrl'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/components/sign-in/templates/login.html',
      controller: 'signinCtrl'
    })
    .state('forgotpass', {
      url: '/forgotpass',
      templateUrl: 'app/components/sign-in/templates/forgot_password.html',
      controller: "forgotpassCtrl"
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/components/sign-up/templates/register.html',
      controller: 'signupCtrl'
    })

    .state('tab', {
      url: '/main/tab',
      templateUrl: 'app/components/main/templates/tabs.html',
      controller: 'tabsCtrl'
    })

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'app/components/main/templates/tabs/home.html'
        }
      }
    })
    .state('tab.orders', {
      url: '/orders',
      views: {
        'tab-orders': {
          templateUrl: 'app/components/main/templates/tabs/orders.html',
          controller: 'orderCtrl'
        }
      }
    })
    .state('feedback', {
      url: '/order/:userId/:orderId',
      templateUrl: 'app/components/main/templates/tabs/feedback.html',
      controller: 'feedbackCtrl'
    })

    .state('tab.events', {
      url: '/events',
      views: {
        'tab-events': {
          templateUrl: 'app/components/main/templates/tabs/events.html'
        }
      }
    })
    .state('tab.more', {
      url: '/more',
      views: {
        'tab-more': {
          templateUrl: 'app/components/main/templates/tabs/more.html'
        }
      }
    })
    .state('dt_tab', {
      url: '/directTransfer/tab',
      templateUrl: 'app/components/directTransfer/templates/tabs_dt.html',
      controller: 'tab_dtCtrl'
    })
    .state('dt_tab.location', {
      url: '/location',
      views: {
        'tab-location': {
          templateUrl: 'app/components/directTransfer/templates/tabs/location.html',
          controller: 'locationCtrl'
        }
      }
    })
    .state('pick_location_origin', {
      url: '/directTransfer/pick_location_origin',
      templateUrl: 'app/components/directTransfer/templates/pick_location_origin.html',
      controller: 'pickOriginCtrl'
    })
    .state('pick_location_destination', {
      url: '/directTransfer/pick_location_destination',
      templateUrl: 'app/components/directTransfer/templates/pick_location_destination.html',
      controller: 'pickDestinationCtrl'
    })
    .state('pick_voucher', {
      url: '/directTransfer/pick_voucher',
      templateUrl: 'app/components/directTransfer/templates/pick_voucher.html',
      controller: 'pickVoucherCtrl'
    })
    .state('dt_tab.carService', {
      url: '/carService',
      views: {
        'tab-service': {
          templateUrl: 'app/components/directTransfer/templates/tabs/carService.html',
          controller: 'carServiceCtrl'
        }
      }
    })
    .state('dt_tab.overview', {
      url: '/overview',
      views: {
        'tab-overview': {
          templateUrl: 'app/components/directTransfer/templates/tabs/overview.html',
          controller: 'overviewCtrl'
        }
      }
    });



  $urlRouterProvider.otherwise('/onboarding');

});

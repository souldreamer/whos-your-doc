app.run(function($ionicPlatform, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {

    // if (window.cordova && $cordovaKeyboard.isVisible) {
    //   $cordovaKeyboard.close();
    // }

    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      alert(JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
      .startInit("d6b0234f-353b-46a5-9f12-a1168e59764d")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    $cordovaStatusbar.overlaysWebView(true);
    $cordovaStatusBar.style(1); //Light
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

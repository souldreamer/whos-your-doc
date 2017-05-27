angular.module('whos_your_doc.controllers', [])

  .controller('tabsCtrl', function ($scope, $state, StorageService, $ionicPopup, $ionicSlideBoxDelegate) {
    //console.log(StorageService.getSession('auth_token').length);
    $scope.directTransfer = function () {
      $state.go('dt_tab.location');
    };

    $scope.terms = function () {
      $state.go('terms2');
    };

    $scope.about = function () {
      $state.go('about');
    };

    $scope.contact = function () {
      $state.go('contact');
    };

    $scope.account = function () {
      $state.go('account');
    };

    if (StorageService.getSession('auth_token').length != 0) {
      console.log('good');
      $scope.logout = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: 'LOG OUT',
          template: 'Are you sure you want to log out?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            StorageService.addSession('auth_token', "");
            $state.go('landingpage');
          } else {

          }
        });

      };
    } else {
      $state.go('landingpage');
    }

  })
  .controller('aboutCtrl', function ($scope, $state, StorageService, $ionicSlideBoxDelegate) {
    $scope.goBack = function () {
      $state.go('tab.more');
    }
  })
  .controller('termsCtrl2', function ($scope, $state, StorageService, $ionicSlideBoxDelegate) {
    $scope.goBack = function () {
      $state.go('tab.more');
    }
  })
  .controller('contactCtrl', function ($scope, $state, StorageService, $ionicSlideBoxDelegate) {
    $scope.goBack = function () {
      $state.go('tab.more');
    }
  })
  .controller('accountCtrl', function ($scope, $state, $http, StorageService, $ionicPopup, $ionicPlatform, $ionicLoading, $timeout, $ionicSlideBoxDelegate, DTransfer) {
    $scope.user = {};
    $scope.forms = {};
    $scope.password_error = "";
    $scope.goBack = function () {
      $state.go('tab.more');
    };
    $scope.cancel = function () {
      $scope.$watch('forms.userForm', function (form) {
        form.$setPristine();
        form.$setUntouched();
        $scope.user.firstName = "";
        $scope.user.lastName = "";
        $scope.user.email = "";
        $scope.user.mobile = "";
        $scope.user.password = "";
        $scope.user.password1 = "";
        $scope.user.password2 = "";
        $scope.user.companyName = "";
        $scope.user.cif = "";
        $scope.server_error = {};
      });
      $state.go('landingpage');
    };

    $scope.showAlert = function (title, message, callback) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function (res) {
        if (res) {
          if (callback) {
            callback();
          }
        }
      });
    };

    $scope.show = function () {
      $ionicLoading.show({
        template: '<ion-spinner icon="spiral"></ion-spinner> <h4 class="uppercase">Lodading data...</h4>'
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    };

    $scope.showSuccess = function () {
      $ionicLoading.show({
        template: '<i class="icon ion-checkmark"></i><h4 class="uppercase">Data successfully updated</h4>'
      })
    };

    $scope.hide = function () {
      $ionicLoading.hide();
    };

    var token = StorageService.getSession('auth_token');
    $scope.show();

    $scope.changeAccountInfo = function (user) {

      // var getFirstName = function (name) {
      //   var arr = name.split(' ');
      //   if (arr.length == 1) {
      //     return arr[0];
      //   }
      //   return arr.slice(0, -1).join(' ');
      // };
      //
      // var getLastName = function (name) {
      //   var arr = name.split(' ');
      //   if (arr.length == 1) {
      //     return " ";
      //   } else {
      //     return arr.slice(-1).join(' ');
      //   }
      // };
      $scope.show();
      console.log("token: ", token);
      $http.post(citylimoConfig.authAPI + "changeAccountInfo", {
        token: token,
        firstName: user.firstName,
        lastName: user.lastName || " ",
        email: user.email.toLowerCase(),
        password: user.password2 || "",
        old_password: user.password1,
        personalInformation: {
          __type: "CL\\User\\Entity\\User\\PersonalInformation",
          phone: user.mobile
        }
      })
        .then(function (response) {
          console.log("response: ", response);
          $scope.hide();
          $scope.showSuccess();
          $timeout(function () {
            $scope.hide();
            $scope.password_error = "";
            $scope.user.password = "";
            $scope.user.password1 = "";
            $scope.user.password2 = "";

          }, 1000);
          StorageService.addSession("auth_token", response.data.token);
          token = response.data.token;
        }, function (error) {



          console.log("sdfgdfg",error);

          if (error.data.message == "validation error")
            $scope.showAlert("Error", "Validation error: " + Object.keys(error.data.fields).toString());

          if (error.data.message == "Your password is invalid") {
            $scope.password_error = "Your password is incorrect";
            $scope.showAlert("Error", "Your password is incorrect");
            console.log($scope.password_error);
          }
          if (error.status == -1) {
            alert("There is no internet connection - please connect to a network");
          } else if (error.data.message == "Your token is invalid") {
            //to add error message here
            $scope.showAlert("Error", "invalid token", function () {
              StorageService.addSession("auth_token", "");
              $state.go('landingpage');
            });
          }

          $timeout(function () {
            $scope.hide();
            $scope.password_error = "";
            $scope.user.password = "";
            $scope.user.password1 = "";
            $scope.user.password2 = "";


          }, 1);


        })
    };

    var url = citylimoConfig.authAPI + '';
    $http.get(url + token)
      .then(function (response) {
        $timeout(function () {
          $scope.hide();

          console.log(response);

          $scope.user.firstName = response.data.firstName;
          $scope.user.lastName = response.data.lastName;
          $scope.user.email = response.data.email;
          // $scope.user.password = response.data.password;

          $scope.user.mobile = response.data.personalInformation.phone;
        }, 1);


      }, function (error) {
        $scope.hide();

        console.log(error);
        if (error.status == -1) {
          $scope.showAlert("Error", "There is no internet connection - please connect to a network")
        } else if (error.data.message == "Invalid token") {
          //to add error message here
          $scope.showAlert("Error", "Invalid token", function () {
            StorageService.addSession("auth_token", "");
            $state.go('landingpage');

          });
        }

      });


  })
  .controller('orderCtrl', function ($scope, $state, $http, StorageService, $ionicSlideBoxDelegate, $ionicPlatform, DTransfer, $ionicLoading, $ionicPopup, $timeout) {
    $ionicPlatform.ready(function () {
      $scope.orders = {};

      $scope.showAlert = function (title, message, callback) {
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: message
        });

        alertPopup.then(function (res) {
          if (res) {
            if (callback) {
              callback();
            }
          }
        });
      };

      $scope.show = function () {
        $ionicLoading.show({
          template: '<ion-spinner icon="spiral"></ion-spinner> <h4 class="uppercase">Loading orders...</h4>'
        });
      };
      $scope.hide = function () {
        $ionicLoading.hide();
      };

      var token = StorageService.getSession('auth_token');
      var authentification_code = 'bearer ' + token;
      // to add cors here

      $scope.show();
      $http.post(citylimoConfig.carAPI + 'getOrders', {}, {
        headers: {
          'citylimo-token': authentification_code
        }
      })
        .then(function (order_response) {
          $scope.hide();
          console.log(order_response);

          var aux_order = order_response.data;
          //aux_order.sort((a, b) => b.uuid - a.uuid);
          aux_order.sort(function (a, b) {
            return b.uniqueId - a.uniqueId
          });
          // console.log(aux_order);
          // var aux_order = aux_order.filter(function(item) {
          //   if(item.status == 'Achitat')
          //     return true;
          // });
          // console.log(aux_order);
          $scope.orders = aux_order;
        }, function (error) {
          $scope.hide();
          console.log(error);
          if (error.status == -1) {
            $scope.showAlert("Error", "There is no internet connection - please connect to a network.");

          } else if (error.data.message == "Invalid token") {
            $scope.showAlert("Error", "Your token is invalid.", function () {
              StorageService.addSession('auth_token', "");
              $state.go('landingpage');
            });

          } else {
            $scope.showAlert("Error", "Something went wrong", function () {
              StorageService.addSession('auth_token', "");
              $state.go('landingpage');
            });
          }
        });
      $scope.selectOrder = function (order) {
        $state.go('feedback', {orderId: order._id, userId: order.references.user.$id});
      };
    });

  })
  .controller('feedbackCtrl', function ($scope, DTransfer, $state, $timeout, $cordovaGeolocation, $http, $stateParams, $ionicPlatform, StorageService) {

    $('.centerText').on('input', function () {
      var h = this.offsetHeight;

      $(this).css({   //clear current padding and height so we can use scrollHeight below
        paddingTop: 0,
        height: 0
      });

      $(this).css({
        paddingTop: 8,
        height: 50
      });

    }).trigger('input').focus();
    $scope.showAlert = function (title, message, callback) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function (res) {
        if (res) {
          if (callback) {
            callback();
          }
        }
      });
    };

    $scope.back = function () {
      $state.go('tab.orders');
    };
    $scope.cancel = function () {
      $state.go('tab.home');
    };

    $scope.carName = {
      suv: "bmw x5",
      premium: "bmw 5 series",
      business: "bmw 3 series",
      standard: "mercedes benz c class",
      group: "mercedes v class",
      eco: "bmw i3"
    };
    $scope.maxBaggages = {
      suv: 3,
      premium: 2,
      business: 2,
      standard: 2,
      group: 5,
      eco: 1
    };
    $scope.chars = 60;
    $scope.transfer = {};
    $scope.feedback = {};
    $scope.info = {};
    var userId = $stateParams.userId;
    var orderId = $stateParams.orderId;

    $scope.$watch('feedback.references.booking.destination ', function (item) {
      console.log(item);
      console.log("element", $('textarea').width());
      if ($('textarea').width() >= 300) {
        $scope.chars = 44;
      } else {
        $scope.chars = 34;
      }

    });

    $http.post(citylimoConfig.carAPI + 'getOrder', {orderId: orderId, userId: userId}, {
      headers: {
        'citylimo-token': 'bearer ' + StorageService.getSession('auth_token')
      }
    })
      .then(function (response) {
        $scope.feedback = response.data;
        $ionicPlatform.ready(initialize);

      }.bind(this), function (error) {
        console.log(error);
        if (error.status == -1) {
          $scope.showAlert("Error", "There is no internet connection - please connect to a network.");

        } else if (error.data.message == "Invalid token") {
          $scope.showAlert("Error", "Your token is invalid.")
          StorageService.addSession('auth_token', "");
        } else {
          $scope.showAlert("Error", "Something went wrong", function () {
            StorageService.addSession('auth_token', "");
            $state.go('landingpage');
          });
        }
      });


    // MAP
    function initialize() {
      var myLatLng = {lat: 45.7494444, lng: 21.2272222};
      var origin_place_id = null;
      var destination_place_id = null;
      var travel_mode = 'DRIVING';

      var destination_coords = null;
      var origin_coords = null;

      var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: myLatLng,
        zoom: 13,
        disableDefaultUI: true
      });


      var rendererOptions = {
        map: map
        , suppressMarkers: true
        , preserveViewport: false
        , polylineOptions: {

          strokeColor: '#75baff'
        }
      };

      var lineSymbol = {
        path: 'M 0, -1 0, 1',
        strokeOpacity: 50,
        scale: 4,
        strokeColor: '#75baff'
      };

      var current_location_marker = new google.maps.Marker({
        // position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: 'img/pinpoint.png'
      });

      var origin_marker = new google.maps.Marker({
        map: map,
        icon: new google.maps.MarkerImage('img/to_pinpoint.png')
      });

      var destination_marker = new google.maps.Marker({
        map: map,
        icon: 'img/from_pinpoint.png'
      });

      var posOptions = {timeout: 10000, enableHighAccuracy: true};

      var service = new google.maps.places.AutocompleteService();
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
      var geocoder = new google.maps.Geocoder();
      var ok = 0;

      $scope.originId = '';
      $scope.destinationId = '';

      $scope.$watch('feedback.references.booking.origin', function () {
        var displaySuggestions = function (predictions, status) {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            // alert(status);
            return;
          }
          console.log("predictions", predictions);

          $scope.originId = predictions[0].place_id;

          console.log($scope.originId);


          geocoder.geocode({'placeId': $scope.originId}, function (resultss, status) {
            current_location_marker.setVisible(false);
            console.log($scope.originId);
            if (status == 'OK') {
              var results = resultss[0];
              console.log("geocoder orig: ", results);
              $scope.transfer.origin = results;

              origin_coords = {lat: results.geometry.location.lat(), lng: results.geometry.location.lng()};
              if (results.geometry.viewport) {
                map.fitBounds(results.geometry.viewport);
              }
              else {
                map.setCenter(results.geometry.location);
                map.setZoom(15);
              }
              origin_marker.setPlace({
                placeId: results.place_id,
                location: results.geometry.location
              });
              // console.log(location);
              //map.fitBounds(results.geometry.viewport);
              //expandViewportToFitPlace(map, results);
              route(travel_mode, directionsService, directionsDisplay);
            }
          });


        };

        //var autocompletionRequest = new google.maps.places.AutocompletionRequest({input: $scope.transfer.origin});
        if ($scope.feedback.references.booking.origin !== '') {
          service.getPlacePredictions({

            input: $scope.feedback.references.booking.origin.split(',').slice(0, 2).toString().trim(),

          }, displaySuggestions);

        }

      });
      $scope.$watch('feedback.references.booking.destination', function () {
        var displaySuggestions = function (predictions, status) {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            // alert(status);
            return;
          }
          console.log("predictions", predictions);

          $scope.destinationId = predictions[0].place_id;

          console.log($scope.destinationId);

          geocoder.geocode({'placeId': $scope.destinationId}, function (resultss, status) {
            current_location_marker.setVisible(false);
            console.log($scope.destinationId);
            if (status == 'OK') {
              var results = resultss[0];
              console.log("geocoder dest: ", results);
              $scope.transfer.destination = results;
              destination_coords = {lat: results.geometry.location.lat(), lng: results.geometry.location.lng()};
              if (results.geometry.viewport) {
                map.fitBounds(results.geometry.viewport);
              }
              else {
                map.setCenter(results.geometry.location);
                map.setZoom(15);
              }
              destination_marker.setPlace({
                placeId: results.place_id,
                location: results.geometry.location
              });
              // console.log(location);
              //map.fitBounds(results.geometry.viewport);
              //expandViewportToFitPlace(map, results);
              route(travel_mode, directionsService, directionsDisplay);
            }
          });


        };

        //var autocompletionRequest = new google.maps.places.AutocompletionRequest({input: $scope.transfer.origin});
        if ($scope.feedback.references.booking.destination !== '') {
          service.getPlacePredictions({

            input: $scope.feedback.references.booking.destination.split(',').slice(0, 2).toString().trim(),

          }, displaySuggestions);

        }

      });

      function route(travel_mode, directionsService, directionsDisplay) {

        if (!$scope.originId || !$scope.destinationId) {
          console.log("route par: ", $scope.originId, $scope.destinationId);
          return;
        }
        else if (ok == 0) {
          ok = 1;
          console.log("route func: ", $scope.originId, $scope.destinationId);
          directionsService.route({
            origin: {
              'placeId': $scope.originId
            }
            , destination: {
              'placeId': $scope.destinationId
            }
            , travelMode: travel_mode
          }, function (response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);


              var latLng_start_loc = {
                lat: response.routes[0].legs[0].start_location.lat(),
                lng: response.routes[0].legs[0].start_location.lng()
              };
              var latLng_end_loc = {
                lat: response.routes[0].legs[0].end_location.lat(),
                lng: response.routes[0].legs[0].end_location.lng()
              };

              console.log("f ", response);

              // DTransfer.setData('distance', response.routes[0].legs[0].distance.value / 1000); // in km
              // DTransfer.setData('duration', Math.round(response.routes[0].legs[0].duration.value / 60)); // in minutes

              $scope.info.distance = response.routes[0].legs[0].distance.value / 1000;
              $scope.info.duration = Math.round(response.routes[0].legs[0].duration.value / 60);

              $scope.$digest();


              if (true) {
                var line1 = new google.maps.Polyline({
                  path: [
                    latLng_end_loc,
                    destination_coords
                  ],
                  strikeOpacity: 0,
                  icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '25px'
                  }],
                  map: map
                });
                var line2 = new google.maps.Polyline({
                  path: [
                    latLng_start_loc,
                    origin_coords
                  ],
                  strikeOpacity: 0,
                  icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '25px'
                  }],
                  map: map
                });
              }

            }
            else {
              // window.alert('Directions request failed due to ' + status);
              $scope.showAlert("Error", 'Directions request failed due to ' + status);
            }
          });
        }
      }

    }


  })
;

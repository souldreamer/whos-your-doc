angular.module('whos_your_doc.controllers')

  .controller('tab_dtCtrl', function ($scope, $state, $ionicSlideBoxDelegate, $ionicPlatform, $cordovaDatePicker) {
    /* ON CLICK ACTIONS */
    $scope.backLocation = function () {
      $state.go('dt_tab.location')
    };
    $scope.backService = function () {
      $state.go('dt_tab.carService')
    };
    $scope.cancel = function () {
      $state.go('tab.home');
    };
    $scope.pickOriginLocation = function () {
      $state.go("pick_location_origin");
    };
    $scope.pickDestinationLocation = function () {
      $state.go("pick_location_destination");
    };
    $scope.pickVoucherCode = function () {
      $state.go('pick_voucher');
    };
    $scope.continue = function () {
      $state.go("dt_tab.carService");
      $scope.visitedLocationTab = true;
    };
    $scope.payUp = function () {
      $state.go("dt_tab.payment");
      $scope.visitedLocationTab = true;
    };
  })
  .controller('locationCtrl', function ($scope, DTransfer, StorageService, $state, $ionicSlideBoxDelegate, $timeout, $ionicPlatform, $ionicPopup, $cordovaDatePicker, $cordovaGeolocation) {
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

    });
      //.trigger('input').focus();
    $scope.$watch('transfer.origin.place_title', function (item) {
      if ($('textarea').width() >= 300) {
        $scope.chars = 44;
      } else {
        $scope.chars = 34;
      }

    });
    /* VERIFY IS LOCATION IS ENABLED */
    if (window.cordova) {
      cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {

        if (!enabled) {
          alert("Location is disabled. Press ok to enable it from the settings bar.");
          cordova.plugins.diagnostic.switchToLocationSettings();
        }
      }, function (error) {
        $scope.showAlert("Error", "The following error occurred: " + error);

      });
    }
    /* VARIABLES USED FOR CHOOSING DIFFERENT PICKERS */
    $scope.transfer = {};
    $scope.lat = "";
    $scope.lng = "";
    $scope.close = function () {
      DTransfer.setData('origin', "");
      DTransfer.setData('destination', "");
      DTransfer.setData('last_input_changed', 0);
      DTransfer.setData('date', "--:-- dd/MM/yy");
      DTransfer.setData('passengers_number', "1");
      DTransfer.setData('baggages_number', "0");
      DTransfer.setData('voucher_code', "");
      DTransfer.setData('voucher_code', "");
      DTransfer.setData('selected_data', 0);
      DTransfer.setData('baggages_number', "0");
      DTransfer.setData('distance', 0);
      DTransfer.setData('duration', "");
      DTransfer.setData('car_name', "");
      DTransfer.setData('car_class', "");
      DTransfer.setData('car_numberOfPassengers', "");
      DTransfer.setData('total_price', 0);
      DTransfer.setData('before_voucher_price', 0);
      DTransfer.setData('first_map_center', 0);

      $state.go('tab.home');
    };
    $scope.datePick = function () {
      var options = {
        title: "Select a date and time",
        date: new Date(),
        mode: 'datetime', // or 'time'
        minDate: new Date() - 10000,
        allowOldDates: false,
        allowFutureDates: true,
        minuteInterval: 5,
        androidTheme: 4,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F5533D',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#F5533D'
      };
      $ionicPlatform.ready(function () {
        $cordovaDatePicker.show(options).then(function (date) {
          if (date == undefined) {
            DTransfer.setData('date', "--:-- dd/MM/yy");
            $scope.startDateTime = "--:-- dd/MM/yy";
          } else {
            DTransfer.setData('date', date);
            $scope.startDateTime = date;
          }
          if ($scope.startDateTime != "--:-- dd/MM/yy") {
            DTransfer.setData('selected_date', 1);
            $scope.selected_date = 1;
          } else {
            DTransfer.setData('selected_date', 0);
            $scope.selected_date = 0;
          }
        });
      });


      function onError(error) { // Android only
        alert('Error: ' + error);
      }
    };
    /* CHOOSE NUMBER OF PASSENGERS */
    $scope.numberPickPassengers = function () {
      var config = {
        title: "Select passengers",
        items: [
          {text: "1", value: "1"},
          {text: "2", value: "2"},
          {text: "3", value: "3"},
          {text: "4", value: "4"},
          {text: "5", value: "5"},
          {text: "6", value: "6"},
          {text: "7", value: "7"},
          {text: "8", value: "8"},
          {text: "9", value: "9"}
        ],
        selectedValue: $scope.passengers_number,
        doneButtonLabel: "Done",
        doneButtonColor: '#F5533D',
        cancelButtonLabel: "Cancel",
        cancelButtonColor: '#F5533D'
      };
      $ionicPlatform.ready(function () {
          window.plugins.listpicker.showPicker(config, function (item) {
            DTransfer.setData('passengers_number', item);
            $scope.passengers_number = item;
            console.log(item, typeof(item));
            $scope.$digest();
          });
        },
        function () {
          alert('Passengers number is required')
        });
    };
    /* CHOOSE NUMBER OF BAGGAGES */
    $scope.numberPickBaggages = function () {
      var config = {
        title: "Select baggages",
        items: [
          {text: "0", value: "0"},
          {text: "1", value: "1"},
          {text: "2", value: "2"},
          {text: "3", value: "3"},
          {text: "4", value: "4"},
          {text: "5", value: "5"},
          {text: "6", value: "6"},
          {text: "7", value: "7"},
          {text: "8", value: "8"},
          {text: "9", value: "9"}
        ],
        selectedValue: $scope.baggages_number,
        doneButtonLabel: "Done",
        doneButtonColor: '#F5533D',
        cancelButtonLabel: "Cancel",
        cancelButtonColor: '#F5533D'
      };
      $ionicPlatform.ready(function () {
        window.plugins.listpicker.showPicker(config, function (item) {
          DTransfer.setData('baggages_number', item);
          $scope.baggages_number = item;
          $scope.$digest();
        });
      })
    };
    /* SCOPE VARIABLES FOR FRONTEND */
    $scope.transfer.origin = DTransfer.getData('origin');
    $scope.transfer.destination = DTransfer.getData('destination');
    $scope.transfer.voucher_code = DTransfer.getData('voucher_code');
    $scope.passengers_number = DTransfer.getData('passengers_number');
    $scope.startDateTime = DTransfer.getData('date');
    $scope.baggages_number = DTransfer.getData('baggages_number');
    if ($scope.startDateTime == "--:-- dd/MM/yy" || $scope.startDateTime == "") {
      DTransfer.setData('selected_date', 0);
      $scope.selected_date = DTransfer.getData('selected_date');
    }


    if ($scope.transfer.origin && $scope.transfer.destination && $scope.transfer.origin.place_title.length > 0 && $scope.transfer.destination.place_title.length > 0) {

      if (!(($scope.transfer.origin.place_title.split(',').slice(1).toString().search(/Timiș/i) != -1 ||  $scope.transfer.origin.place_title.split(',').slice(1).toString().search(/Cluj/i) != -1 || $scope.transfer.origin.place_title.split(',').slice(1).toString().search(/Bucharest/i) != -1
        || $scope.transfer.origin.place_title.split(',')[0].toString().search(/Bucharest/i) != -1 || $scope.transfer.origin.place_title.split(',').slice(1).toString().search(/Cluj/i) != -1 || $scope.transfer.origin.place_title.split(',').slice(1).toString().search(/Ilfov/i) != -1) || (
        $scope.transfer.destination.place_title.split(',').slice(1).toString().search(/Timiș/i) != -1 || $scope.transfer.destination.place_title.split(',').slice(1).toString().search(/Cluj/i) != -1 || $scope.transfer.destination.place_title.split(',').slice(1).toString().search(/Bucharest/i) != -1
        || $scope.transfer.destination.place_title.split(',').slice(1).toString().search(/Cluj/i) != -1) || $scope.transfer.destination.place_title.split(',')[0].toString().search(/Bucharest/i) != -1 || $scope.transfer.destination.place_title.split(',').slice(1).toString().search(/Ilfov/i) != -1)

      ) {
        $scope.showAlert("Notice", "Currently, Who's your doc? doesn't provide services at this location. We are in Timisoara, Bucharest and Cluj", function() {

          DTransfer.setData('origin', "");
          DTransfer.setData('destination', "");
          $scope.transfer.origin = "";
          $scope.transfer.destination = "";
          $state.go('dt_transfer.location');
        });
      }
    }

    /* GOOGLE MAPS INITIALIZE FUNCTION */
    function initialize() {

      /* VARIABLES FOR THE TRAVEL MODE, ORIGIN PLACE AND DESTINATION PLACE */
      var origin_place_id = null;
      var destination_place_id = null;
      var travel_mode = 'DRIVING';
      var destination_coords = null;
      var origin_coords = null;
      /* MAP LONG AND LAT DEFINED IN TM */
      var myLatLng = {lat: 45.7494444, lng: 21.2272222};
      /* MAP STYLE */
      var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: myLatLng,
        zoom: 13,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false
      });
      var current_location_marker = new google.maps.Marker({
        map: map,
        icon: 'img/pinpoint.png'
      });
      current_location_marker.setVisible(false);
      /* PIN MARKER ON CURRENT LOCATION */
      var posOptions = {timeout: 10000, enableHighAccuracy: true};
      var current_location_marker = new google.maps.Marker({
        map: map,
        icon: 'img/pinpoint.png'
      });
      if (DTransfer.getData('first_map_center') == 0) {
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $scope.lat = lat;
            $scope.lng = lng;
            console.log(lat, lng);
            map.setCenter(new google.maps.LatLng(lat, lng));

            $timeout(function () {
              current_location_marker.setPosition({lat, lng});
              current_location_marker.setVisible(true);
              DTransfer.setData('first_map_center', 1);
            }, 1000);
          }, function (err) {
          });
      }
      /* RENDER OPTIONS FOR MAP ROUTE */
      var directionsService = new google.maps.DirectionsService;
      var rendererOptions = {
        map: map,
        suppressMarkers: true,
        preserveViewport: false
      };
      var lineSymbol = {
        path: 'M 0, -1 0, 1',
        strokeOpacity: 50,
        scale: 4,
        strokeColor: '#75baff'
      };
      /* ORIGIN PLACE AND DESTINATION PLACE */
      var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
      var geocoder = new google.maps.Geocoder();
      var origin_marker = new google.maps.Marker({
        map: map,
        icon: new google.maps.MarkerImage('img/to_pinpoint.png')
      });
      var destination_marker = new google.maps.Marker({
        map: map,
        icon: 'img/from_pinpoint.png'
      });
      var ok = 0;
      $scope.$watch('transfer.origin.place_title', function () {
        console.log('origin ');
        if ($scope.transfer.origin.place_title == $scope.transfer.destination.place_title && DTransfer.getData('last_input_changed') == 1) {
          $scope.transfer.destination = "";
          DTransfer.setData('destination', "");
        }

        geocoder.geocode({'placeId': $scope.transfer.origin.place_id}, function (results, status) {
          current_location_marker.setVisible(false);
          if (status == 'OK') {
            var results = results[0];

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
            route(travel_mode, directionsService, directionsDisplay);
          }
        });
      });
      $scope.$watch('transfer.destination.place_title', function () {
        console.log(DTransfer.getData('last_input_changed'));
        if ($scope.transfer.origin.place_title == $scope.transfer.destination.place_title && DTransfer.getData('last_input_changed') == 2) {
          $scope.transfer.origin = "";
          DTransfer.setData('origin', "");
        }
        geocoder.geocode({'placeId': $scope.transfer.destination.place_id}, function (results, status) {
          current_location_marker.setVisible(false);
          if (status == 'OK') {
            console.log("results", results);
            var results = results[0];


            // destination_coords = {lat: results.geometry.viewport.f.b, lng: results.geometry.viewport.b.b};
            destination_coords = {lat: results.geometry.location.lat(), lng: results.geometry.location.lng()};
            if (results.geometry.viewport) {
              map.fitBounds(results.geometry.viewport);
              console.log("fitBounds");
            }
            else {
              map.setCenter(results.geometry.location);
              map.setZoom(15);
              console.log("setCenter");
            }
            destination_marker.setPlace({
              placeId: results.place_id,
              location: results.geometry.location
            });
            console.log(location);
            //map.fitBounds(results.geometry.viewport);
            //expandViewportToFitPlace(map, results);
            var destination_place_id = $scope.transfer.destination.place_id;
            route(travel_mode, directionsService, directionsDisplay);
          }
        });
      });
      /* FIT MAP TO SIZE */
      function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        }
        else {
          map.setCenter(place.geometry.location);
          map.setZoom(10);
        }
      }

      /* CREATE THE ROUTE */
      function route(travel_mode, directionsService, directionsDisplay) {
        console.log($scope.transfer.origin.place_id, $scope.transfer.destination.place_id);
        if (!$scope.transfer.origin.place_id || !$scope.transfer.destination.place_id) {
          return;
        }
        else if (ok == 0) {
          ok = 1;
          directionsService.route({
            origin: {
              'placeId': $scope.transfer.origin.place_id
            }
            , destination: {
              'placeId': $scope.transfer.destination.place_id
            }
            , travelMode: travel_mode
          }, function (response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
              // var center;  // a latLng
              // var offsetX = 1; // move center one quarter map width left
              // var offsetY = 10; // move center one quarter map height down
              // var span = map.getBounds().toSpan(); // a latLng - # of deg map spans
              // var newCenter = {
              //   lat: center.lat() + span.lat()*offsetY,
              //   lng: center.lng() + span.lng()*offsetX
              // };


              var latLng_start_loc = {
                lat: response.routes[0].legs[0].start_location.lat(),
                lng: response.routes[0].legs[0].start_location.lng()
              };
              var latLng_end_loc = {
                lat: response.routes[0].legs[0].end_location.lat(),
                lng: response.routes[0].legs[0].end_location.lng()
              };

              console.log("f ", response);

              DTransfer.setData('distance', response.routes[0].legs[0].distance.value / 1000); // in km
              DTransfer.setData('duration', Math.round(response.routes[0].legs[0].duration.value / 60)); // in minutes

              $scope.info_distance = response.routes[0].legs[0].distance.value / 1000;
              $scope.info_duration = Math.round(response.routes[0].legs[0].duration.value / 60);

              console.log('travel info: ', $scope.info_distance, $scope.info_duration);

              var destination_display_direction = {
                lat: response.routes[0].bounds.f.b,
                lng: response.routes[0].bounds.b.f
              };
              // console.log("response: ",  {lat: response.routes[0].bounds.f.b, lng: response.routes[0].bounds.b.f}, destination_coords);
              // console.log(Math.abs(destination_display_direction.lat - destination_coords.lat));
              //if(destination_display_direction.lat - destination_coords.lat >0.00099 && destination_display_direction.lng - destination_coords.lng >0.00099) {

              console.log(response.destinationAddress);
              // if($scope.transfer.destination.place_title.toLowerCase().indexOf("aeroport")!= -1) {
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

              var origin1 = $scope.transfer.origin.place_title;
              var destinationA = $scope.transfer.destination.place_title;
              console.log("orig ", origin1);
              console.log("dest ", destinationA);

              // var service = new google.maps.DistanceMatrixService();
              // service.getDistanceMatrix({
              //   origins: [origin1]
              //   , destinations: [destinationA]
              //   , travelMode: 'DRIVING'
              //   , unitSystem: google.maps.UnitSystem.METRIC
              // }, callback);
              // function callback(response, status) {
              //   console.log("directionMatrix", response);
              //   if (status == 'OK') {
              //     origins = response.originAddresses[0];
              //     destinations = response.destinationAddresses[0];
              //     results = response.rows[0].elements[0];
              //
              //     console.log("results ", response, status);
              //     //
              //     //
              //     // DTransfer.setData('distance', results.distance.value / 1000); // in km
              //     // DTransfer.setData('duration', Math.round(results.duration.value / 60)); // in minutes
              //     // $scope.info_distance = results.distance.value / 1000;
              //     // $scope.info_duration = Math.round(results.duration.value / 60);
              //
              //   }
              // }
            }
            else {
              $scope.showAlert("Error", 'Directions request failed due to ' + status);
            }
          });
        }
      }
    }

    $ionicPlatform.ready(initialize);
  })
  .controller('pickOriginCtrl', function ($scope, DTransfer, StorageService, $ionicPlatform, $state, $http, $timeout) {
    $scope.transfer = {
      origin: ""
    };
    $scope.places = {};
    $scope.reset = function () {
      $scope.transfer.origin = "";
      DTransfer.setData('origin', "");
      $scope.predictions = [];
    };
    $scope.cancel = function () {
      $state.go('dt_tab.location');
    };
    $scope.getLocation = function (prediction) {
      return prediction.description.split(',')[0];
    };
    $scope.getDescription = function (prediction) {
      return prediction.description.split(',').slice(1).join();
    };
    $scope.getplaceID = function (prediction) {
      return prediction.place_id;
    };
    var addOriginUnique = function (location) {
      var isUnique = true;
      StorageService.getRecent('origins').forEach(function (item) {

        if (item.place_id == location.place_id) {
          StorageService.removeRecent('origins', item);
        }
      });

      return isUnique;
    };
    $scope.saveLocation = function (place) {
      DTransfer.setData('origin', {place_id: place.place_id, place_title: place.location + "," + place.description});
      if (addOriginUnique(place)) {
        StorageService.addRecent('origins', {
          place_id: place.place_id,
          location: place.location,
          description: place.description
        });
      }
      DTransfer.setData("last_input_changed", 1);
      $state.go('dt_tab.location');
    };
    var service = new google.maps.places.AutocompleteService();
    $scope.getPrediction = function () {
      var displaySuggestions = function (predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        var predictions_copy = [];
        predictions.forEach(function (prediction) {
          predictions_copy.push({
            location: $scope.getLocation(prediction),
            description: $scope.getDescription(prediction),
            place_id: $scope.getplaceID(prediction)
          });
        });
        $scope.predictions = predictions_copy;
        $scope.$digest();
      };

      //var autocompletionRequest = new google.maps.places.AutocompletionRequest({input: $scope.transfer.origin});
      if ($scope.transfer.origin !== '') {


        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.origin,

          componentRestrictions: {country: "bg"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);


        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.origin,

          componentRestrictions: {country: "ro"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.origin,

          componentRestrictions: {country: "md"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.origin,

          componentRestrictions: {country: "hu"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.origin,

          componentRestrictions: {country: "rs"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.origin,

          componentRestrictions: {country: "ua"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);
      } else {
        // add recent places
        $scope.predictions = []
      }
    };
    $scope.transfer.origin = DTransfer.getData('origin').place_title || "";
    if ($scope.transfer.origin != "")
      $scope.getPrediction();
    $scope.category = "recents";
    $scope.$watch('transfer.origin', function () {
      if ($scope.transfer.origin.length) {
        $scope.category = "best matches";
      } else {
        $scope.category = "recents";
        $scope.predictions = StorageService.getRecent('origins');

      }
    });
  })
  .controller('pickDestinationCtrl', function ($scope, DTransfer, StorageService, $ionicPlatform, $state, $http, $timeout) {
    $scope.transfer = {
      destination: ""
    };
    $scope.places = {};
    $scope.reset = function () {
      $scope.transfer.destination = "";
      DTransfer.setData('destination', "");
      $scope.predictions = [];
    };

    $scope.cancel = function () {
      $state.go('dt_tab.location');
    };

    $scope.getLocation = function (prediction) {
      return prediction.description.split(',')[0];
    };

    $scope.getDescription = function (prediction) {
      return prediction.description.split(',').slice(1).join();
    };
    $scope.getplaceID = function (prediction) {
      return prediction.place_id;
    };
    var addOriginUnique = function (location) {
      var isUnique = true;
      StorageService.getRecent('destinations').forEach(function (item) {

        if (item.place_id == location.place_id) {
          StorageService.removeRecent('destinations', item);
        }
      });

      return isUnique;
    };
    $scope.saveLocation = function (place) {
      DTransfer.setData('destination', {
        place_id: place.place_id,
        place_title: place.location + "," + place.description
      });
      if (addOriginUnique(place)) {
        StorageService.addRecent('destinations', {
          place_id: place.place_id,
          location: place.location,
          description: place.description
        });
      }
      DTransfer.setData("last_input_changed", 2);
      $state.go('dt_tab.location');
    };

    var service = new google.maps.places.AutocompleteService();
    $scope.getPrediction = function () {
      var displaySuggestions = function (predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        var predictions_copy = [];
        predictions.forEach(function (prediction) {
          predictions_copy.push({
            location: $scope.getLocation(prediction),
            description: $scope.getDescription(prediction),
            place_id: $scope.getplaceID(prediction)
          });
        });
        $scope.predictions = predictions_copy;
        $scope.$digest();
      };
      if ($scope.transfer.destination !== '') {


        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.destination,

          componentRestrictions: {country: "bg"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);


        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.destination,

          componentRestrictions: {country: "ro"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.destination,

          componentRestrictions: {country: "md"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.destination,

          componentRestrictions: {country: "hu"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.destination,

          componentRestrictions: {country: "rs"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);

        service.getPlacePredictions({
          // service.getQueryPredictions({
          // bounds: new google.maps.LatLngBounds({lat: 45.7489, lng: 45.7489}, {lat: 40, lng:30}),
          // location: new google.maps.LatLng({lat: 45.7489, lng: 45.7489}),
          // radius: 500000,
          // language: "RO",
          input: $scope.transfer.destination,

          componentRestrictions: {country: "ua"},
          // offset: 3,
          location: new google.maps.LatLng({lat: 45.7488716, lng: 21.20867929999997}),
          radius: 80000
        }, displaySuggestions);


      } else {
        $scope.predictions = []
      }
    };
    $scope.transfer.destination = DTransfer.getData('destination').place_title || "";

    console.log("orig", DTransfer.getData('destination').place_title);
    if ($scope.transfer.destination != "")
      $scope.getPrediction();

    $scope.category = "recents";
    console.log($scope.transfer.destination);
    $scope.$watch('transfer.destination', function () {
      if ($scope.transfer.destination.length) {
        $scope.category = "best matches";
      } else {
        $scope.category = "recents";
        $scope.predictions = StorageService.getRecent('destinations');

      }
    });

  })
  .controller('pickVoucherCtrl', function ($scope, $state, $http, $ionicPopup, $timeout, DTransfer, StorageService) {

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

    $scope.transfer = {};
    $scope.server_error = "";
    $scope.reset = function () {
      $scope.transfer.voucher_code = "";
      DTransfer.setData('voucher_code', "");
    };

    $scope.back = function () {
      $state.go('dt_tab.location');
      $scope.server_error = "";
    };
    $scope.transfer.voucher_code = DTransfer.getData('voucher_code');

    $scope.$watch('transfer.voucher_code', function () {
      $scope.server_error = "";
    });
    $scope.applyVoucher = function () {
      console.log($scope.transfer.voucher_code);
      // alert($scope.transfer.voucher_code);
      var authentification_code = 'bearer ' + StorageService.getSession('auth_token');
      console.log(authentification_code);
      $http.post(citylimoConfig.carAPI + 'validateVoucher', {
        code: $scope.transfer.voucher_code,
      }, {
        headers: {}
      }).then(function (response) {
        console.log(response);
        if (response.data.message == true) {
          $scope.server_error = "";
          $timeout(function() {
            $state.go('dt_tab.location');
          },100);
        }

      }, function (error) {
        DTransfer.setData('voucher_code', "");
        if (error.status == -1) {
          // alert("There is no internet connection - please connect to a network");
          $scope.showAlert("Error", "There is no internet connection - please connect to a network", function () {
            $state.go('tab.home');
          });


        } else if (error.data.message) {
          $scope.server_error = error.data.message;
          $scope.showAlert($scope.server_error);
        }
        else {
          StorageService.addSession('auth_token', "");
          DTransfer.setData('origin', "");
          DTransfer.setData('destination', "");
          DTransfer.setData('last_input_changed', 0);
          DTransfer.setData('date', "--:-- dd/MM/yy");
          DTransfer.setData('passengers_number', "1");
          DTransfer.setData('baggages_number', "0");
          DTransfer.setData('voucher_code', "");
          DTransfer.setData('voucher_code', "");
          DTransfer.setData('selected_data', 0);
          DTransfer.setData('baggages_number', "0");
          DTransfer.setData('distance', 0);
          DTransfer.setData('duration', "");
          DTransfer.setData('car_name', "");
          DTransfer.setData('car_class', "");
          DTransfer.setData('car_numberOfPassengers', "");
          DTransfer.setData('total_price', 0);
          DTransfer.setData('before_voucher_price', 0);
          // DTransfer.setData('first_map_center', 0);

          $scope.showAlert("Error", "Something went wrong", function () {
            $state.go('landingpage');
          });
          $state.go('landingpage');
        }

      });

      DTransfer.setData('voucher_code', $scope.transfer.voucher_code.toUpperCase());

    };


  })
  .controller('carServiceCtrl', function ($scope, $state, $http, StorageService, DTransfer, $ionicPopup, $ionicLoading) {
    $scope.cars = [];
    $scope.transfer = {};
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
        template: '<ion-spinner icon="spiral"></ion-spinner> <h4 class="uppercase">Loading cars...</h4>'
      });
    };
    $scope.hide = function () {
      $ionicLoading.hide();
    };

    $scope.close = function () {
      DTransfer.setData('origin', "");
      DTransfer.setData('destination', "");
      DTransfer.setData('last_input_changed', 0);
      DTransfer.setData('date', "--:-- dd/MM/yy");
      DTransfer.setData('passengers_number', "1");
      DTransfer.setData('baggages_number', "0");
      DTransfer.setData('voucher_code', "");
      DTransfer.setData('voucher_code', "");
      DTransfer.setData('selected_data', 0);
      DTransfer.setData('baggages_number', "0");
      DTransfer.setData('distance', 0);
      DTransfer.setData('duration', "");
      DTransfer.setData('car_name', "");
      DTransfer.setData('car_class', "");
      DTransfer.setData('car_numberOfPassengers', "");
      DTransfer.setData('total_price', 0);
      DTransfer.setData('before_voucher_price', 0);
      DTransfer.setData('first_map_center', 0);

      $state.go('tab.home');
    };


    var origin = DTransfer.getData('origin');
    var destination = DTransfer.getData('destination');

    //date in UTC format
    // var date = new Date(DTransfer.getData('date').getTime() - DTransfer.getData('date').getTime().getTimezoneOffset() * 60000).toISOString();
    var date = DTransfer.getData('date').toISOString();
    var passengers_number = Number(DTransfer.getData('passengers_number'));
    var distance = DTransfer.getData('distance');
    var duration = DTransfer.getData('duration');


    $scope.transfer.voucher_code = DTransfer.getData('voucher_code');
    console.log("qqq", origin, destination, passengers_number, distance, duration, date);

    var carName = {
      suv: "bmw x5",
      premium: "bmw 5 series",
      business: "bmw 3 series",
      standard: "mercedes benz c class",
      group: "mercedes v class",
      eco: "bmw i3"
    };
    var maxBaggages = {
      suv: 3,
      premium: 2,
      business: 2,
      standard: 2,
      group: 5,
      eco: 1
    };
    $scope.show();
    var authentification_code = 'bearer ' + StorageService.getSession('auth_token');
    console.log(authentification_code);


    $http.get('http://www.infovalutar.ro/bnr/azi/eur')
      .then(function (response) {
        var eurCurrency = parseFloat(response.data);

        localStorage.setItem('eurCurrency', eurCurrency);

        setCarsInfo(eurCurrency);
    }).catch(function (err) {
        var eurCurrency;

        if (localStorage.getItem('eurCurrency')) {
          eurCurrency = localStorage.getItem('eurCurrency');
        } else {
          // Something went wrong with the call and we have no prev value; Must default to something
          eurCurrency = 4.50;
          localStorage.setItem('eurCurrency', eurCurrency);
        }

        setCarsInfo(eurCurrency);
    });



    function setCarsInfo(eurCurrency) {
      $http.post(citylimoConfig.carAPI + 'getCarCombinations', {
        distance: Number(distance),
        duration: Number(duration),
        nrOfPassengers: passengers_number,
        code: DTransfer.getData('voucher_code'),
        timestamp: date
      }, {
        headers: {
          'citylimo-token': authentification_code
        }
      })
        .then(function (response) {
          $scope.hide();
          var data = response.data;


          data.forEach(function (item, index) {
            console.log(item.price * eurCurrency);

            $scope.cars.push({
              name: carName[item.car.type],
              max_baggages: maxBaggages[item.car.type],
              info: item.car,
              before_voucher_price: item.before_voucher_price || 0,
              price: item.price,
              roPrice: (item.price * eurCurrency).toFixed(2)
            });
            if (item.before_voucher_price)
              console.log(index, item);
          });

        }, function (error) {
          $scope.hide();
          DTransfer.setData('origin', "");
          DTransfer.setData('destination', "");
          DTransfer.setData('last_input_changed', 0);
          DTransfer.setData('date', "--:-- dd/MM/yy");
          DTransfer.setData('passengers_number', "1");
          DTransfer.setData('baggages_number', "0");
          DTransfer.setData('voucher_code', "");
          DTransfer.setData('voucher_code', "");
          DTransfer.setData('selected_data', 0);
          DTransfer.setData('baggages_number', "0");
          DTransfer.setData('distance', 0);
          DTransfer.setData('duration', "");
          DTransfer.setData('car_name', "");
          DTransfer.setData('car_class', "");
          DTransfer.setData('car_numberOfPassengers', "");
          DTransfer.setData('total_price', 0);
          DTransfer.setData('before_voucher_price', 0);
          DTransfer.setData('first_map_center', 0);
          console.log(error);
          if (error.status == -1) {
            $scope.showAlert("Error", "There is no internet connection - please connect to a network", function () {
              $state.go('tab.home');
            });


          }
          else {
            StorageService.addSession('auth_token', "");

            $scope.showAlert("Error", "Something went wrong", function () {
              $state.go('landingpage');
            });

          }

        });
    }

    $scope.selectCar = function (car) {

      console.log(car);
      DTransfer.setData('car_name', car.name);
      DTransfer.setData('car_class', car.info.type);
      DTransfer.setData('total_price', car.price);
      DTransfer.setData('total_price_ro', car.roPrice);
      DTransfer.setData('before_voucher_price', car.before_voucher_price);
      DTransfer.setData('numberOfPassengers', car.info.numberOfPassengers);
      DTransfer.setData('baggages_number', car.max_baggages.toString());
      console.log(typeof DTransfer.getData('numberOfPassengers'), DTransfer.getData('numberOfPassengers'));
      $state.go('dt_tab.overview');
    };

  })
  .controller('overviewCtrl', function ($scope, $state, $http, StorageService, DTransfer, $ionicPopup, $ionicSlideBoxDelegate, $ionicPlatform) {


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

    $scope.$watch('transfer.origin.place_title', function (item) {
      console.log(item);
      console.log("element", $('textarea').width());
      if ($('textarea').width() >= 300) {
        $scope.chars = 44;
      } else {
        $scope.chars = 34;
      }

    });

    $ionicPlatform.ready(initialize);


    function initialize() {
      var myLatLng = {lat: 45.7494444, lng: 21.2272222};
      var origin_place_id = null;
      var destination_place_id = null;
      var travel_mode = 'DRIVING';

      $scope.transfer = {};
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


      $scope.originId = DTransfer.getData('origin').place_id;
      $scope.destinationId = DTransfer.getData('destination').place_id;

      $scope.transfer.origin = DTransfer.getData('origin');
      $scope.transfer.destination = DTransfer.getData('destination');

      geocoder.geocode({'placeId': $scope.originId}, function (results, status) {
        current_location_marker.setVisible(false);
        console.log($scope.originId);
        if (status == 'OK') {
          var results = results[0];
          console.log("geocoder orig: ", results);

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

          route(travel_mode, directionsService, directionsDisplay);
        }
      });

      geocoder.geocode({'placeId': $scope.destinationId}, function (results, status) {
        current_location_marker.setVisible(false);
        console.log($scope.destinationId);
        if (status == 'OK') {
          var results = results[0];
          console.log("geocoder dest: ", results);

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

          route(travel_mode, directionsService, directionsDisplay);
        }
      });

      function route(travel_mode, directionsService, directionsDisplay) {
        console.log($scope.transfer.origin.place_id, $scope.transfer.destination.place_id);
        if (!$scope.transfer.origin.place_id || !$scope.transfer.destination.place_id) {
          return;
        }
        else if (ok == 0) {
          ok = 1;
          directionsService.route({
            origin: {
              'placeId': $scope.transfer.origin.place_id
            }
            , destination: {
              'placeId': $scope.transfer.destination.place_id
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

              DTransfer.setData('distance', response.routes[0].legs[0].distance.value / 1000); // in km
              DTransfer.setData('duration', Math.round(response.routes[0].legs[0].duration.value / 60)); // in minutes

              $scope.info_distance = response.routes[0].legs[0].distance.value / 1000;
              $scope.info_duration = Math.round(response.routes[0].legs[0].duration.value / 60);

              console.log('travel info: ', $scope.info_distance, $scope.info_duration);
              $scope.$digest();
              var destination_display_direction = {
                lat: response.routes[0].bounds.f.b,
                lng: response.routes[0].bounds.b.f
              };

              console.log(response.destinationAddress);
              // if($scope.transfer.destination.place_title.toLowerCase().indexOf("aeroport")!= -1) {
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
              $scope.showAlert("Error", 'Directions request failed due to ' + status)
            }
          });
        }
      }

    }

    $scope.backService = function () {
      $state.go('dt_tab.carService')
    };
    $scope.continue = function () {
      $state.go('dt_tab.success')
    };
    $scope.cancel = function () {
      $state.go('tab.home');
    };
    $scope.close = function () {
      DTransfer.setData('origin', "");
      DTransfer.setData('destination', "");
      DTransfer.setData('last_input_changed', 0);
      DTransfer.setData('date', "--:-- dd/MM/yy");
      DTransfer.setData('passengers_number', "1");
      DTransfer.setData('baggages_number', "0");
      DTransfer.setData('voucher_code', "");
      DTransfer.setData('voucher_code', "");
      DTransfer.setData('selected_data', 0);
      DTransfer.setData('baggages_number', "0");
      DTransfer.setData('distance', 0);
      DTransfer.setData('duration', "");
      DTransfer.setData('car_name', "");
      DTransfer.setData('car_class', "");
      DTransfer.setData('car_numberOfPassengers', "");
      DTransfer.setData('total_price', 0);
      DTransfer.setData('total_price_ro', 0);
      DTransfer.setData('before_voucher_price', 0);
      DTransfer.setData('first_map_center', 0);
      $state.go('tab.home');
    };
    $ionicPlatform.ready(function () {
      $scope.transfer = {};

      $scope.transfer.origin = DTransfer.getData('origin');
      $scope.transfer.destination = DTransfer.getData('destination');
      $scope.startDateTime = DTransfer.getData('date').toISOString();


      $scope.car_name = DTransfer.getData('car_name');
      $scope.car_class = DTransfer.getData('car_class');
      $scope.total_price = DTransfer.getData('total_price');
      $scope.total_price_ro = DTransfer.getData('total_price_ro');
      $scope.before_voucher_price = DTransfer.getData('before_voucher_price');
      $scope.numberOfPassengers = DTransfer.getData('numberOfPassengers');
      $scope.numberOfBaggages = DTransfer.getData('baggages_number');
      //$scope.$digest();

      var authentification_code = 'bearer ' + StorageService.getSession('auth_token');

      $scope.payUp = function () {
        $http.post(citylimoConfig.carAPI + 'order', {
          routeType: 'direct-transfer',
          origin: $scope.transfer.origin.place_title,
          destination: $scope.transfer.destination.place_title,
          waypoints: [""],
          roundTrip: "",
          schedule: {
            date: $scope.startDateTime,
            hour: new Date($scope.startDateTime).getHours().toString(),
            minute: new Date($scope.startDateTime).getMinutes().toString(),
            type: '1',
          },
          flightNumber: "",
          returnFlightNumber: "",
          selectedCarCombination: {
            quantity: '1',
            type: $scope.car_class,
            price: $scope.total_price.toString(),
            seatsRemaining: '3',
            text: ""
          },
          effort: {
            distance: (DTransfer.getData('distance')*1000).toString(),
            duration: (DTransfer.getData('duration')*60).toString()
          },
          passengers: {
            adults: '2',
            children: '1',
            total: '3'
          },

          observations: "",

        }, {
          headers: {
            'citylimo-token': authentification_code
          }
        })
          .then(function (response) {

            console.log("response: ", response);
            // StorageService.addSession("auth_token", response.data.token);

            var ref = cordova.InAppBrowser.open('http://api.citylimo.ro/paymentApp?orderId=' + response.data.id, '_blank');
            // var ref = cordova.InAppBrowser.open('http://citylimo-api-qa.newhaircut.co/paymentApp?orderId=' + response.data.id, '_blank');

            ref.addEventListener('loadstop', function (event) {
                console.log("payment event", event);
                if (event.url.match("paymentReturnApp")) {
                  ref.close();

                  //redirect
                  var uniqueId = Number(event.url.split("=")[1].toString());
                  $http.post(citylimoConfig.carAPI + 'checkOrderStatus', {uniqueId: uniqueId}, {
                    headers: {
                      'citylimo-token': authentification_code
                    }

                  })
                    .then(function (response) {
                        console.log(response);
                        if (response.data == true) {
                          DTransfer.setData('origin', "");
                          DTransfer.setData('destination', "");
                          DTransfer.setData('last_input_changed', 0);
                          DTransfer.setData('date', "--:-- dd/MM/yy");
                          DTransfer.setData('passengers_number', "1");
                          DTransfer.setData('baggages_number', "0");
                          DTransfer.setData('voucher_code', "");
                          DTransfer.setData('voucher_code', "");
                          DTransfer.setData('selected_data', 0);
                          DTransfer.setData('baggages_number', "0");
                          DTransfer.setData('distance', 0);
                          DTransfer.setData('duration', "");
                          DTransfer.setData('car_name', "");
                          DTransfer.setData('car_class', "");
                          DTransfer.setData('car_numberOfPassengers', "");
                          DTransfer.setData('total_price', 0);
                          DTransfer.setData('before_voucher_price', 0);
                          DTransfer.setData('first_map_center', 0);
                          $state.go('tab.orders')
                        }
                      }, function (error) {
                        console.log(error);
                        if (error.status == -1) {
                          DTransfer.setData('origin', "");
                          DTransfer.setData('destination', "");
                          DTransfer.setData('last_input_changed', 0);
                          DTransfer.setData('date', "--:-- dd/MM/yy");
                          DTransfer.setData('passengers_number', "1");
                          DTransfer.setData('baggages_number', "0");
                          DTransfer.setData('voucher_code', "");
                          DTransfer.setData('voucher_code', "");
                          DTransfer.setData('selected_data', 0);
                          DTransfer.setData('baggages_number', "0");
                          DTransfer.setData('distance', 0);
                          DTransfer.setData('duration', "");
                          DTransfer.setData('car_name', "");
                          DTransfer.setData('car_class', "");
                          DTransfer.setData('car_numberOfPassengers', "");
                          DTransfer.setData('total_price', 0);
                          DTransfer.setData('before_voucher_price', 0);
                          DTransfer.setData('first_map_center', 0);

                          console.log("error: ", error);
                          // alert("There is no internet connection - please connect to a network");
                          $scope.showAlert("Error", "There is no internet connection - please connect to a network", function () {
                            $state.go('tab.home');
                          });
                        }
                        else if (error.data.message == "Plata esuata") {
                          $scope.showAlert("Error", "Transaction failed");
                        } else {
                          DTransfer.setData('origin', "");
                          DTransfer.setData('destination', "");
                          DTransfer.setData('last_input_changed', 0);
                          DTransfer.setData('date', "--:-- dd/MM/yy");
                          DTransfer.setData('passengers_number', "1");
                          DTransfer.setData('baggages_number', "0");
                          DTransfer.setData('voucher_code', "");
                          DTransfer.setData('voucher_code', "");
                          DTransfer.setData('selected_data', 0);
                          DTransfer.setData('baggages_number', "0");
                          DTransfer.setData('distance', 0);
                          DTransfer.setData('duration', "");
                          DTransfer.setData('car_name', "");
                          DTransfer.setData('car_class', "");
                          DTransfer.setData('car_numberOfPassengers', "");
                          DTransfer.setData('total_price', 0);
                          DTransfer.setData('before_voucher_price', 0);
                          DTransfer.setData('first_map_center', 0);

                          console.log("error: ", error);
                          StorageService.addSession('auth_token', "");
                          $scope.showAlert("Error", "Something went wrong", function () {
                            $state.go('landingpage');
                          });
                        }

                      }
                    );
                  // redirect to success page
                }
              }
            );

          }, function (error) {

            DTransfer.setData('origin', "");
            DTransfer.setData('destination', "");
            DTransfer.setData('last_input_changed', 0);
            DTransfer.setData('date', "--:-- dd/MM/yy");
            DTransfer.setData('passengers_number', "1");
            DTransfer.setData('baggages_number', "0");
            DTransfer.setData('voucher_code', "");
            DTransfer.setData('voucher_code', "");
            DTransfer.setData('selected_data', 0);
            DTransfer.setData('baggages_number', "0");
            DTransfer.setData('distance', 0);
            DTransfer.setData('duration', "");
            DTransfer.setData('car_name', "");
            DTransfer.setData('car_class', "");
            DTransfer.setData('car_numberOfPassengers', "");
            DTransfer.setData('total_price', 0);
            DTransfer.setData('before_voucher_price', 0);
            DTransfer.setData('first_map_center', 0);
            console.log("error: ", error);

            if (error.status == -1) {
              // alert("There is no internet connection - please connect to a network");
              $scope.showAlert("Error", "There is no internet connection - please connect to a network", function () {
                $state.go('tab.home');
              });
            } else {
              StorageService.addSession('auth_token', "");
              $scope.showAlert("Error", "Something went wrong", function () {
                $state.go('landingpage');
              });
            }
          })
      }
      ;
    })
    ;
  })
;

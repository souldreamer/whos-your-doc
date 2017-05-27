angular.module('citylimo.services')
  .service('DTransfer', function () {

    this.data = {
      first_map_center: 0,
      origin: "",
      destination: "",
      last_input_changed: 0,
      passengers_number: "1",
      date: "--:-- dd/MM/yy",
      voucher_code: "",
      selected_date: 0,
      baggages_number: "0",
      distance: "",
      duration: "",
      car_name: "",
      car_class: "",
      car_numberOfPassengers: "",
      total_price: 0,
      total_price_ro: 0,
      before_voucher_price: 0
      // recent_origins: JSON.stringify([]),
      // recent_destinations: ""
    };

    this.setData = function (dataKey, dataValue) {
      this.data[dataKey] = dataValue;
    };

    this.getData = function (dataKey) {
      return this.data[dataKey];
    };


    // this.getRecentOrigins = function() {
    //   return JSON.parse(this.data.recent_origins);
    // };
    //
    // this.setRecentOrigins = function(info) {
    //   var origin_array = JSON.parse(this.data.recent_origins);
    //   if(origin_array.length > 5) {
    //     origin_array.shift();
    //   }
    //   origin_array.push(info);
    //   this.data.recent_origins = JSON.stringify(origin_array);
    // };
  });
  //
  //
  // .service('AuthService', function () {
  //
  //   this.data = {
  //     fullName: "",
  //     email: "",
  //     mobile: 0,
  //     password: ""
  //   };
  //
  //   this.setData = function (dataKey, dataValue) {
  //     this.data[dataKey] = dataValue;
  //   };
  //
  //   this.getData = function (dataKey) {
  //     return this.data[dataKey];
  //   };
  //
  // });

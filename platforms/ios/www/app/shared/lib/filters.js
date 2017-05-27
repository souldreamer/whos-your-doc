filters
  .filter('getLocation', function () {
    return function (input, chars) {
      var chars = Number(chars);
      if(input) {
        if(input.split(',')[0].length > chars)
          return input.split(',')[0].slice(0, chars+1) + '...' + '\n';
        else
          return input.split(',')[0] + '\n';
      }
    };
  })
  .filter('getDescription', function () {
    return function (input, chars) {
      var chars = Number(chars);
     if(input) {
       if(input.split(',').slice(1).join().length > chars)
         return input.split(',').slice(1).join().trim().slice(0, chars+1) + '...';
       else
       return input.split(',').slice(1).join().trim();
     }
    };
  })
    .filter('convertToHours', function () {
    return function (mins) {

     if(mins) {
       var hours = Math.floor(mins / 60);
       var minutes = mins % 60;
       return hours + " H " + minutes + " min";
     }
    };

  });

factories
  .factory('StorageService', function ($localStorage) {
      $localStorage = $localStorage.$default({
        sessions: {
          firstUse: false,
          auth_token: ""
        },
        things: [],
        recent: {
          origins: [],
          destinations: []
        }
      });

      var _addSession = function (category, item) {
        $localStorage.sessions[category] = item;
      };

      var _getSession = function (category) {
        return $localStorage.sessions[category];
      };

      var _getAll = function () {
        return $localStorage.things;
      };

      var _add = function (thing) {
        $localStorage.things.push(thing);
      };

      var _remove = function (thing) {
        $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
      };

      var _getRecent = function (category) {
        return $localStorage.recent[category];
      };

      var _addRecent = function (category, item) {

        if ($localStorage.recent[category].length >= 5) {
          $localStorage.recent[category].pop();
        }
        $localStorage.recent[category].unshift(item);

      };

      var _removeRecent = function (category, item) {
        // $localStorage.recent[category].splice($localStorage.recent[category].indexOf(thing),1);

        $localStorage.recent[category].splice($localStorage.recent[category].indexOf(item), 1);

      };
      // };
      // var _removeRecent = function(category, item) {
      //   // $localStorage.recent[category].splice($localStorage.recent[category].indexOf(thing),1);
      //
      //   for(var i in $localStorage.recent[category]) {
      //     if($localStorage.recent[category][i].place_id == item.place_id) {
      //       $localStorage.recent[category].splice(i, 1);
      //       console.log(123);
      //     }
      //   }
      // };

      var _clearRecent = function (category) {
        $localStorage.recent[category] = [];
      };

      return {
        addSession: _addSession,
        getSession: _getSession,
        getAll: _getAll,
        add: _add,
        remove: _remove,
        getRecent: _getRecent,
        addRecent: _addRecent,
        removeRecent: _removeRecent,
        clearRecent: _clearRecent
      };
    }
  );

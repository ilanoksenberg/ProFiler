(function() {
  'use strict';

  //service which handle click on file, return file object after encoding. **future work**
  app.factory('FetchFileFactory', ['$http',
    function($http) {
      var _factory = {};
      //get file
      _factory.fetchFile = function(file) {
        return $http.get('/api/resource?resource=' + encodeURIComponent(file));
      };

      return _factory;
    }
  ]);

}());

(function() {
  'use strict';

  app.controller('HomeCtrl', ['$scope', 'FetchFileFactory',
    function($scope, FetchFileFactory) {
      $scope.fileViewer = '';
      $scope.dataTree = '';

      $scope.tree_core = {
        
        multiple: false,  // disable multiple node selection

        check_callback: function (operation, node, node_parent, node_position, more) {
            // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
            // in case of 'rename_node' node_position is filled with the new node name

            if (operation === 'move_node') {
                return false;   // disallow all dnd operations
            }
            return true;  // allow all other operations
        }
      };

      $scope.nodeSelected = function(e, data) {
        var test = data.node;
        var _l = data.node.li_attr;
        console.log(test);
        console.log(test.children);
        if (_l.isLeaf) {
          FetchFileFactory.fetchFile(_l.base).then(function(data) {
            var _d = data.data;
            console.log(_d);
            if (typeof _d == 'object') {

              //http://stackoverflow.com/a/7220510/1015046//
              _d = JSON.stringify(_d, undefined, 2);
            }
            $scope.fileViewer = _d;

          });
        } else {

          //http://jimhoskins.com/2012/12/17/angularjs-and-apply.html//
          $scope.$apply(function() {
            $scope.fileViewer = '';


          });
        }
        $scope.dataTree = _l.parent;
        if(test.children.length>0){
          $scope.dataTree = _l.parent + '\n'+test.children;
        }
       };
    }
  ]);

}());

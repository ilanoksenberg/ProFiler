(function () {
    'use strict';

    app.controller('HomeCtrl', ['$scope', '$route', '$window', 'FetchFileFactory',
        function ($scope, $route, $window, FetchFileFactory) {

            //  $scope.fileViewer = 'Please select a file to view its contents';
            $scope.tree_core = {

                multiple: true,
                //search:true,// disable multiple node selection

                check_callback: function (operation, node, node_parent, node_position, more) {
                    // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    // in case of 'rename_node' node_position is filled with the new node name

                    if (operation === 'move_node') {
                        return false;   // disallow all dnd operations
                    }
                    return true;  // allow all other operations
                }
            };


            $scope.buildHeader = "Build Your Own Tree";
           var tree= $('data-tree');
            $scope.nodeSelected = function (e, data) {

                $('#step2').css("display","none");


                var treeNode = data.node;



                var _l = data.node.li_attr;
                if (_l.isLeaf) {
                     FetchFileFactory.fetchFile(_l.base).then(function (data) {
                        var _d = data.data;
                        if (typeof _d == 'object') {

                            _d = JSON.stringify(_d, undefined, 2);
                        }
                        var temp = _l.fileType.split('-');
                        if (temp[temp.length - 1] == 'pdf') {


                        }
                        else if ((treeNode.text[0] != '.'))
                            $scope.fileViewer = _d;

                    });


                } else {

                  /* ---------allow copy by click on the nodes----------

                   var children = JSON.stringify(treeNode.children);
                    children = children.substring(1, children.length - 1);
                    $('.data-tree').jstree("destroy").empty();
                    $('.data-tree').jstree({

                        'core': {
                            "check_callback": true,
                            'data': [

                                {
                                    'text': treeNode.text,
                                    'icon': treeNode.isLeaf ? routes.fileType(children) : 'jstree-custom-folder',
                                    'state': {
                                        'opened': false,
                                        'selected': true
                                    },
                                    'children': split(children)
                                }]
                        },


                        "plugins": [
                            "contextmenu", "dnd", "search",
                            "state", "types", "wholerow"
                        ],
                        rules: {
                            multitree: true,
                            draggable: "all",
                            drag_copy : "on"

                        },
                        callback : {
                            beforechange: function() { log("About to change"); return true; },
                            beforeopen  : function() { log("About to open"); return true; },
                            beforeclose : function() { log("About to close"); return true; },
                            beforemove  : function() { log("About to move"); return true; },
                            beforecreate: function() { log("About to create"); return true; },
                            beforerename: function() { log("About to rename"); return true; },
                            beforedelete: function() { log("About to delete"); return true; },
                            onselect    : function() { log("Select"); },
                            ondeselect  : function() { log("Deselect"); },
                            onchange    : function() { log("Focus changed"); },
                            onrename    : function() { log("Rename"); },
                            onmove      : function() { log("Move"); },
                            oncopy      : function() { log("Copy"); },
                            oncreate    : function() { log("Create"); },
                            ondelete    : function() { log("Delete"); },
                            onopen      : function() { log("Open"); },
                            onopen_all  : function() { log("Open ALL"); },
                            onclose     : function() { log("Close"); },
                            error       : function() { },
                            ondblclk    : function() { log("Doubleclick"); TREE_OBJ.toggle_branch.call(TREE_OBJ, NODE); TREE_OBJ.select_branch.call(TREE_OBJ, NODE); },
                            onrgtclk    : function() { log("Rightclick"); },
                            onload      : function() { log("Tree loaded"); },
                            onfocus     : function() { log("Tree got focus"); },
                            ondrop      : function() { log("Foreign node dropped"); }
                        }

                    });*/

                }



            };

            var tree= $('.data-tree').jstree(true);
            console.log(tree);
            /*-----------------------------------search handling-----------------------------------*/
            $("#s").submit(function (e) {
                e.preventDefault();
                 var searchResult = $('.data-tree').jstree('search', $("#q").val());
                $( ".jstree-search" ).css( "color", "green");
                var $j_object = $(".jstree-search").parent();
                alert($j_object.size());
                var classSearch = '.jstree-search';
                var resultsArray = $(classSearch).parent();
                $scope.fileViewer = resultsArray[0];
                console.log(resultsArray.length);
                console.log(resultsArray[0]);
                console.log(searchResult);
                $('#s').blur();
                $( "#buildTree" ).prop( "disabled", false );

            });

            /*-----------------------------------build tree-----------------------------------*/

            $("#buildTree").click(function(){
                $('.file-viewer').jstree("destroy").empty();
                var node = $('.file-viewer').jstree({
                    'core': {
                        "check_callback": true,
                        'data': [

                            {
                                'text': 'New Tree',
                                'icon': 'jstree-custom-folder',
                                'state': {
                                    "key" : "state",
                                    'opened': false,
                                    'selected': true
                                },
                                'children': ['.localized']

                            }
                        ]
                    },
                    "plugins": [
                        "contextmenu", "dnd", "search",
                        "state", "types", "wholerow"
                    ]
                });

            });

            /*-----------------------------------create node-----------------------------------*/

            $('#create').click(function () {
                $( "#reset" ).prop( "disabled", false );
                $('.file-viewer').jstree("destroy").empty();
                var new_tree = $('.file-viewer').jstree({
                    'core': {
                        "check_callback": true,
                        'data': [

                            {
                                'text': 'New Folder',
                                'icon': 'jstree-custom-folder',
                                'state': {
                                    "key" : "state",
                                    'opened': false,
                                    'selected': true
                                }

                            }
                        ]
                    },
                    "plugins": [
                        "contextmenu", "dnd", "search",
                        "state", "types", "wholerow"
                    ],
                    rules: {
                        multitree: true,
                        draggable: "all",
                        drag_copy: false

                    },
                    callback : {
                        beforechange: function() { log("About to change"); return true; },
                        beforeopen  : function() { log("About to open"); return true; },
                        beforeclose : function() { log("About to close"); return true; },
                        beforemove  : function() { log("About to move"); return true; },
                        beforecreate: function() { log("About to create"); return true; },
                        beforerename: function() { log("About to rename"); return true; },
                        beforedelete: function() { log("About to delete"); return true; },
                        onselect    : function() { log("Select"); },
                        ondeselect  : function() { log("Deselect"); },
                        onchange    : function() { log("Focus changed"); },
                        onrename    : function() { log("Rename"); },
                        onmove      : function() { log("Move"); },
                        oncopy      : function() { log("Copy"); },
                        oncreate    : function() { log("Create"); },
                        ondelete    : function() { log("Delete"); },
                        onopen      : function() { log("Open"); },
                        onopen_all  : function() { log("Open ALL"); },
                        onclose     : function() { log("Close"); },
                        error       : function() { },
                        ondblclk    : function() { log("Doubleclick"); TREE_OBJ.toggle_branch.call(TREE_OBJ, NODE); TREE_OBJ.select_branch.call(TREE_OBJ, NODE); },
                        onrgtclk    : function() { log("Rightclick"); },
                        onload      : function() { log("Tree loaded"); },
                        onfocus     : function() { log("Tree got focus"); },
                        ondrop      : function() { log("Foreign node dropped"); }
                    }
                });
                $('#create').blur();


            });

        }
    ]);
}());




function split(children) {
    var children1 = [];
    var children2 = [];
    children1 = children.split(',');
    children1.forEach(function (entry) {
        console.log(entry);
        temp = entry.split('/');
        console.log(temp);
        temp = temp[temp.length - 1];
        temp = temp.substring(0, temp.length - 1);
        children2.push(temp);

    });

    return children2;
}
(function () {
    'use strict';
    //app main controller
    app.controller('HomeCtrl', ['$scope', '$route', '$window', 'FetchFileFactory',
        function ($scope, $route, $window, FetchFileFactory) {
            //jstree configuration
            $scope.tree_core = {

                check_callback: function (operation, node, node_parent, node_position, more) {
                    // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    // in case of 'rename_node' node_position is filled with the new node name
                    return true;  // allow all other operations
                }
                //multiple: true
            };
            $scope.tree_rules = {
                    multitree : true,
                    always_copy : true,
                    draggable : "all"

            };

            $scope.buildHeader = "Build Your Own Tree";
            $scope.searchHeader = "Search In Your Tree";


            /*------------------------handle node selected-------------------------------------*/
            $scope.nodeSelected = function (e, data) {

                console.log("yes");
                var treeNode = data.node;
                var test = $('#'+treeNode.id).attr("href");

                treeNode.attr("href","file://"+treeNode.id);
               //window.location.href("file://"+treeNode.id);
                 var _l = data.node.li_attr;
                console.log(treeNode.id);
                //PDFJS.getDocument('file:/'+treeNode.id);

                /*------------------handle files selected---------------*/

                if (_l.isLeaf) {
                     FetchFileFactory.fetchFile(_l.base).then(function (data) {
                        var _d = data.data;
                        if (typeof _d == 'object') {

                            _d = JSON.stringify(_d, undefined, 2);
                        }
                        var temp = _l.fileType.split('-');
                        if (temp[temp.length - 1] == 'pdf') {
                            /*var win = window.open("file://"+treeNode.id, null, "width=400,height=300");
                            var doc = win.document;
                            doc.open("text/html");
                            doc.write("Session");
                            doc.close();*/

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


            /*-----------------------------------create node '+' button-----------------------------------*/

            $('#create').click(function () {
                $( "#reset" ).prop( "disabled", false );
                $('.file-viewer').jstree("destroy").empty();
                $('.tree-preview').empty();

                var new_tree = $('.file-viewer').jstree({
                    'core': {
                        "check_callback": true,
                        'data': [

                            {
                                'text': 'New Folder',
                                'icon': 'jstree-custom-folder',
                                'state': {
                                    'opened': false,
                                    'selected': true
                                },
                                "li_attr": {
                                    "parent": 'root',
                                    "fileType": 'folder',
                                    "base": '#',
                                    "isLeaf": false
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




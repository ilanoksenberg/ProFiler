(function() {
  'use strict';
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var path = require('path');

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });

  /* Serve the Tree */
  router.get('/api/tree', function(req, res) {
    var _p;
    if (req.query.id == 1) {
      _p = path.resolve(__dirname, '../../../../talcohen/profiler');
      processReq(_p, res);

    } else {
      if (req.query.id) {
        _p = req.query.id;
        processReq(_p, res);
      } else {
        res.json(['No valid data found']);
      }
    }
  });

  /* Serve a Resource */
  router.get('/api/resource', function(req, res) {
    res.send(fs.readFileSync(req.query.resource, 'UTF-8'));
  });
  function processReq(_p, res) {
    var resp = [];
    fs.readdir(_p, function(err, list) {
      for (var i = list.length - 1; i >= 0; i--) {
        resp.push(processNode(_p, list[i]));
      }
      res.json(resp);

    });
  }

  function processNode(_p, f) {
    var s = fs.statSync(path.join(_p, f));
    return {

          "check_callback": true,
          "id": path.join(_p, f),
          "text": f,
          "icon": s.isDirectory() ? 'jstree-custom-folder' : fileType(f),

          "state": {
              "key": "state",
              "loaded":true,
               "opened":true,
              "disabled": false,
              "selected": false
          },
          "li_attr": {
            "parent": path.join(_p),
            "fileType": s.isDirectory() ? 'folder' : fileType(f).substring(19),
            "base": path.join(_p, f),
            "isLeaf": !s.isDirectory()
          },
          "children": s.isDirectory(),

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
      };
  }
function fileType(text){
  var temp = text.split('.');
  console.log(temp);
  var type = "jstree-custom-file";
  switch (temp[temp.length - 1]){
      case 'jpeg':
      case 'jpg':
      case 'gif':
      case 'png' :
          type+='-img';
          break;
      case 'docx':
      case 'doc':
          type+='-doc';
          break;
      case 'PDF':
      case 'pdf':
          type+='-pdf';
          break;
      case 'php':
          type+='-php';
          break;
      case 'ppt':
          type+='-ppt';
          break;
      case 'js':
          type+='-js';
          break;
      case 'json':
          type+='-json';
          break;
      case 'css':
          type+='-css';
          break;
      case 'html':
          type+='-html';
          break;
      case 'zip':
      case 'rar':
          type+='-zip';
          break;
      default :
          break;

  }
  return type;
}
  module.exports = router;

}());




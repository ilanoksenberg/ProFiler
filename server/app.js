(function() {
  'use strict';

  //node modules required
  var express = require('express');
  var path = require('path');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var routes = require('./routes.js');
  var app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  //render the html docs using 'ejs' engine
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../client')));
  //server route
  app.use('/', routes);
  app.set('port', process.env.PORT || 3000);
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
  module.exports = app;
}());

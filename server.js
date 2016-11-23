require('babel-register');
var path = require('path');
var express = require('express');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/containers/Application.js').routes;
const match = Router.match;
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;
var staticPath = path.join(__dirname, '/dist');
const S_IN_YR = 31536000;
var permaNews = {};

app.use(express.static(staticPath, { maxAge: S_IN_YR }));

app.get('*', function (req, res) {
  match({ routes: routes, location: req.url }, function(error, redirectLocation, renderProps) {
    if (typeof renderProps.routes[1] !== 'undefined' && renderProps.routes[1].status === 404) {
      res.status(404).sendFile(path.join(__dirname, '/dist/index.html'));
    } else {
      res.sendFile(path.join(__dirname, '/dist/index.html'));
    }
  })
});

app.listen(port, function() {
  console.log('listening')
});

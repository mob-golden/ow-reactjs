require('babel-register');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid');
var compression = require('compression');
var fetch = require('isomorphic-fetch');
var qs = require('querystring');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/containers/Application').routes;

var urls = require('./app/constants/urls');

const match = Router.match;
var fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;
var staticPath = path.join(__dirname, '/dist');
const S_IN_YR = 31536000;
var permaNews = {};

app.use(express.static(staticPath, { maxAge: S_IN_YR }));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('trust proxy', true);
app.use(redirectWww);
function redirectWww(req, res, next) {
  if (!req.headers.host.slice(0, 4) === 'www.') {
    return res.redirect(301, req.protocol + '://www.' + req.headers.host + req.originalUrl);
  }
  next();
}

app.post('/signin', function (req, res) {
  const {
    email,
    password
  } = req.body;

  const data = qs.stringify({
    'grant_type': 'password',
    email,
    password
  });
  fetch(`${urls.SOLOMID_AUTH_SIGN_IN_URL}`, {
    body: data,
    headers: constructHeaders(data),
    method: 'POST'
  })
    .then(response => response.json())
    .then(json => {
      res.json(json);
    })
    .catch(error => {
      res.json(error);
    });
});

app.post('/signup', function (req, res) {
  const {
    username,
    email,
    password
  } = req.body;

  const data = qs.stringify({
    username,
    email,
    password
  });

  fetch(`${urls.SOLOMID_AUTH_SIGN_UP_URL}`, {
    body: data,
    headers: constructHeaders(data),
    method: 'POST'
  })
    .then(response => response.json())
    .then(json => {
      res.json(json);
    })
    .catch(error => {
      res.json(error);
    });
});

app.get('/', handleRender);
app.get('/heroes', handleRender);
app.get('/heroes/:heroKey', handleRender);
app.get('/heroes/:heroKey/generaltips', handleRender);
app.get('/heroes/:heroKey/matchups', handleRender);
app.get('/heroes/:heroKey/maprankings', handleRender);
app.get('/maprankingtips/:heroKey/:mapKey', handleRender);
app.get('/matchups/:heroKey/:matchupHeroKey/:matchupType', handleRender);
app.get('/maps', handleRender);
app.get('/maps/:mapKey', handleRender);
app.get('/forgot', handleRender);
app.get('/reset', handleRender);

app.all('*', send404);

function send404 (req, res) {
  res.setHeader('Cache-Control', `max-age=${S_IN_YR}`);
  res.status(404).send('Not found.');
}

function handleRender(req, res) {
  match({ routes, location: req.url }, function(error, redirectLocation, renderProps) {
    if (error) {
      console.log("[match]: error", error);
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      console.log("[match]: redirectLocation", redirectLocation);
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      if (typeof renderProps.routes[1] !== 'undefined' && renderProps.routes[1].status === 404) {
        res.status(404).sendFile(path.join(__dirname, '/dist/index.html'));
      } else {
        res.sendFile(path.join(__dirname, '/dist/index.html'));
      }
  } else {
      console.log("[match]: Not found");
      res.status(404).send('Not found');
    }
  });
}

function constructHeaders (data) {
  const credentials = new Buffer(`${process.env.AUTH_ID}:${process.env.AUTH_SECRET}`).toString('base64');

  return new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length,
    'Authorization': `Basic ${credentials}`
  });
}

app.listen(port, function() {
  	console.log('listening')
});

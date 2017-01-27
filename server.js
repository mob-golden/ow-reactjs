require('babel-register');
require('dotenv').config();
var path = require('path');
var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid');
var FastlyPurge = require('fastly-purge');
var compression = require('compression');
var fetch = require('isomorphic-fetch');
var qs = require('querystring');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/containers/Application').routes;
var isDevelopment = process.env.NODE_ENV ==='development';
var urls = require('./app/constants/urls');
var debug = require('debug')('app:log');
const match = Router.match;
const fs = require('fs');
var apiRoutes = require('./routes');
var app = express();
var port = process.env.PORT || 3000;
var staticPath = isDevelopment ? path.join(__dirname, '/app') : path.join(__dirname, '/dist');
var overwatchHost = process.env.OVERWATCH_HOST || "https://overwatch-select-api-prod.herokuapp.com";
const S_IN_YR = 31536000;
app.use(express.static(staticPath, { maxAge: S_IN_YR }));
app.use(session({
    store: new RedisStore({
    host: `${process.env.REDIS_HOST}`,
    port: `${process.env.REDIS_PORT}`,
    pass: `${process.env.REDIS_PASS}`
  }),
  secret: 'tsm#tsm#1wha',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly : false
  }
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('trust proxy', true);

app.post('/forgot', function (req, res) {
  const {
    email
  } = req.body;

  const data = qs.stringify({
    email
  });

  fetch(`${urls.SOLOMID_AUTH_FORGOT_PASS_URL}`, {
    body: data,
    headers: constructHeaders(data),
    method: 'POST'
  })
    .then(authResponse => {
      if (!authResponse.ok) {
        // TODO: check specific error messages
        res.statusMessage = "A user with that email wasn't found.";
        res.status(500).send();
        return Promise.reject(error);
      }

      return authResponse;
    })
    .then(authResponse => authResponse.json())
    .then(json => {
        const {
          email,
          token,
          user_id
        } = json;
        const helper = sendgrid.mail;
        const from = new helper.Email('no-reply@overwatchselect.net');
        const to = new helper.Email(email);
        const subject = 'Overwatch password reset'
        const params = qs.stringify({
          token,
          user_id
        })

        // TODO: clean up
        const host = process.env.HOST || req.headers.host;
        const url = `${req.protocol}://${host}/reset?${params}`;

        const body = `
          <p>Hi ${email},</p>
          <p>You've recently requested your SoloMid Network password to be reset. Set a new password by following the link below:</p>
          <a href="${url}">Reset password</a>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Your password won't change until you access the link above and create a new one.</p>
          <p>Thanks! <br />Team SoloMid </p>
        `;

        const content = new helper.Content('text/html', body);
        const mail = new helper.Mail(from, subject, to, content);
        const sg = sendgrid(process.env.SENDGRID_API_KEY);

        const sgReq = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        })

        sg.API(sgReq)
          .then(sgRes => {
            res.json(json);
          });
          // TODO: do not rely on catch here
          // .catch(error => {
          //   debug(error);
          // });

    })
    .then(json => json)
});

app.post('/reset', function (req, res) {
  const {
    password,
    token,
    userId
  } = req.body;

  const data = qs.stringify({
    password,
    token,

    // TODO: clean up
    user_id: userId
  });

  fetch(`${urls.SOLOMID_AUTH_RESET_PASS_URL}`, {
    body: data,
    headers: constructHeaders(data),
    method: 'POST'
  })
    .then(authResponse => {
      return authResponse.json(json => {
        const {
          error
        } = json;

        if (!response.ok) {
          res.statusMessage = error;
          res.status(500).send();
          Promise.reject(error);
        }

        return response.json();
      });
    })
    .then(json => {
      // TODO: DRY
      const error = json.error;

      if (error) {
        res.statusMessage = error;
        res.status(500).send();
      }

      res.json(json);
    })
});

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
      const { user : {id, username } ,access_token : token} = json;
      debug(json);
      debug(id);

      req.session.user_id = id;
      req.session.token = token;
      req.session.username = username;
      debug(req.session);
      debug(`session id set to ${req.session.id}`);
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
      debug(json);
      const { user : {id} ,access_token : token} = json;
      debug(`id,token ${id} ${token}`);
      req.session.user_id = id;
      req.session.token = token;
      res.json(json);
    })
    .catch(error => {
      res.json(error);
    });
});

app.get('/checkSession', function(req, res) {
  res.setHeader('Cache-Control', `max-age=0`)
  debug("Session Checking");
  debug(req.session);
  if(typeof req.session.user_id !== 'undefined' && typeof req.session.token !== 'undefined'){
    res.json({
      isLoggedIn: true,
      token: req.session.token
    });
  }
  else{
    res.json({
      isLoggedIn: false
    });
  }
});

app.post('/signout', function(req, res) {
  debug("Sign out- session destroy");
  if(typeof req.session.user_id !== 'undefined' && typeof req.session.token !== 'undefined'){
    req.session.destroy();
    debug("Session destoryed");
  }
  return res.json('signed out');
});

app.get('/', setCacheTime(31536000), getHandleRender());
app.get('/heroes', setCacheTime(31536000), getHandleRender());
app.get('/heroes/:heroType', setCacheTime(31536000), getHandleRender());
app.get('/hero/:heroKey', setCacheTime(31536000), getHandleRender());
app.get('/hero/:heroKey/generaltips', setCacheTime(31536000), getHandleRender());
app.get('/hero/:heroKey/matchups', setCacheTime(31536000), getHandleRender());
app.get('/hero/:heroKey/maprankings', setCacheTime(31536000), getHandleRender());
app.get('/maprankingtips/:heroKey/:mapKey', setCacheTime(31536000), getHandleRender());
app.get('/matchups/:heroKey/:matchupHeroKey/:matchupType', setCacheTime(31536000), getHandleRender());
app.get('/maps', setCacheTime(31536000), getHandleRender());
app.get('/maps/:mapType', setCacheTime(31536000), getHandleRender());
app.get('/map/:mapKey', setCacheTime(31536000), getHandleRender());
app.get('/forgot', setCacheTime(31536000), getHandleRender());
app.get('/reset', setCacheTime(31536000), getHandleRender());
app.get('/community', setCacheTime(31536000), getHandleRender());
app.get('/community/:commType', setCacheTime(31536000), getHandleRender());
app.get('/community/:commType/:threadId', setCacheTime(31536000), getHandleRender());


apiRoutes(app);
app.all('*', send404);
var indexFile = process.env.NODE_ENV === 'development' ? path.join(__dirname, '/app/index.dev.html') : path.join(__dirname, '/dist/index.html');

function send404 (req, res) {
  res.setHeader('Cache-Control', `max-age=${S_IN_YR}`);
  res.status(404).sendFile(indexFile);
}

function setCacheTime(time) {
    return (req, res, next) => {
        res.setHeader('Cache-Control', `max-age=${time}`);
        return next();
    }

}

function getHandleRender() {
  return function handleRender(req, res) {
      debug(`req.session.id is ${req.session.id}`);
      match({ routes, location: req.url }, function(error, redirectLocation, renderProps) {
        if (error) {
          debug("[match]: error", error);
          res.status(500).send(error.message)
        } else if (redirectLocation) {
          debug("[match]: redirectLocation", redirectLocation);
          res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
          if (typeof renderProps.routes[1] !== 'undefined' && renderProps.routes[1].status === 404) {
            res.status(404).sendFile(indexFile);
          } else {
            res.sendFile(indexFile);
          }
      } else {
          debug("[match]: Not found");
          res.status(404).sendFile(indexFile);
        }
    });
  }
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
    console.info(`🌎  Listening on port ${port} in ${process.env.NODE_ENV} mode on Node ${process.version}.`);
});

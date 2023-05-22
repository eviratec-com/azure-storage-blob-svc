const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const upload = require('./routes/upload');

const app = express();

const corsConfig = {
  // origin: [/localhost\:3000$/, /www\.eviratec\.com\.au$/],
  origin: '*',
  allowedHeaders: ['X-Eviratec-Token', 'Content-Type'],
  optionsSuccessStatus: 200
}

app.options('/upload', cors(corsConfig)) // enable pre-flight request for DELETE request

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsConfig));

function verificationFunction (tokenKey, verificationEp) {
  return function verifyEviratecToken (req) {
    return new Promise((resolve, reject) => {
      const ep = verificationEp
      const headers = {
        'Content-Type': 'application/json',
      }

      headers[tokenKey] =  req.headers[tokenKey]

      fetch(ep, { method: 'GET', headers: headers })
        .then((result) => {
          if (400 === result.status) {
            return result.json().then(json => {
              const e = new Error(json.message)
              reject(e)
            })
          }

          result.json()
            .then(json => resolve(json))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
}

// get callback headers
// to verify auth
app.use((req, res, next) => {
  const verifyEviratecToken = verificationFunction(
    req.headers['x-token-header'],
    req.headers['x-callback-url']
  )

  verifyEviratecToken(req)
    .then((user) => {
      req.user = user;
      req.site = req.headers['x-esp-site-id']);
      next();
    })
    .catch((e) => {
      console.log(e)
      const err = new Error('Invalid Token');
      err.status = 400;
      next(err);
    })
});


app.use('/upload', upload);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(req.headers)
  console.log(err)

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;

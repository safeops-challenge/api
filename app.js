var express = require('express');
var app = express();
var uuid = require('node-uuid');

var pg = require('pg');
var conString = process.env.DB;

// Routes
app.get('/api/status', function(req, res) {
  const client = new pg.Client(conString);
  client.connect(err => {
    if (err) {
      console.error("ERROR CONNECTING", err)
      return res.status(500).send('error fetching client from pool');      
    } else {
      console.log("CONNECTED")
    }
    client.query('SELECT now() as time', (err, result) => {
      if (err) {
        console.error("ERROR QUERYING")
        return res.status(500).send('error quering');
      }
      console.log(result.rows[0].time)
      client.end()
      return res.json({
        request_uuid: uuid.v4(),
        time: result.rows[0].time
      });
    })
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;

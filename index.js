var app = require('express')();
var server = require('http').Server(app);

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, vizi-token");
  next()
});

const ip2geo = require('./controllers/ip2geo_controller').ip2geo;

app.get('/:ip',(req, res) => {
    ip2geo(req,res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found URL');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
	res.status(err.status || 500);
	res.send(err);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe ' + addr
  : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

// App Server listening
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

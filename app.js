var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var moment = require('moment');
var validator = require('express-validator')

const session = require('express-session')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const mongoose = require('mongoose')

var MongoStore = require('connect-mongo')(session);



var index = require('./routes/index');
var users = require('./routes/users');

// 1
const genres = require('./routes/genres');
const books = require('./routes/books');
const sensor = require('./routes/sensor');

var app = express();
var server = app.listen(4000, () => {
  console.log('Listening to port 4000');
});
var io = socket(server);


app.locals.moment = moment

// 2 
mongoose.Promise = global.Promise
const mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/tutsplus-library'
mongoose.connect(mongoDB)

var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator())

// 3
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: true,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

// 4
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    }
  }
}))
 
// 5
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')
  next()
});

app.use(function (req, res, next) {
  req.io = io;
  next()
});

//check if session is available
app.use((req, res, next) => {
  res.locals.is_logged_in = req.session && req.session.userId;
  next()
});
// 6
app.use('/genres', genres);
app.use('/books', books);
app.use('/sensor', sensor);
 

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function (socket) {
  console.log('Connected.');
});


module.exports = app;

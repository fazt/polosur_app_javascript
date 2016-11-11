var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
mongoose.connect('localhost:27017/polosur');
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(app.get('views'),'layouts'),
  partialsDir: path.join(app.get('views'),'partials')
}));
app.set('view engine', '.hbs');
app.set('appName','Polosur');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysuperSecretWord',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=> {
  res.locals.appName = app.get('appName');
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  console.log(req.isAuthenticated());
  next();
});

app.use('/users', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

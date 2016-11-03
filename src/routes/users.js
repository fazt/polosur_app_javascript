var express = require('express');
var router = express.Router();

const passport = require('passport');
const csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);

router.get('/dashboard', isLoggedIn, (req, res, next) => {
  res.render('principal/dashboard', { title: 'Ventas SOftware' });
});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, (req, res, next) => {
  next();
});

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin',{
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.get('/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: 'users/dashboard',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

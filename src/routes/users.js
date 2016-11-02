var express = require('express');
var router = express.Router();

const passport = require('passport');
const csrf = require('csurf');
var csrfProtection = csrf();

router.use(csrfProtection);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signin', function(req, res, next) {
  res.render('users/signin', { csrfToken: req.csrfToken() });
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: '/dashboard',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

router.post('/signin', function(req, res, next) {
  let user = req.body.user;
  let password = req.body.password;
  if (user === 'fabian' && password ==='123') {
     res.redirect('/dashboard');
  }else{
    res.redirect('/users/login');
  }
});

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

module.exports = router;

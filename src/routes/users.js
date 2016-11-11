var express = require('express');
var router = express.Router();

const passport = require('passport');
const csrf = require('csurf');
var csrfProtection = csrf();

const Order = require('../models/order');
const Cart = require('../models/cart');

router.use(csrfProtection);

router.get('/dashboard', isLoggedIn, (req, res, next) => {
  Order.find({ user: req.user }, function (err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach( order => {
      cart = new Cart(order.cart);
      order.items= cart.generateArray();
    });
    res.render('principal/dashboard', { title: 'Ventas SOftware', orders:orders });
  });
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
  failureRedirect: '/users/signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/users/profile');
  }
});

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.get('/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup',{
  failureRedirect: '/users/signup',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/users/profile');
  }
});
//4p, estructurra de internet,

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

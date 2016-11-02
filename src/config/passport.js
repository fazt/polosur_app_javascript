const passport = require('passport');
const User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user) {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Email Invalido').notEmpty().isEmail();
  req.checkBody('password', 'Contraseña Invalida').notEmpty().isLength({min: 4});

  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error',messages));
  }

  User.findOne({'email': email},function(err,user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, {message: 'Email ya esta en uso'});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.save(function(err,result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}))

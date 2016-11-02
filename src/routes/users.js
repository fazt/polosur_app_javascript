var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});
router.post('/login', function(req, res, next) {
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

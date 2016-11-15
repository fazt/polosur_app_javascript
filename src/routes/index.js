var express = require('express');
var router = express.Router();

var controllers = require('../controllers');

/* GET home page. */
router.get('/', controllers.productcontroller.index);
router.get('/add-to-cart/:id',controllers.productcontroller.addToCart);
router.get('/reduce/:id',controllers.productcontroller.reduceCart);
router.get('/remove/:id',controllers.productcontroller.remove);
router.get('/shopping-cart', controllers.productcontroller.getViewShoppingCart);
router.get('/checkout', isLoggedIn , controllers.productcontroller.getCheckoutView);
router.post('/checkout',isLoggedIn , (controllers.productcontroller.postCheckout));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/users/signin');
}

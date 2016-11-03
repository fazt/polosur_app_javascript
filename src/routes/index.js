var express = require('express');
var router = express.Router();

var controllers = require('../controllers');

/* GET home page. */
router.get('/', controllers.productcontroller.index);
router.get('/add-to-cart/:id',controllers.productcontroller.addToCart);
module.exports = router;

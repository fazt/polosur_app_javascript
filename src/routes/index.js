var express = require('express');
var router = express.Router();
const Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find(function(err,products) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < products.length; i+= chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('index', { title: 'Express', products: productChunks });
  });
});

router.get('/dashboard', function(req, res, next) {
  res.render('principal/dashboard', { title: 'Ventas SOftware' });
});


module.exports = router;

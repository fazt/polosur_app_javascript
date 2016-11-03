const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports = {
  index: index,
  addToCart:addToCart
}

function index (req, res, next) {
  var products = Product.find(function(err,products) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < products.length; i+= chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('index', { products: productChunks });
  });
}

function addToCart(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  Product.findById(productId,(err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    return res.redirect('/');
  });
}

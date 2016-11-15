const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

module.exports = {
  index: index,
  addToCart: addToCart,
  reduceCart: reduceCart,
  remove: remove,
  getViewShoppingCart: getViewShoppingCart,
  getCheckoutView: getCheckoutView,
  postCheckout: postCheckout
}

function index (req, res, next) {
  var successMsg = req.flash('success')[0];

  var products = Product.find(function(err,products) {
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < products.length; i+= chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('index', { products: productChunks, successMsg: successMsg, noMessages: !successMsg });
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

function reduceCart(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);

  req.session.cart = cart;
  res.redirect('/shopping-cart');
}

function remove(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;

  res.redirect('/shopping-cart');
}

function getViewShoppingCart(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart',{products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice});
}

function getCheckoutView(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg= req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError:!errMsg});
}
// POST CHECKOUT
function postCheckout(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart',{products: null});
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")(
  "sk_test_hNNOyct8RGhuH5P4SNZcNRQY"
  );

stripe.charges.create({
  amount: cart.totalPrice * 100,
  // currency: "pen",
  currency: "PEN",
  // source: "tok_193WkzBizkH9qX0gU5y2Qodg", // obtained with Stripe.js
  source: req.body.stripeToken,
  // description: "Charge for chloe.martinez@example.com",
  description: "Test Charge"
}, function(err, charge) {
  // asynchronously called
  if (err) {
    req.flash('error', err.message);
    return res.redirect('/checkout');
  }
  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    paymentId: charge.id
  });
  order.save(function(err, result) {
    req.flash('success', 'Compra del Producto Satisfactoria');
    req.session.cart= null;
    res.redirect('/');
  });

});
}

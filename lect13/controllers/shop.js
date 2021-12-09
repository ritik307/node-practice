const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  console.log("----------fetching data----------");
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("ERROR WHILE FINDING A SINGLE PRODUCT");
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log("ERROR WHILE FETCHING INDEX OF THE PRODUCT");
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate() //? populate dosn't return a promise so we use execPopulate to return promise
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log("ERROR WHILE FETCHING CART");
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Product added successfully");
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("ERROR WHILE DELETING PRODUCT FROM CART");
    });
};

exports.postOrder = (req, res, next) => {
  console.log("--------------INSERTING ORDER---------------");
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      console.log("----------user fetched----------");
      const products = user.cart.items.map((i) => {
        //? _doc is used to get the actual data that is associated with the product 
        //? and with ...(spread operator) we pulled out all the data and store it into a new object
        // console.log(i.productId._doc);
        return { quantity: i.quantity, product: i.productId._doc };
      });
      console.log(products);
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user, //? mongoose will automatically fetch the id
        },
        products: products,
      });
      console.log("----------order created----------");
      console.log(order);
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log("ERROR WHILE POSTING ORDERS"));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log("ERROR WHILE GETTING ORDERS");
    });
};

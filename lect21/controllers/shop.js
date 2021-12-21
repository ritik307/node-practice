const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

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
        // isAuthenticated: req.session.isLoggedIn,
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
        // isAuthenticated: req.session.isLoggedIn,
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
        // isAuthenticated: req.session.isLoggedIn,
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
        // isAuthenticated: req.session.isLoggedIn,
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
          email: req.user.email,
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
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log("ERROR WHILE GETTING ORDERS");
    });
};

exports.getInvoice = (req,res,next)=>{
  const orderId = req.params.orderId;

  Order.findById(orderId).then(order=>{
    if(!order){
      return next(new Error("No order found."));
    }
    //? if a different authrized user tries to access the invoice of another user via link
    if(order.user.userId.toString() !== req.user._id.toString()){
      return next(new Error("No order found."));
    }
    const invoiceName = "invoice-"+orderId+".pdf";
    const invoicePath = path.join("data","invoices",invoiceName);

    const pdfDoc = new pdfDocument(); //? create a new pdf document. it is also a readable stream

    res.setHeader("Content-Type","application/pdf"); //? to tell what type of content is being sent
    res.setHeader("Content-Disposition","inline; filename='"+invoiceName+"'"); //? Content-Disposition tell us how the content should be viewed in the browser

    pdfDoc.pipe(fs.createWriteStream(invoicePath)); //? pipe the document to the file system
    pdfDoc.pipe(res); //? pipe the document to the response

    //? Adding data to the pdf
    pdfDoc.fontSize(26).text("Invoice",{
      underline:true
    });
    pdfDoc.text("--------------------");
    let totalPrice = 0;
    order.products.forEach(prod=>{
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.text(` ${prod.product.title} - ${prod.quantity} X Rs. ${prod.product.price}`);
    });
    pdfDoc.text("--------------------");
    pdfDoc.text("Total Price: Rs. "+totalPrice);

    pdfDoc.end(); //? it will close the writable stream therefore the file will be saved and the res will be sent


    {
    //? if we read the file as follow node will first of all access the file read the entire content into memory and then return it with response
    //? this means for bigger files it will take longer time to read the file and memory of server will overflow at some point for many incoming req
    //? THIS IS NOT A GOOD PRACTICE RATHER WE SHOULD STREAM OUR CONTENT
    // fs.readFile(invoicePath,(err,data)=>{
    //   if(err){
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type","application/pdf"); //? to tell what type of content is being sent
    //   res.setHeader("Content-Disposition","inline; filename='"+invoiceName+"'"); //? Content-Disposition tell us how the content should be viewed in the browser
    //   res.send(data);
    // })
    }
      // const file =  fs.createReadStream(invoicePath); //? creating a readable stream bcz we want to read the data ,now node will be able to read the file step by step in diff. chunks
      // res.setHeader("Content-Type","application/pdf"); //? to tell what type of content is being sent
      // res.setHeader("Content-Disposition","inline; filename='"+invoiceName+"'"); //? Content-Disposition tell us how the content should be viewed in the browser

      // //? we use pipe method to forward the data that is read-in with that stream above to my response bcz response object is a writable stream
      // //! NOTE:-  we can use readable streams to pipe their output to writable streams BUT not every obj. is a writable stream but res happens to be one
      // //? we can pipe our readable stream (filestream) into the response object (res), it means res will be streamed to the browser and will contain the data
      // //? and the data will basically be downloaded by the browser step by step. For large files this will be a better approach bcz node never has to preload 
      // //? all the data into memory BUT just streams it to the client on the fly and the most it has to store is one chunk of data 
      // //? Buffer:- gives us access to the chunks and here we dont wait for all the chunks to come together and concat them into one obj.
      // //? Instead we forward them to the browser which then also able to concat the incoming data pieces into the file.
      
      // file.pipe(res);
  })
  .catch((err)=>{
    next(err);
  })
}

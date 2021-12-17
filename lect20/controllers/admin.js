const Product = require("../models/product");
const { validationResult } = require("express-validator");


exports.getAddProduct = (req, res, next) => {
  console.log("--------getAddProuct------");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    validationErrors: [],
    errorMessage: null,
    // isAuthenticated: req.session.isLoggedIn,
  });
}; 

exports.postAddProduct = (req, res, next) => {
  console.log("--------postAddProduct------");
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log(req.body);
  if(!image){
    return res.status(422).render("admin/edit-product",{
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description : description
      },
      errorMessage: "Attached file is not an image",
      validationErrors: []
    });
  }

  const errors = validationResult(req);

  // console.log("ImageURL: "+imageUrl);

  if(!errors.isEmpty()){
    console.log("VALIDATION ERRORS WHILE ADDING PRODUCT");
    console.log(errors.array());
    return res.status(422).render("admin/edit-product",{
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product:{
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product.save()
    .then((result)=>{
      console.log("PRODUCT CREATED SUCCESSFULLY");
      res.redirect("/admin/products");
    })
    .catch((err)=>{
      console.log("ERROR WHILE SAVING PRODUCT");
      const error = new Error(err);
      error.httpStatusCode = 500;
      //? when we pass error to next() then we tell express that an error occured and express will skip all
      //? other middlewares and go directly to the error handling middleware
      return next(error); 
    })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        // isAuthenticated: req.session.isLoggedIn,
        validationErrors: []
      });
    })
    .catch((err)=>{
      console.log("ERROR WHILE EDITING THE PRODUCT");
      const error = new Error(err);
      error.httpStatusCode = 500; //? to access the status code of the error in the middleware
      //? when we pass error to next() then we tell express that an error occured and express will skip all
      //? other middlewares and go directly to the error handling middleware
      return next(error);
    });

};

exports.postEditProduct = (req, res, next) => {
  console.log("--------postEditProduct------");
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log("VALIDATION ERRORS WHILE EDITING PRODUCT");
    return res.status(422).render("admin/edit-product",{
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }



  Product.findById(prodId)
    .then((product)=>{
      if(product.userId.toString() !== req.user._id.toString()){
        console.log("WRONG USER TRIED TO EDIT THE PRODUCT");
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if(image){
        product.imageUrl = image.path;
      }
      return product.save().then(result=>{
          console.log("PRODUCT UPDATED SUCCESSFULLY");
          res.redirect("/admin/products");
      });
    })
    //? the catch() will catch the errors for both findByPk() and save()
    .catch(err=>{
      console.log("ERROR WHILE UPDATING PRODUCT");
      const error = new Error(err);
      error.httpStatusCode = 500; //? to access the status code of the error in the middleware
      //? when we pass error to next() then we tell express that an error occured and express will skip all
      //? other middlewares and go directly to the error handling middleware
      return next(error);
    })
};

exports.getProducts = (req, res, next) => {
  //? providing nothing inside find() will return all the products
  Product.find({userId: req.user._id})
    //? .select()("title price -_id") => will return only the title and price and eleminate id from the result
    //? .populate('userId') => will populate the userId from the product table with the data of that perticular user
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err)=>{
      console.log("ERROR WHILE FETCHING PRODUCTS");
      const error = new Error(err);
      error.httpStatusCode = 500; //? to access the status code of the error in the middleware
      return next(error);
    })
};
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(result=>{
      console.log("PRODUCT DESTROYED SUCCESSFULLY");
      res.redirect("/admin/products");
    })
    .catch(err=>{
      console.log("ERROR WHILE DELETING PRODUCT");
      const error = new Error(err);
      error.httpStatusCode = 500; //? to access the status code of the error in the middleware
      //? when we pass error to next() then we tell express that an error occured and express will skip all
      //? other middlewares and go directly to the error handling middleware
      return next(error);
    })
};
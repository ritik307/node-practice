const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("--------getAddProuct------");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
}; 

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err)=>{
      console.log("ERROR WHILE EDITING THE PRODUCT");
    });

};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product.findById(prodId)
    .then((product)=>{
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result=>{
      console.log("PRODUCT UPDATED SUCCESSFULLY");
      res.redirect("/admin/products");
    })
    //? the catch() will catch the errors for both findByPk() and save()
    .catch(err=>{
      console.log("ERROR WHILE UPDATING PRODUCT");
    })
};

exports.getProducts = (req, res, next) => {
  //? providing nothing inside find() will return all the products
  Product.find()
    //? .select()("title price -_id") => will return only the title and price and eleminate id from the result
    //? .populate('userId') => will populate the userId from the product table with the data of that perticular user
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err)=>{
      console.log("ERROR WHILE FETCHING PRODUCTS");
    })
};
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(result=>{
      console.log("PRODUCT DESTROYED SUCCESSFULLY");
      res.redirect("/admin/products");
    })
    .catch(err=>{
      console.log("ERROR WHILE DELETING PRODUCT");
      console.log(err);
    })
};
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  console.log("--------getAddProuct------");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title,price,description,imageUrl);

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
  req.user
    .getProducts({ where: { id: prodId } })
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch((err)=>{
      console.log("ERROR WHILE EDITING THE PRODUCT");
    });

};

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   Product.findByPk(prodId)
//     .then(product =>{
//       //? the below will only change the data locally
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imageUrl = updatedImageUrl;
//       //? below code will update the data to the database
//       //? to not start a callback hell type situtation we are returning the product.save promise and hadle it in the same .then() of the parent promise 
//       //? 
//       return product.save();
//     })
//     .then(result=>{
//       console.log("PRODUCT UPDATED SUCCESSFULLY");
//       res.redirect("/admin/products");
//     })
//     //? the catch() will catch the errors for both findByPk() and save()
//     .catch(err=>{
//       console.log("ERROR WHILE UPDATING PRODUCT");
//     })
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then(products => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err)=>{
//       console.log("ERROR WHILE FETCHING PRODUCTS");
//     })
// };
// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   //? here we can also directly call the delete() method of the product model by providing where clause
//   Product.findByPk(prodId)
//     .then(product=>{
//       console.log("PRODUCT IS : ");
//       console.log(product);
//       return product.destroy();
//     })
//     .then(result=>{
//       console.log("PRODUCT DESTROYED SUCCESSFULLY");
//       res.redirect("/admin/products");
//     })
//     .catch(err=>{
//       console.log("ERROR WHILE DELETING PRODUCT");
//       console.log(err);
//     })
// };
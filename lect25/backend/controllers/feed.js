const {validationResult} = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts=>{
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
      });
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422; //? we can name the field anything we want
    throw error; //? throw bcz we are NOT handling error in a promise
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/pokemon.png',
    creator: 'Ritik Rawal' 
  });
  post.save().then(result => {
    console.log("POST CREATED");
    // console.log(result);
    
    res.status(201).json({
      message: 'Post created successfully!',
      post: { 
        _id: new Date().toISOString(), 
        title: title, 
        content: content,
        creator: {name: "Ritik Rawal"},
        createdAt: new Date()
      } 
    });
  })
  .catch(err => {
    console.log("ERROR WHILE CREATING POST: ");
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err); //? next(err) bcz we are in a promise
  })
  
};

exports.getPost = (req,res,next)=>{
  console.log("GETTING POST");
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post)=>{
      if(!post){
        const error = new Error("Could not find post.");
        error.statusCode = 404; //? not found
        throw error; //? since we are using throw inside a promise so it will NOT call our error handler rather it will pass the PC(Program Counter) to catch block
      }
      res.status(200).json({message: "Post fetched.", post: post});
    })
    .catch((err)=>{
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    });
}
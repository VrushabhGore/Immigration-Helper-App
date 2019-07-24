const Post = require('../model/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');


// This gets all Posts
exports.getPosts = (req, res) => {
  const posts = Post.find()
  .populate('author','_id name')
  .select('_id title body')
  .then((posts)=>{
    res.status(200).json({posts:posts})
  })
  .catch(err => console.log('Error here: ',err));
};

//This Method is used to create Post
exports.createPost = (req,res,next) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,files)=>{
      if (err) {
        return res.status(400).json({
          error:'Image could not be uploaded'
        })
      };
      let post = new Post(fields)
      post.author = req.profile;
      if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contenType = files.photo.type;
      };
      post.save((err,result)=>{
        // console.log('Save started', result);
        if (err) {
          return res.status(400).json({
            error:err
          });
        }
        console.log(result.author.name);
        res.json(result);
      })
    });

};

// Gets Post By a User
exports.postByUser = (req,res) => {
  Post.find({author: req.profile._id})
  .populate('author','_id name')
  .sort('_created')
  .exec((err,posts)=>{
    if (err) {
      return res.status(404).json({
        error:err
      });
    }
    res.json(posts)
  })
}

exports.postById = (req,res,next,id) => {
  Post.findById(id)
  .populate('author','_id name')
  .select('_id title body')
  .exec((err,posts) =>{
    if (err || !post) {
      return res.status(400).json({
        error:err
      })
    }
    req.post = post
    next()
  });
}

exports.isPoster = (req,res,next) =>{
  const isPoster = req.post && req.auth && req.post.author._id === req.auth._id
  if (!isPoster) {
    return res.status(403).json({
      error:'User is not authorized!'
    });
    }
    next();

}

exports.updatePost = (req,res,next) => {
  let post = req.post
  post = _.extend(post,req.body)
  post.updated = Date.now();
  post.save(err => {
    if (err) {
      return res.status(400).json({
        error:err
      })
    }
    return res.json(post)
  });
}


exports.deletePost = (req,res) => {
  const post = req.post;
  post.remove((err,success)=>{
    if (err) {
      return res.status(400).json({error:error})
    }
    return res.json({message:'Post successfully deleted'})
  })
}

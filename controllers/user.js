const User = require('../model/user');
const _ = require('lodash');

exports.userById = (req,res,next,id) => {
  User.findById(id).exec((err,user) => {
    if (err || !user) {
      return res.status(400).json({
        error:'User not found'
      })
    }
    req.profile = user // adds profile object in req with user info
    next()
  });
};

exports.hasAuthorization = (req,res,next) => {
  const authorized = req.profile && req.auth & req.profile._id === req.auth._id
  if (!authorized) {
    return res.status(403).json({
      error: 'User not authorized'
    })
  }
  next();
}


exports.allUsers = (req,res) => {
  User.find((err,users) =>{
    if (err) {
      return res.status(400).json({
        error:err
      })
    }
    res.json({users:users})
  }).select("name email created updated");
}

exports.getUser = (req,res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined
  return res.json(req.profile)
}

exports.updateUser = (req,res,next) => {
  let user = req.profile;
  user = _.extend(user,req.body);
  user.updated = Date.now();
  user.save((err,user) =>{
    if (err) {
      return res.status(400).json({
        error:'You are not authorized to perform this action'
      });
    };
    user.salt = undefinedl
    user.hashed_password = undefined;
    res.json({user:user});
  })
}

exports.deleteUsers = (req,res,next) => {
  let user = req.profile;
  user.remove((err,user)=>{
    if (err) {
      return res.status(400).json({error:err})
    }
    res.json({message:'user deleted successfully'});
  })

}

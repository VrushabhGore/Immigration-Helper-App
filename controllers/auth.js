const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt')
const User = require('../model/user');

exports.signup = async (req,res) =>{
  const userExists = await User.findOne({email: req.body.email})
  if (userExists) {
    return res.status(403).json({
      error:'Email is taken'
    })
  }

  const user = await User(req.body)
  await user.save()
  res.status(200).json({message:'Signup Successful! Please login'})
}

exports.signin = (req,res) => {
  // find the user based on email
  const {email,password} = req.body

  User.findOne({email},(err,user)=>{
    // if error send authentication error
    // if error or no user send some error
    if (err || !user) {
      return res.status(401).json({
        error:'Email does not exists. Signup'
      })
    }
    //if user is found and password does not match

    if(!user.authenticate(password)){
      return res.status(401).json({
        error:'Incorrect Password.'
      })
    }
    //if user is found, authenticate
    // generate a token with user_id and secret key(FROM ENV)
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    // persist this token in a cookie and set an expiry date
    res.cookie('t',token,{expire: new Date() + 9999})
    // return response with user and token to frontend client
    const {_id,name,email} = user // Used to avoid writing user._id,user.name,user.email
    // return response with user and token to frontend client (COOKIE)
    // return response with user and token
    return res.json({token,user:{_id,email,name}})
  })
}

exports.signout = (req,res) =>{
  res.clearCookie('t')
  return res.json({
    message: 'Signout Successful!'
  })
}

exports.requireSignin = expressJwt({
  // if the token is valid, jwt appends the verified users id
  // in an auth key to the req object
  secret: process.env.JWT_SECRET,
  userProperty:'auth' // appended key
})

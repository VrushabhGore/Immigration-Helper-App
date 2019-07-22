const mongoose = require('mongoose');
const uuid = require('uuid/v1');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },
  email:{
    type:String,
    trim:true,
    required:true
  },
  hashed_password:{
    type:String,
    required:true
  },
  salt:String,
  created: {
    type:Date,
    default:Date.now
  },
  updated:{
    type:Date,
  }
})


//VIRTUAL FIELD

userSchema.virtual('password')
.set(function(password){
  //create a temporary variable called _password
  this._password = password
  //generate a timestamp
  this.salt = uuid()

  this.hashed_password = this.encryptPassword(password)
})
.get(function(){
  return this._password
})




userSchema.methods = {
  authenticate: function(plainText){
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password){
    if (!password) {
      return '';
    }
    try {

      return  crypto.createHmac('sha1',this.salt)
      .update(password).digest('hex');
    } catch (e) {
      return ''
    }
  }
}





module.exports = mongoose.model('User',userSchema);

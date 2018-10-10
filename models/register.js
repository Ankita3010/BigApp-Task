require('./../config.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var registerSchema = new mongoose.Schema({
  email : {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*((\.\w{2,3})+)$/i.test(email);
      },
      message: "Invalid email!"
    }
  },
  password : {
    type: String,
    minlength: 6,
    required: [true, 'Password is required'],
    trim: true
  },
  dob : {
    type: Date,
    required: [true, 'Date of Birth is required'],
    validate: {
      validator : function (date) {
        return (new Date(date) !== "Invalid Date");
      },
      message: "Invalid Date"
    },
    trim: true
  },
  username : {
    type: String,
    minlength: 6,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  role : {
    type: String,
    default: "user",
    trim: true
  },
  tokens: [{
    token : {
      type: String,
      required: true
    }
  }],
  attempts : {
    type: Number,
    default: 0
  }
});

registerSchema.pre('save' ,function(next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash){
        user.password = hash;
        return next();
      });
    });
  }
  else {
        return next();
    }
});

registerSchema.methods.toJSON = function () {
  var user = this;
  var obj = user.toObject();

  return {_id : user._id ,
      email : user.email,
      username: user.username,
      attempts : user.attempts,
      role: user.role };
}

registerSchema.statics.checkAuthentication = function(username, password){
  var User = this;

  return User.findOne({username}).then((user) => {
    if(!user) {
      return Promise.reject("User not found");
    }

    return new Promise ((resolve, reject) => {
      bcrypt.compare(password, user.password, function(err, result) {
      if(result){
        resolve(user);
      }
      else {
        reject("Incorrect password");
      }
    });
  });
});
}

registerSchema.methods.generateAuthToken = function(){
  var user = this;
  var token = jwt.sign({id : user._id.toHexString(), email : user.email}, SECRET_STRING).toString();

  user.tokens.push({token});
  return user.save().then(() => {
    return token;
  });
}

registerSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded = "";

  try{
    decoded = jwt.verify(token, SECRET_STRING);
  } catch (e) {
    return Promise.reject("Invalid token");
  }
  return User.findOne({_id: decoded.id, email:decoded.email, 'tokens.token' : token});
};

registerSchema.statics.updateData = function (id) {
  var User = this;
  return User.findByIdAndUpdate(id,
    { $inc: {attempts: 1} },
    {new : true }
  );
}

var Register = mongoose.model('Register', registerSchema);
module.exports = {Register};

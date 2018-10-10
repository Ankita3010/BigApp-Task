const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const {Register} = require('./models/register.js');
const {Balanced} = require('./models/balanced.js');
const {isBalanced} = require('./isBalanced.js');

exports.register = async (req, res) => {
  req.body.username = req.body.username.toLowerCase();
  req.body.email = req.body.email.toLowerCase();

  var user = new Register(req.body);
  try {
    var result = await user.save();
    if(result){
      res.send({"message" : "Registration successful"}).status(200);
    }
  } catch(e){
    res.status(400).json({"error": e.message});
  };
};

exports.login = async (req, res) => {

  var username = req.body.username.toLowerCase();
  var password = req.body.password;
  if( !username || !password) {
    return res.send("Username and password required").status(400);
  }
  try {
    var result = await Register.checkAuthentication(username, password);
    var token = await result.generateAuthToken();
    if(token){
      res.status(200).header('x-auth',token).send({
        token,
        message: "Success"
      });
    }
  } catch (e) {
    return res.json({"error":e}).status(400);
  }
};

exports.getUsers = (req, res) => {
  var role = req.user.role;

  Register.find().then((result) =>{
    if(!result){
      res.send("No users registered").status(200);
    }
    res.send(result).status(200);
  }).catch((e) => {
    res.json({"error":e}).status(400);
  });
}

exports.checkBalanced = async (req, res) => {
  var paranthesis = req.body.paranthesis.trim();
  if(!paranthesis.length){
    return res.status(400).json({"error":"Invalid input"});
  }
  var user = req.user;
  let message = "Failed";
  try {
      if(isBalanced(paranthesis)){
        message = "Success";
        balancedData = new Balanced({
          paranthesis,
          username: user.username,
          message
        });
        await balancedData.save();
      }

      var updatedUser = await Register.updateData(user._id);
      return res.status(200).json({
              "username": updatedUser.username,
              "message" : message,
              "attempts": updatedUser.attempts
            });
    } catch(e){
        return res.json({"error":e}).status(400);
    };
}

exports.deleteUser = async (req, res) => {
  var role = req.user.role;
  if(role !== 'admin'){
    return res.status(400).json({"error":"User not allowed"});
  }
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).json({"error":"Invalid ID"});
  }
  try {
    var result_register = await Register.findByIdAndRemove(id);

    if(!result_register){
      res.status(404).json({"error": "User not found"});
    }
    var result_balanced = await Balanced.deleteMany({username : result_register.username});
    res.status(200).send({"message" : "Successfully deleted"});
  } catch (e) {
      return res.status(400).json({"error":e});
  }
}

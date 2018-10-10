const mongoose = require('mongoose');

var balancedSchema = new mongoose.Schema({
  paranthesis: {
    type : String,
    required : true
  },
  username : {
    type: String,
    minlength: 6,
    required: true,
  },
  message : {
    type: String,
    default: "Success"
  }
});

var Balanced = mongoose.model('Balanced', balancedSchema);
module.exports = {Balanced};

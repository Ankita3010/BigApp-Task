const {Register} = require('./models/register.js');

exports.admin = (req, res, next) => {
    var token = req.header('x-auth');
    Register.findByToken(token).then((result) => {

      if(!result) {
        res.status(404).json({"error" : "User not found"});
      }
      if(result.role !== 'admin') {
        return res.status(400).send({"error" : "User not authorised"});
      }
        req.user = result;
        req.token = token;
        next();
    }).catch((e) => {
      res.status(400).json({"error" : e});
    });
}

exports.user = (req, res, next) => {
    var token = req.header('x-auth');
    Register.findByToken(token).then((result) => {
      if(!result) {
        res.status(404).json({"error" : "User not found"});
      }
        req.user = result;
        req.token = token;
        next();
    }).catch((e) => {
      res.status(400).json({"error" : e});
    });
}

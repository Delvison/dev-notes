// UserHandler.js

// dependencies
var User = require('../models/user.js')
var pass_util = require('../lib/password_utility.js')

var UserHandler = function() { }

// GET /api/users
UserHandler.prototype.getUsers = function(req, res){
  User.find(function(err, users){
    if (err) {
      res.send(err)
      return res.status(404).send()
    }
		res.json(users)
		return res.status(200).send()
  })
}

// POST /api/users
UserHandler.prototype.createUser = function(req, res){
  var user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  user.salt = pass_util.generate_salt()
  user.password = pass_util.generate_hash(req.body.password, user.salt);
  user.save(function(err, user){
    if (err) return res.status(409).send(err.errmsg)
		res.json(user)
		return res.status(200).send()
  })
}

// POST /api/users/login
// TODO: implement accessToken
UserHandler.prototype.login = function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({email:email}, function(err, user){
    if (err) return res.status(500).send()
    if (!user) return res.status(404).send();
    if (pass_util.validate_password(password, user.salt, user.password)) {
			req.session.user = user;
			return res.status(200).send({
        id: user._id,
        email: user.email,
        username: user.username
      })
    } else {
      //invalid password
      return res.status(401).send({error: "invalid password"});
    }
  })
}

// GET /api/users/logout
UserHandler.prototype.logout = function(req,res){
  if (!req.session.user) return res.status(401).send()
	req.session.destroy();
	return res.status(200).send()
}

// GET /api/users/:user_id
UserHandler.prototype.getUser = function(req, res){
  var id = req.params.user_id;
  if (!id) return res.status(404).send();
  User.findById(id, function(err, user){
    if (err) return res.status(500).send();
		if (!user) return res.status(404).send();
    delete user.salt;
		delete user.password;
		return res.status(200).send(user);
  });
}

UserHandler.prototype.editProfile = function(req, res){
	// TODO: write me
}

module.exports = UserHandler;

// ./lib/password_utility.js

 var crypto = require('crypto');

exports.generate_salt = function() {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for(var i = 8; i > 0; --i){
    result += chars[Math.round(Math.random() * (chars.length - 1))]
  }
  return result;
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
  try {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
  } catch(err) {
    console.log("sha512 failed: %s %s", password, hash);
  }
};

var validate_password = function(password, salt, hashed_pwd){
  if (sha512(password, salt) === hashed_pwd){
    return true;
  } else {
    return false;
  }
}

exports.generate_hash = sha512;
exports.validate_password = validate_password;

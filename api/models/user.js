// ./models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
      type : String,
      required: true,
    },
    username: {
      type : String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    date_created: {
      type: Date,
      default: Date.now
    },
    is_admin: {
      type: Boolean,
      default: false
    },
    status: {
      default: ""
    },
    profile: {
      status: { type: String, default: "" },
      github_url: { type: String, default: "" },
      friends: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}]
    },
    date_updated: Date,
    projects : [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project'
		}]
});
// TODO: uniqueness on email and username
UserSchema.index({email: 1}, {unique: true});

module.exports = mongoose.model('User', UserSchema);

// ./models/project.js 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	title: {
		type: String,
		required: false
	},
	date_created: {
      type: Date,
      default: Date.now
  },
	date_updated: Date,
  user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

module.exports = mongoose.model('Project', ProjectSchema);
